'use client'

import { motion } from 'framer-motion'

export function ProductsHeroSkeleton() {
  return (
    <section className="pt-16 pb-2 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-14 bg-gray-200 rounded-lg animate-pulse mb-4 max-w-2xl mx-auto" />
          <div className="h-6 bg-gray-200 rounded animate-pulse max-w-xl mx-auto" />
        </div>
      </div>
    </section>
  )
}

export function CategoriesSkeleton() {
  return (
    <div className="mb-4 relative">
      <div className="flex gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0">
            <div className="h-12 w-32 bg-gray-200 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(12)].map((_, i) => (
        <ProductCardSkeleton key={i} delay={i * 0.1} />
      ))}
    </div>
  )
}

function ProductCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden h-full"
    >
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-200 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse flex-1 mr-2" />
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
        
        {/* Categories */}
        <div className="flex gap-1 mb-4">
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
        </div>
      </div>
    </motion.div>
  )
}

export function ProductsFiltersSkeleton() {
  return (
    <section className="py-8 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Skeleton */}
          <div className="relative flex-1 max-w-md">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          
          {/* Controls Skeleton */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
        
        {/* Results Count Skeleton */}
        <div className="mt-4">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </section>
  )
}
