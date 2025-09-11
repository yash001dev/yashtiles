'use client';

import { useProductsContext } from './ProductsContext';
import { ProductCategory } from '../../../../payload-types';

interface CategoriesCarouselClientProps {
  categories: ProductCategory[];
}

export default function CategoriesCarouselClient({ categories }: CategoriesCarouselClientProps) {
  const { selectedCategory, setSelectedCategory } = useProductsContext();

  return (
    <div className="mb-4 relative">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* All Categories Button */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-pink-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
          }`}
        >
          All Categories
        </button>
        
        {/* Category Buttons */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.slug)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
              selectedCategory === category.slug
                ? 'bg-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
