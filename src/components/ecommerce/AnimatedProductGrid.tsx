'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ProductCard } from './ProductCard';
import { Filter, Grid, List, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{
    image: {
      url: string;
      alt: string;
    };
    alt: string;
  }>;
  categories: Array<{
    name: string;
    slug: string;
  }>;
  featured: boolean;
}

interface AnimatedProductGridProps {
  products: Product[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export function AnimatedProductGrid({ 
  products, 
  loading = false, 
  viewMode = 'grid',
  className = '' 
}: AnimatedProductGridProps) {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loadedCount, setLoadedCount] = useState(12);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Load more products when scrolling
  useEffect(() => {
    if (inView && loadedCount < products.length) {
      const timer = setTimeout(() => {
        setLoadedCount(prev => Math.min(prev + 8, products.length));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [inView, loadedCount, products.length]);

  // Update visible products when products or loadedCount changes
  useEffect(() => {
    setVisibleProducts(products.slice(0, loadedCount));
  }, [products, loadedCount]);

  // Reset loaded count when products change (e.g., filtering)
  useEffect(() => {
    setLoadedCount(12);
  }, [products]);

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className={`grid ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
            : 'grid-cols-1 gap-6'
        }`}>
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} viewMode={viewMode} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Grid className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
      </motion.div>
    );
  }

  return (
    <div className={className}>
      {/* Products Grid */}
      <motion.div
        layout
        className={`grid ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
            : 'grid-cols-1 gap-6'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {visibleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05,
                layout: { duration: 0.3 }
              }}
              className="h-fit"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Trigger */}
      {loadedCount < products.length && (
        <div ref={ref} className="flex justify-center mt-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading more products...</p>
          </motion.div>
        </div>
      )}

      {/* Load More Button (Alternative) */}
      {loadedCount < products.length && !inView && (
        <div className="flex justify-center mt-12">
          <Button
            onClick={() => setLoadedCount(prev => Math.min(prev + 8, products.length))}
            variant="outline"
            size="lg"
          >
            Load More Products ({products.length - loadedCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}

// Product Card Skeleton Component
function ProductCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 aspect-square bg-gray-200" />
          <div className="flex-1 p-6">
            <div className="h-6 bg-gray-200 rounded mb-4 w-3/4" />
            <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
            <div className="h-4 bg-gray-200 rounded mb-4 w-2/3" />
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-16" />
              <div className="h-6 bg-gray-200 rounded-full w-20" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gray-200 rounded w-24" />
              <div className="h-10 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 rounded mb-4 w-full" />
        <div className="flex gap-1 mb-4">
          <div className="h-5 bg-gray-200 rounded-full w-12" />
          <div className="h-5 bg-gray-200 rounded-full w-16" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}