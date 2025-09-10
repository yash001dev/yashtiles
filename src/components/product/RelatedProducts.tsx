"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ecommerce/ProductCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Category {
  slug: string;
}

interface RelatedProductsProps {
  categories: Category[];
  currentProductId: string;
  products: any[];
}

export default function RelatedProducts({
  categories,
  currentProductId,
  products,
}: RelatedProductsProps) {
  const filteredProducts = products.slice(0, 4);

  if (filteredProducts.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            You Might Also Like
          </h2>

          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              navigation={{
                nextEl: ".related-swiper-button-next",
                prevEl: ".related-swiper-button-prev",
              }}
              pagination={{ clickable: true }}
              className="related-products-swiper"
            >
              {filteredProducts.map((product: any) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} showAddToCard={false} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Enhanced Navigation Buttons */}
            <button className="related-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group">
              <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button className="related-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group">
              <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
