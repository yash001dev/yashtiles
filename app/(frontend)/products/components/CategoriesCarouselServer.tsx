import Link from 'next/link';

interface CategoriesCarouselServerProps {
  categories: any[];
  currentCategory?: string;
  currentSearch?: string;
  currentSort?: string;
  currentView?: 'grid' | 'list';
}

export default function CategoriesCarouselServer({
  categories,
  currentCategory = 'all',
  currentSearch = '',
  currentSort = 'name',
  currentView = 'grid'
}: CategoriesCarouselServerProps) {
  
  // Helper function to build URL with search params
  const buildUrl = (categorySlug?: string) => {
    const params = new URLSearchParams();
    
    if (categorySlug && categorySlug !== 'all') {
      params.set('category', categorySlug);
    }
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    if (currentSort !== 'name') {
      params.set('sort', currentSort);
    }
    if (currentView !== 'grid') {
      params.set('view', currentView);
    }
    
    const query = params.toString();
    return `/products${query ? `?${query}` : ''}`;
  };

  return (
    <div className="mb-4 relative">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* All Categories Link */}
        <Link
          href={buildUrl()}
          className={`px-3 py-2 md:px-6 md:py-3 text-sm md:text-lg  rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
            currentCategory === 'all'
              ? 'bg-pink-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
          }`}
        >
          All Categories
        </Link>
        
        {/* Category Links */}
        {categories.map((category) => (
          <Link
            key={category.id}
            href={buildUrl(category.slug)}
            className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-lg rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
              currentCategory === category.slug
                ? 'bg-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
