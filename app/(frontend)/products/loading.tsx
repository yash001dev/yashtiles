import React from 'react';

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <HeaderSkeleton />

      {/* Hero Section Skeleton */}
      <HeroSkeleton />

      {/* Categories Skeleton */}
      <CategoriesSectionSkeleton />

      {/* Filters Skeleton */}
      <FiltersSkeleton />

      {/* Products Grid Skeleton */}
      <ProductsGridSkeleton />

      {/* FAQ Section Skeleton */}
      <FAQSkeleton />

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

function HeroSkeleton() {
  return (
    <div className="pt-16 pb-8 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="animate-pulse space-y-4">
            <div className="h-16 w-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mx-auto"></div>
            <div className="h-6 w-80 bg-gradient-to-r from-gray-200 to-gray-300 rounded mx-auto"></div>
            <div className="h-4 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoriesSectionSkeleton() {
  return (
    <div className="pb-2 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="h-12 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse flex-shrink-0"
                style={{ animationDelay: `${i * 100}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="py-8 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="animate-pulse">
            <div className="h-10 w-80 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          </div>
          <div className="flex gap-4 animate-pulse">
            <div className="h-10 w-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            <div className="h-10 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            <div className="h-10 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          </div>
        </div>
        <div className="mt-4 h-4 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Results count skeleton */}
        <div className="mb-6">
          <div className="h-4 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(12)].map((_, i) => (
            <ProductCardSkeleton key={i} delay={i * 50} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image Skeleton */}
      <div className="aspect-square bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse relative">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6 animate-pulse">
        <div className="flex items-start justify-between mb-2">
          <div className="h-5 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
          <div className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            <div className="h-6 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          </div>
          <div className="h-10 w-24 bg-gradient-to-r from-pink-200 to-pink-300 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

function FAQSkeleton() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-10 w-80 bg-gradient-to-r from-gray-200 to-gray-300 rounded mx-auto mb-4"></div>
          <div className="h-4 w-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded mx-auto"></div>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="border border-gray-200 rounded-lg p-6 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-5 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            </div>
          ))}
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