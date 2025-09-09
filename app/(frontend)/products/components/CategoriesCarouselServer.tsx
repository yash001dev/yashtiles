import Link from 'next/link';
import { getProductCategories } from '@/lib/payload-server';

interface CategoriesCarouselServerProps {
  selectedCategory?: string;
  searchParams?: Record<string, string>;
}

export default async function CategoriesCarouselServer({ 
  selectedCategory = 'all',
  searchParams = {}
}: CategoriesCarouselServerProps) {
  const categories = await getProductCategories();

  // Helper function to build URL with search params
  const buildCategoryUrl = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    return params.toString() ? `/products?${params.toString()}` : '/products';
  };

  return (
    <div className="mb-4 relative">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* All Categories Link */}
        <Link
          href={buildCategoryUrl('all')}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
            selectedCategory === 'all'
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
            href={buildCategoryUrl(category.slug)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
              selectedCategory === category.slug
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
