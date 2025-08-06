'use client';

import { useState } from 'react';
import { ContentfulProduct } from '@/types';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductDescription from './ProductDescription';
import BuyButton from './BuyButton';

interface ProductDetailPageProps {
  product: ContentfulProduct;
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-blue-600">Home</a>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <a href="/products" className="hover:text-blue-600">Products</a>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">
              {product.fields.productTitle}
            </li>
          </ol>
        </nav>

        {/* Main Product Content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Left Column - Image Gallery */}
            <div className="space-y-4">
              <ProductImageGallery
                images={product.fields.images || []}
                selectedIndex={selectedImageIndex}
                onImageSelect={setSelectedImageIndex}
                productTitle={product.fields.productTitle}
              />
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              <ProductInfo product={product} />
              
              {/* Buy Button */}
              <BuyButton product={product} />
              
              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  product.fields.stockStatus ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className={`text-sm font-medium ${
                  product.fields.stockStatus ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.fields.stockStatus ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Product Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Product Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Premium quality materials</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Professional printing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Fast shipping</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-day return policy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Product Description */}
          {product.fields.description && (
            <div className="border-t border-gray-200 p-6 lg:p-8">
              <ProductDescription description={product.fields.description} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}