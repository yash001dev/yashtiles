'use client';

import React, { useState, useEffect } from 'react';
import { X, CreditCard, MapPin, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { useCheckout, CheckoutData } from '../../hooks/useCheckout';
import AuthModal from '../auth/AuthModal';
import { API_BASE_URL } from '@/lib/auth';
import { base64ToFile } from '@/redux/utils';

// Zod schema for form validation
const shippingSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required').min(10, 'Phone number must be at least 10 digits').regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  address: z.string().min(1, 'Address is required').min(5, 'Address must be at least 5 characters'),
  city: z.string().min(1, 'City is required').min(2, 'City must be at least 2 characters'),
  state: z.string().min(1, 'State is required').min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(1, 'ZIP code is required').regex(/^[0-9]{6}$/, 'Please enter a valid 6-digit ZIP code'),
  country: z.string().min(1, 'Country is required'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

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
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'razorpay'>('stripe');

  // Initialize form with react-hook-form and zod validation
  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'IN',
    },
    mode: 'onChange',
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isValid } } = form;

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('email', user.email || '');
    }
  }, [user, setValue]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      reset();
      clearError();
    }
  }, [isOpen]);

  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  if (!isOpen || items.length === 0) return null;

  const cartTotal = items.reduce((sum, item) => sum + item.price, 0);

  // PayU integration handler
  const handleCartClick = async (shippingData: ShippingFormData) => {
      // Collect order items from frameCollection
      const allItems = items.map(frame => ({
        productId: frame.id, // Replace with real productId if available
        quantity: 1,
        price: frame.price, // Or frame.price if available
        size: frame.customization.size,
        frameType: frame.customization.material,
        // imageUrl: frame.image,
        frameColor: frame.customization.frameColor,
        borderColor: frame.customization.borderColor,
        borderWidth: frame.customization.borderWidth,
        material: frame.customization.material,
        effect: frame.customization.effect,
      }));
      
      // Collect shipping address from form data
      const shippingAddress = {
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
        items: allItems,
        totalAmount: cartTotal,
        shippingAddress,
        shippingCost: 0,
        taxAmount: 0,
        notes: '',
      };
      
      const txnid = Date.now().toString();
      const amount = cartTotal;
      const productinfo = 'PhotoFramix Custom Frame';
      const firstname = shippingAddress.firstName;
      const email = shippingAddress.email;
      const key = process.env.NEXT_PUBLIC_PAYU_KEY;
      const salt = process.env.NEXT_PUBLIC_PAYU_SALT;
      const udf1 = '';
      const udf2 = '';
      const udf3 = '';
      const udf4 = '';
      const udf5 = '';
      
      console.log({amount});
      
      // 1. Generate hash
      const hashRes = await fetch(`${API_BASE_URL}/api/v1/payments/payu/generate-hash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, txnid, amount, productinfo, firstname, email, salt, udf1, udf2, udf3, udf4, udf5 })
      });
      const { hash } = await hashRes.json();
      
      // 2. Prepare FormData for PayU initiation with frame images
      const formData = new FormData();
      
      // Convert image URLs to File objects and append to FormData
      const imagePromises = items.map(async (item, index) => {
        if (item.image) {
          try {
            // Check if it's a data URL or regular URL
            if (item.image.startsWith('data:')) {
              // Handle data URLs (base64 images) using our utility function
              const file = base64ToFile(item.image, `frame-${index + 1}.jpg`);
              formData.append('frameImages', file);
            } else {
              // Handle regular URLs
              const response = await fetch(item.image, { 
                mode: 'cors',
                headers: {
                  'Accept': 'image/*'
                }
              });
              if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status}`);
              }
              const blob = await response.blob();
              const file = new File([blob], `frame-${index + 1}.jpg`, { type: blob.type || 'image/jpeg' });
              formData.append('frameImages', file);
            }
          } catch (error) {
            console.error(`Failed to fetch image for item ${index}:`, error);
            // Continue without this image rather than failing the entire process
          }
        }
      });
      
      // Wait for all image conversions to complete
      await Promise.all(imagePromises);
      
      // Append other form data as JSON strings
      formData.append('order', JSON.stringify(order));
      formData.append('surl', typeof window !== 'undefined' ? `${window.location.origin}/api/payu/success` : '');
      formData.append('furl', typeof window !== 'undefined' ? `${window.location.origin}/api/payu/failure` : '');
      formData.append('userId', user?.id || '');
      formData.append('key', key || '');
      formData.append('txnid', txnid);
      formData.append('amount', amount.toString());
      formData.append('productinfo', productinfo);
      formData.append('firstname', firstname);
      formData.append('email', email);
      formData.append('hash', hash);
      formData.append('udf1', udf1);
      formData.append('udf2', udf2);
      formData.append('udf3', udf3);
      formData.append('udf4', udf4);
      formData.append('udf5', udf5);
      
      // 3. Initiate payment with FormData
      const res = await fetch(`${API_BASE_URL}/api/v1/payments/payu/initiate`, {
        method: 'POST',
        body: formData, // Don't set Content-Type header, let browser set it for FormData
      });
      
      const data = await res.json();
      if (data && data.action && data.params) {
        if (typeof document !== 'undefined') {
          // Submit to PayU payment gateway using form submission
          const paymentForm = document.createElement('form');
          paymentForm.action = data.action;
          paymentForm.method = 'POST';
          paymentForm.style.display = 'none';
          
          // Add all parameters as hidden inputs
          Object.entries(data.params).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value);
            paymentForm.appendChild(input);
          });
          
          // Add udf1-udf5 if not present
          ['udf1','udf2','udf3','udf4','udf5'].forEach((udf) => {
            if (!data.params[udf]) {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = udf;
              input.value = '';
              paymentForm.appendChild(input);
            }
          });
          
          document.body.appendChild(paymentForm);
          paymentForm.submit();
        }
      }
    };
  
  const onSubmit = async (formData: ShippingFormData) => {
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
        shippingAddress: formData,
        paymentMethod,
        totalAmount,
      };

      await handleCartClick(formData);
      
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



            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Shipping Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin size={18} className="mr-2" />
                  Shipping Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First name"
                      {...register('firstName')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:border-transparent ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last name"
                      {...register('lastName')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:border-transparent ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email address"
                      {...register('email')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      {...register('phone')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:border-transparent ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Street address"
                      {...register('address')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:border-transparent ${
                        errors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      {...register('city')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:border-transparent ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="State/Province"
                      {...register('state')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:border-transparent ${
                        errors.state ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="ZIP/Postal code"
                      {...register('zipCode')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white focus:border-transparent ${
                        errors.zipCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                    )}
                  </div>
                
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
                disabled={isLoading || !isAuthenticated || !isValid}
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
