
import { Search } from 'lucide-react';
import Link from 'next/link';
import ProductCardServer from './ProductCardServer';
import ProductListItemServer from './ProductListItemServer';
import { FormattedProduct } from '@/lib/payload-server';

interface ProductsGridProps {
  products: FormattedProduct[];
  categories: any[];
  selectedCategory?: string;
  searchQuery?: string;
  sortBy?: string;
  viewMode?: 'grid' | 'list';
}

// Server-side filtering and sorting
function filterAndSortProducts(
  products: FormattedProduct[],
  selectedCategory?: string,
  searchQuery?: string,
  sortBy?: string
): FormattedProduct[] {
  let filteredProducts = [...products];

  // Filter by category
  if (selectedCategory && selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(product =>
      product.categories.some(cat => cat.slug === selectedCategory)
    );
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.shortDescription?.toLowerCase().includes(query) ||
      product.categories.some(cat => cat.name.toLowerCase().includes(query))
    );
  }

  // Sort products
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'newest':
        // Since we don't have createdAt, we'll sort by featured first, then by name
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.name.localeCompare(b.name);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return filteredProducts;
}

export default function ProductsGrid({ 
  products,
  categories,
  selectedCategory = 'all',
  searchQuery = '',
  sortBy = 'name',
  viewMode = 'grid'
}: ProductsGridProps) {
  
  // Server-side filtering and sorting
  const filteredProducts = filterAndSortProducts(products, selectedCategory, searchQuery, sortBy);
  const categoryName = categories.find(cat => cat.slug === selectedCategory)?.name || 'All Categories';

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {searchQuery 
            ? `Search results for "${searchQuery}"` 
            : selectedCategory !== 'all' 
              ? categoryName
              : 'All Products'
          }
        </h2>
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} frames
          {searchQuery && (
            <span className="ml-2">
              for "{searchQuery}"
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="ml-2">
              in {categoryName}
            </span>
          )}
        </p>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
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
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
