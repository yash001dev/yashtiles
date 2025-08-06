'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ContentfulProduct } from '@/types';
import { getOptimizedImageUrl } from '@/lib/contentful';

interface ProductCardProps {
  product: ContentfulProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { sys, fields } = product;
  const primaryImage = fields.images?.[0];
  const imageUrl = primaryImage?.fields?.file?.url;

  return (
    <Link href={`/products/${sys.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={getOptimizedImageUrl(imageUrl, 400, 400)}
              alt={primaryImage.fields.title || fields.productTitle}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-gray-400 text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">No Image</span>
              </div>
            </div>
          )}
          
          {/* Stock Status Badge */}
          {!fields.stockStatus && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
          
          {/* Category Badge */}
          {fields.category && (
            <div className="absolute top-2 left-2">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full capitalize">
                {fields.category}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {fields.productTitle}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">
              ${fields.price?.toFixed(2) || '0.00'}
            </div>
            
            <div className="flex items-center space-x-2">
              {fields.stockStatus ? (
                <span className="text-green-600 text-sm font-medium">
                  In Stock
                </span>
              ) : (
                <span className="text-red-500 text-sm font-medium">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
          
          {/* Quick View Button */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}