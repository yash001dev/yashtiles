'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import ProductCardServer from './ProductCardServer';
import ProductListItemServer from './ProductListItemServer';
import { useProductsContext } from './ProductsContext';
import { FormattedProduct } from '@/lib/payload-server';

interface ProductsGridProps {
  selectedCategory?: string;
  searchQuery?: string;
  sortBy?: string;
  viewMode?: 'grid' | 'list';
  initialProducts: FormattedProduct[];
  initialCategories: any[];
}

export default function ProductsGrid({ 
  selectedCategory: initialCategory = 'all',
  searchQuery: initialSearch = '',
  sortBy: initialSort = 'name',
  viewMode: initialView = 'grid',
  initialProducts,
  initialCategories
}: ProductsGridProps) {
  const {
    selectedCategory,
    searchQuery,
    sortBy,
    viewMode,
  } = useProductsContext();

  const [filteredProducts, setFilteredProducts] = useState<FormattedProduct[]>(initialProducts);

  // Filter and sort products whenever context changes
  useEffect(() => {
    const filtered = initialProducts
      .filter(product => {
        const matchesCategory = selectedCategory === 'all' || 
          product.categories.some(cat => cat.slug === selectedCategory);
        const matchesSearch = !searchQuery || 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return (a.price || 0) - (b.price || 0);
          case 'price-high':
            return (b.price || 0) - (a.price || 0);
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, sortBy, initialProducts]);

  return (
    <>
      {/* Results Count */}
      <div className="mb-6 text-sm text-gray-600">
        Showing {filteredProducts.length} of {initialProducts.length} frames
        {searchQuery && (
          <span className="ml-2">
            for "{searchQuery}"
          </span>
        )}
        {selectedCategory !== 'all' && (
          <span className="ml-2">
            in {initialCategories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}
          </span>
        )}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group">
              <ProductCardServer product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProducts.map((product) => (
            <div key={product.id}>
              <ProductListItemServer product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No frames found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'No products available at the moment'
            }
          </p>
          <div className="text-center">
            <Link 
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
            >
              Clear Filters
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
