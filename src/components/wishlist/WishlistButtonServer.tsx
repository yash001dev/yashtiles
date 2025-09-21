'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';

interface WishlistButtonServerProps {
  productId: string;
  productName: string;
  productSlug: string;
  productPrice: number;
  compareAtPrice?: number;
  imageUrl?: string;
  shortDescription?: string;
  featured?: boolean;
  categories?: Array<{
    name: string;
    slug: string;
  }>;
  className?: string;
}

export default function WishlistButtonServer({
  productId,
  productName,
  productSlug,
  productPrice,
  compareAtPrice,
  imageUrl,
  shortDescription,
  featured,
  categories,
  className = "p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
}: WishlistButtonServerProps) {
  const { isInWishlist, toggleWishlistItem } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleWishlistItem({
      id: productId,
      name: productName,
      slug: productSlug,
      price: productPrice,
      compareAtPrice,
      image: imageUrl,
      shortDescription,
      featured,
      categories,
      dateAdded: new Date().toISOString()
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={className}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isWishlisted ? 'filled' : 'empty'}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isWishlisted 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`}
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}