import React from 'react';

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="h-20 bg-white border-b animate-pulse">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="flex gap-4">
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="pt-16 pb-2 bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-16 w-96 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-6 w-80 bg-gray-200 rounded mx-auto"></div>
          </div>

          {/* Categories Skeleton */}
          <div className="mb-4">
            <div className="flex gap-4 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 w-32 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between animate-pulse">
            <div className="h-10 w-80 bg-gray-200 rounded"></div>
            <div className="flex gap-4">
              <div className="h-10 w-40 bg-gray-200 rounded"></div>
              <div className="h-10 w-20 bg-gray-200 rounded"></div>
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="mt-4 h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200"></div>
      
      {/* Content Skeleton */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
            <div className="h-6 w-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
