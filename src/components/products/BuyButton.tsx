'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentfulProduct } from '@/types';

interface BuyButtonProps {
  product: ContentfulProduct;
}

export default function BuyButton({ product }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleBuyNow = async () => {
    if (!product.fields.stockStatus) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Store product and quantity in session storage for the buy page
      const purchaseData = {
        product: {
          id: product.sys.id,
          title: product.fields.productTitle,
          price: product.fields.price,
          image: product.fields.images?.[0]?.fields?.file?.url || '',
          category: product.fields.category,
        },
        quantity,
        totalAmount: product.fields.price * quantity,
      };
      
      sessionStorage.setItem('purchaseData', JSON.stringify(purchaseData));
      
      // Navigate to buy page
      router.push('/buy');
    } catch (error) {
      console.error('Error preparing purchase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    // This would typically integrate with a cart system
    // For now, we'll just show a simple notification
    alert(`Added ${quantity} x ${product.fields.productTitle} to cart!`);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-3">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity:
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <input
            id="quantity"
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="w-16 py-2 text-center border-0 focus:ring-0 focus:outline-none"
          />
          
          <button
            type="button"
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            disabled={quantity >= 10}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Total Price */}
      <div className="text-lg font-semibold text-gray-900">
        Total: <span className="text-blue-600">${(product.fields.price * quantity).toFixed(2)}</span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={!product.fields.stockStatus || isLoading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            product.fields.stockStatus
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
              : 'bg-gray-400 cursor-not-allowed'
          } ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Processing...</span>
            </div>
          ) : (
            <>
              {product.fields.stockStatus ? 'Buy Now' : 'Out of Stock'}
            </>
          )}
        </button>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.fields.stockStatus}
          className={`w-full py-3 px-6 rounded-lg font-semibold border-2 transition-colors ${
            product.fields.stockStatus
              ? 'border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-4 focus:ring-blue-200'
              : 'border-gray-300 text-gray-400 cursor-not-allowed'
          }`}
        >
          Add to Cart
        </button>
      </div>

      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Secure Payment</span>
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Money Back Guarantee</span>
        </div>
      </div>
    </div>
  );
}