import React from 'react';

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <HeaderSkeleton />

      {/* Breadcrumb Skeleton */}
      <BreadcrumbSkeleton />

      {/* Product Details Skeleton */}
      <ProductDetailsSkeleton />

      {/* Product Tabs Skeleton - Desktop */}
      <ProductTabsSkeleton />

      {/* Related Products Skeleton */}
      <RelatedProductsSkeleton />

      {/* Footer Skeleton */}
      <FooterSkeleton />
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="h-20 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        <div className="flex gap-4">
          <div className="h-8 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          <div className="h-8 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

function BreadcrumbSkeleton() {
  return (
    <nav className="bg-white border-b py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 animate-pulse">
          <div className="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <span className="text-gray-300">/</span>
          <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <span className="text-gray-300">/</span>
          <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        </div>
      </div>
    </nav>
  );
}

function ProductDetailsSkeleton() {
  return (
    <section className="py-3 md:py-5 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Left Column - Product Gallery Skeleton */}
          <div className="w-full lg:w-1/2">
            <ProductGallerySkeleton />
          </div>

          {/* Right Column - Product Info Skeleton */}
          <div className="w-full lg:w-1/2 lg:pr-4">
            <ProductInfoSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductGallerySkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Main Image */}
      <div className="aspect-square bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-300/20 to-transparent"></div>
        {/* View mode buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="h-10 w-10 bg-white/80 rounded-lg"></div>
          <div className="h-10 w-10 bg-white/80 rounded-lg"></div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-2 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="h-20 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex-shrink-0"
            style={{ animationDelay: `${i * 100}ms` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

function ProductInfoSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-6 w-20 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-full"></div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded"></div>
            ))}
          </div>
          <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        </div>
      </div>

      {/* Price and Controls */}
      <div className="space-y-6">
        {/* Price */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        </div>

        {/* Size Selection */}
        <div className="space-y-3">
          <div className="h-5 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded border"></div>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <div className="h-5 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Material Selection */}
        <div className="space-y-3">
          <div className="h-5 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded border"></div>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="h-12 w-full bg-gradient-to-r from-pink-200 to-pink-300 rounded-lg"></div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4 py-6 border-t">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <div className="h-6 w-6 bg-gradient-to-r from-pink-200 to-pink-300 rounded mx-auto"></div>
            <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded mx-auto"></div>
            <div className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded mx-auto"></div>
          </div>
        ))}
      </div>

      {/* Mobile Tabs */}
      <div className="lg:hidden space-y-4">
        <div className="flex gap-4 border-b">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-4 w-4/5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function ProductTabsSkeleton() {
  return (
    <div className="hidden lg:block py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
          {/* Tab Navigation */}
          <div className="flex gap-8 border-b mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            <div className="h-6 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              ))}
              <div className="h-4 w-2/3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded mx-auto mb-4"></div>
          <div className="h-4 w-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <RelatedProductCardSkeleton key={i} delay={i * 100} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RelatedProductCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-square bg-gradient-to-r from-gray-200 to-gray-300"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        <div className="h-4 w-2/3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-8 w-16 bg-gradient-to-r from-pink-200 to-pink-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function FooterSkeleton() {
  return (
    <div className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-24 bg-gray-700 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-700 rounded"></div>
                <div className="h-4 w-28 bg-gray-700 rounded"></div>
                <div className="h-4 w-36 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center animate-pulse">
            <div className="h-4 w-48 bg-gray-700 rounded"></div>
            <div className="h-4 w-64 bg-gray-700 rounded mt-4 md:mt-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
