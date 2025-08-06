'use client';

import { ContentfulProduct } from '@/types';

interface ProductInfoProps {
  product: ContentfulProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { fields } = product;

  return (
    <div className="space-y-4">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {fields.productTitle}
        </h1>
        
        {/* Category */}
        {fields.category && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Category:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {fields.category}
            </span>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="text-4xl font-bold text-blue-600">
          ${fields.price?.toFixed(2) || '0.00'}
        </div>
        
        {/* Price Details */}
        <div className="text-sm text-gray-600">
          <p>• Free shipping on orders over $50</p>
          <p>• 30-day return policy</p>
          <p>• Professional quality guarantee</p>
        </div>
      </div>

      {/* Product Highlights */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Why Choose This Frame?</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Museum-quality materials for long-lasting beauty</span>
          </li>
          <li className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>UV-resistant glass protects your photos from fading</span>
          </li>
          <li className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Easy hanging system included</span>
          </li>
          <li className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Handcrafted with attention to detail</span>
          </li>
        </ul>
      </div>

      {/* Shipping Info */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h4 className="font-semibold text-gray-900">Shipping & Delivery</h4>
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <p>• Standard shipping: 5-7 business days</p>
          <p>• Express shipping: 2-3 business days</p>
          <p>• Free standard shipping on orders over $50</p>
        </div>
      </div>
    </div>
  );
}