'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductsContext } from './ProductsContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: {
    url: string;
    alt: string;
  };
}

export default function CategoriesCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCategory, setSelectedCategory } = useProductsContext();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/product-categories?status=active');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.docs || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
      const skeletonWidths = [108, 95, 112, 88, 103, 115]; // Fixed widths
    return (
      <div className="mb-4 animate-pulse">
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="h-12 bg-gray-200 rounded-full flex-shrink-0"
              style={{ width: `${skeletonWidths[i]}px` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-4 relative"
    >
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView="auto"
        navigation={{
          nextEl: '.categories-swiper-button-next',
          prevEl: '.categories-swiper-button-prev',
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="categories-swiper"
      >
        <SwiperSlide style={{ width: 'auto' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
            }`}
          >
            All Categories
          </button>
        </SwiperSlide>
        {categories.map((category) => (
          <SwiperSlide key={category.id} style={{ width: 'auto' }}>
            <button
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.slug
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
              }`}
            >
              {category.name}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Navigation Buttons */}
      <button className="categories-swiper-button-prev hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full shadow-lg items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group">
        <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      </button>
      
      <button className="categories-swiper-button-next hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full shadow-lg items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group">
        <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      </button>
    </motion.div>
  );
}
