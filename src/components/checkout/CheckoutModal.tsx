import React, { useState } from 'react';
import { X, CreditCard, MapPin, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCheckout, CheckoutData } from '../../hooks/useCheckout';
import AuthModal from '../auth/AuthModal';
import { API_BASE_URL } from '@/lib/auth';

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
    country: 'IN',
  });

  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'razorpay'>('stripe');


  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  if (!isOpen || items.length === 0) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const cartTotal = items.reduce((sum, item) => sum + item.price, 0);

    // PayU integration handler
    const handleCartClick = async () => {
      // Collect order items from frameCollection
      const allItems = items.map(frame => ({
        productId: frame.id, // Replace with real productId if available
        quantity: 1,
        price: frame.price, // Or frame.price if available
        size: frame.customization.size,
        frameType: frame.customization.material,
        imageUrl: frame.image,
        frameColor: frame.customization.frameColor,
        borderColor: frame.customization.borderColor,
        borderWidth: frame.customization.borderWidth,
        material: frame.customization.material,
        effect: frame.customization.effect,
      }));
      // Collect shipping address from user or fallback
      const shippingAddress = user ? {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName || '',
        email: shippingData.email,
        phone: shippingData.phone,
        street: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        zipCode: shippingData.zipCode,
        country: 'IN',
      } : {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        email: shippingData.email,
        phone: shippingData.phone,
        street: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        zipCode: shippingData.zipCode,
        country: 'IN',
      };
      const order = {
        items:allItems,
        totalAmount: cartTotal,
        shippingAddress,
        shippingCost: 0,
        taxAmount: 0,
        notes: '',
      };
      const txnid = Date.now().toString();
      const amount = cartTotal;
      const productinfo = 'FrameIt Custom Frame';
      const firstname = shippingAddress.firstName;
      const email = shippingAddress.email;
      const key = process.env.NEXT_PUBLIC_PAYU_KEY;
      const salt = process.env.NEXT_PUBLIC_PAYU_SALT;
      const udf1 = '';
      const udf2 = '';
      const udf3 = '';
      const udf4 = '';
      const udf5 = '';
      console.log({amount})
      // 1. Generate hash
      const hashRes = await fetch(`${API_BASE_URL}/api/v1/payments/payu/generate-hash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, txnid, amount, productinfo, firstname, email, salt, udf1, udf2, udf3, udf4, udf5 })
      });
      const { hash } = await hashRes.json();
      // 2. Initiate payment
      //Todo: change later
      const surl = `http://localhost:3001/success`;
      const furl = `http://localhost:3001/failure`;
      const res = await fetch(`${API_BASE_URL}/api/v1/payments/payu/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, surl, furl, userId: user?.id, key, txnid, amount, productinfo, firstname, email, hash, udf1, udf2, udf3, udf4, udf5 })
      });
      const data = await res.json();
      if (data && data.action && data.params) {
        // Create and submit form
        const form = document.createElement('form');
        form.action = data.action;
        form.method = 'POST';
        form.style.display = 'none';
        Object.entries(data.params).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });
        // Add udf1-udf5 as hidden fields if not present
        ['udf1','udf2','udf3','udf4','udf5'].forEach((udf) => {
          if (!data.params[udf]) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = udf;
            input.value = '';
            form.appendChild(input);
          }
        });
        document.body.appendChild(form);
        form.submit();
      }
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

      handleCartClick();
      
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-5 bg-white 00 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={shippingData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-5 bg-white 00 focus:border-transparent"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={shippingData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-5 bg-white 00 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-5 bg-white 00 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street address"
                    value={shippingData.address}
                    onChange={handleInputChange}
                    required
                    className="md:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-5 bg-white 00 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-5 bg-white 00 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State/Province"
                    value={shippingData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-5 bg-white 00 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP/Postal code"
                    value={shippingData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-5 bg-white 00 focus:border-transparent"
                  />
                
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
