'use client';

import Image from 'next/image';

interface PurchaseData {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
  };
  quantity: number;
  totalAmount: number;
}

interface OrderSummaryProps {
  purchaseData: PurchaseData;
  shippingCost: number;
  tax: number;
  total: number;
}

export default function OrderSummary({
  purchaseData,
  shippingCost,
  tax,
  total,
}: OrderSummaryProps) {
  const { product, quantity } = purchaseData;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      {/* Product Item */}
      <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {product.image ? (
            <Image
              src={product.image.startsWith('//') ? `https:${product.image}` : product.image}
              alt={product.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 capitalize">
            {product.category}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">Qty: {quantity}</span>
            <span className="text-sm font-medium text-gray-900">
              ${(product.price * quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${purchaseData.totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {shippingCost === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-semibold text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Free Shipping Notice */}
      {shippingCost === 0 && purchaseData.totalAmount >= 50 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-green-800">
              You qualify for free shipping!
            </span>
          </div>
        </div>
      )}

      {/* Security Badges */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>SSL Secured</span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Money Back</span>
          </div>
        </div>
      </div>
    </div>
  );
}