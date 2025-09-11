import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

interface ProductsFiltersServerProps {
  categories: any[];
  currentCategory?: string;
  currentSearch?: string;
  currentSort?: string;
  currentView?: 'grid' | 'list';
  totalProducts: number;
}

export default function ProductsFiltersServer({
  categories,
  currentCategory = 'all',
  currentSearch = '',
  currentSort = 'name',
  currentView = 'grid',
  totalProducts
}: ProductsFiltersServerProps) {
  
  // Helper function to build URL with search params
  const buildUrl = (params: Record<string, string | undefined>) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        searchParams.set(key, value);
      }
    });
    
    const query = searchParams.toString();
    return `/products${query ? `?${query}` : ''}`;
  };

  return (
    <section className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          
          {/* Left side - Search and Categories */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            
            {/* Search Form */}
            <form method="GET" action="/products" className="relative">
              {/* Preserve other params */}
              {currentCategory !== 'all' && (
                <input type="hidden" name="category" value={currentCategory} />
              )}
              {currentSort !== 'name' && (
                <input type="hidden" name="sort" value={currentSort} />
              )}
              {currentView !== 'grid' && (
                <input type="hidden" name="view" value={currentView} />
              )}
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search frames..."
                  defaultValue={currentSearch}
                  className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-600 text-white px-3 py-1 rounded text-sm hover:bg-pink-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildUrl({ 
                  search: currentSearch, 
                  sort: currentSort, 
                  view: currentView 
                })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentCategory === 'all'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={buildUrl({ 
                    category: category.slug, 
                    search: currentSearch, 
                    sort: currentSort, 
                    view: currentView 
                  })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentCategory === category.slug
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Sort and View */}
          <div className="flex items-center gap-4">
            
            {/* Sort Dropdown */}
            <form method="GET" action="/products" className="flex items-center gap-2">
              {/* Preserve other params */}
              {currentCategory !== 'all' && (
                <input type="hidden" name="category" value={currentCategory} />
              )}
              {currentSearch && (
                <input type="hidden" name="search" value={currentSearch} />
              )}
              {currentView !== 'grid' && (
                <input type="hidden" name="view" value={currentView} />
              )}
              
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <select
                name="sort"
                defaultValue={currentSort}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
              <button
                type="submit"
                className="ml-2 bg-pink-600 text-white px-3 py-1 rounded text-sm hover:bg-pink-700 transition-colors"
              >
                Apply
              </button>
            </form>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <Link
                href={buildUrl({ 
                  category: currentCategory, 
                  search: currentSearch, 
                  sort: currentSort, 
                  view: 'grid' 
                })}
                className={`p-2 ${
                  currentView === 'grid'
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </Link>
              <Link
                href={buildUrl({ 
                  category: currentCategory, 
                  search: currentSearch, 
                  sort: currentSort, 
                  view: 'list' 
                })}
                className={`p-2 ${
                  currentView === 'list'
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </Link>
            </div>

            {/* Results Count */}
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {totalProducts} results
            </span>
          </div>
        </div>

        {/* Active Filters */}
        {(currentCategory !== 'all' || currentSearch) && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Active filters:</span>
            
            {currentCategory !== 'all' && (
              <Link
                href={buildUrl({ 
                  search: currentSearch, 
                  sort: currentSort, 
                  view: currentView 
                })}
                className="inline-flex items-center gap-1 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
              >
                Category: {categories.find(cat => cat.slug === currentCategory)?.name}
                <span className="ml-1 hover:text-pink-900">×</span>
              </Link>
            )}
            
            {currentSearch && (
              <Link
                href={buildUrl({ 
                  category: currentCategory, 
                  sort: currentSort, 
                  view: currentView 
                })}
                className="inline-flex items-center gap-1 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
              >
                Search: "{currentSearch}"
                <span className="ml-1 hover:text-pink-900">×</span>
              </Link>
            )}
            
            <Link
              href="/products"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
