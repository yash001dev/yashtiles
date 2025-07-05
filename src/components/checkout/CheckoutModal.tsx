import React, { useState } from 'react';
import { X, CreditCard, MapPin, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCheckout, CheckoutData } from '../../hooks/useCheckout';
import AuthModal from '../auth/AuthModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: {
    id: string;
    name: string;
    price: number;
    customization: any;
    image?: string;
  }[];
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, items }) => {
  const { isAuthenticated, user } = useAuth();
  const { processCheckout, isLoading, error, clearError } = useCheckout();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [shippingData, setShippingData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'razorpay'>('stripe');

  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  if (!isOpen || items.length === 0) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    clearError();

    try {
      const checkoutData: CheckoutData = {
        items: items.map(item => ({
          ...item,
          quantity: 1,
        })),
        shippingAddress: shippingData,
        paymentMethod,
        totalAmount,
      };

      const result = await processCheckout(checkoutData);
      
      if (result.success) {
        if (result.paymentUrl) {
          // Redirect to payment page
          window.location.href = result.paymentUrl;
        } else {
          // Show success message and close modal
          alert('Order placed successfully!');
          onClose();
        }
      }
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Package size={18} className="mr-2" />
                Order Summary
              </h3>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.name} {items.length > 1 ? `${index + 1}` : ''}</p>
                        <p className="text-sm text-gray-600">
                          {item.customization.size} • {item.customization.material} • {item.customization.frameColor}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">₹{item.price}</p>
                  </div>
                ))}
                
                {/* Total */}
                {items.length > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                    <p className="font-semibold text-gray-900">Total ({items.length} items)</p>
                    <p className="font-bold text-lg text-gray-900">₹{totalAmount}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Auth Check */}
            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  Please sign in to continue with your order.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin size={18} className="mr-2" />
                  Shipping Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={shippingData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={shippingData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={shippingData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street address"
                    value={shippingData.address}
                    onChange={handleInputChange}
                    required
                    className="md:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State/Province"
                    value={shippingData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP/Postal code"
                    value={shippingData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <select
                    name="country"
                    value={shippingData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="IN">India</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard size={18} className="mr-2" />
                  Payment Method
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <CreditCard size={20} className="mr-2 text-gray-600" />
                      <span>Credit/Debit Card (Stripe)</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <span className="text-blue-600 font-bold mr-2">PayPal</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <span className="text-blue-800 font-bold mr-2">Razorpay</span>
                      <span className="text-sm text-gray-600">(India)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isAuthenticated}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-3 rounded-lg transition-colors duration-200"
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
};

export default CheckoutModal;
