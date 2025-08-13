'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProductCardProps {
  product: {
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
  };
  className?: string;
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const calculateDiscount = (price: number, comparePrice?: number) => {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  const discount = calculateDiscount(product.price, product.compareAtPrice);

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      layout
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {/* Main Image */}
        <motion.div
          className="relative w-full h-full"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={product.images[currentImageIndex]?.image.url || product.images[0]?.image.url}
            alt={product.images[currentImageIndex]?.alt || product.images[0]?.alt}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Image Navigation Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
            >
              {discount}% OFF
            </motion.div>
          )}
          {product.featured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
            >
              <Star className="w-3 h-3 fill-current" />
              Featured
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="absolute top-4 right-4 flex flex-col gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
          </motion.button>
          <Link href={`/products/${product.slug}`}>
            <motion.button
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Hover Overlay with Quick Add */}
        <motion.div
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <Button className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
        </div>

        {product.shortDescription && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.categories.slice(0, 2).map((category) => (
            <span
              key={category.slug}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {category.name}
            </span>
          ))}
          {product.categories.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{product.categories.length - 2} more
            </span>
          )}
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}