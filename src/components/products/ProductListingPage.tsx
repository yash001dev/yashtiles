'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '@/lib/contentful';
import { ContentfulProduct } from '@/types';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import ProductPagination from './ProductPagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const PRODUCTS_PER_PAGE = 12;

export default function ProductListingPage() {
  const [products, setProducts] = useState<ContentfulProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and pagination state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch products based on current filters and pagination
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const result = await getProducts({
        limit: PRODUCTS_PER_PAGE,
        skip,
        category: selectedCategory,
      });

      setProducts(result.products);
      setTotalProducts(result.total);
      setCategories(result.categories);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage]);

  // Fetch products when filters or pagination changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, currentPage, fetchProducts]);

  // Reset to first page when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 max-w-2xl mx-auto">
        <div className="text-red-500 text-lg mb-4 text-center">{error}</div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Possible Issues:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Check your Contentful Space ID and Access Token in .env.local</li>
            <li>• Make sure you have a content type called "product" in Contentful</li>
            <li>• Ensure your products are published in Contentful</li>
            <li>• Verify your field names match the expected structure</li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/debug-contentful"
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Debug Contentful
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        totalProducts={totalProducts}
      />

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            {selectedCategory === 'all' 
              ? 'There are no products available at the moment.'
              : `No products found in the "${selectedCategory}" category.`
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.sys.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}