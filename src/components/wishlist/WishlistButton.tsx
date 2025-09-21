'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/contexts/WishlistContext';
import WishlistNotification, { useWishlistNotification } from './WishlistNotification';

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    image?: string;
    shortDescription?: string;
    featured?: boolean;
    categories?: Array<{
      name: string;
      slug: string;
    }>;
  };
  className?: string;
  variant?: 'default' | 'icon-only' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  showToast?: boolean;
}

export default function WishlistButton({ 
  product, 
  className,
  variant = 'default',
  size = 'md',
  showToast = true
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlistItem } = useWishlist();
  const { notification, showNotification, hideNotification } = useWishlistNotification();
  const isWishlisted = isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const wasWishlisted = isWishlisted;
    
    toggleWishlistItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
      shortDescription: product.shortDescription,
      featured: product.featured,
      categories: product.categories,
      dateAdded: new Date().toISOString()
    });

    // Show notification
    if (showToast) {
      if (wasWishlisted) {
        showNotification(`${product.name} removed from wishlist`, 'removed');
      } else {
        showNotification(`${product.name} added to wishlist`, 'added');
      }
    }
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <>
      {/* Notification Component */}
      <WishlistNotification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />

      {/* Button Component */}
      {variant === 'icon-only' ? (
        <motion.button
          onClick={handleToggle}
          className={cn(
            'relative rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200',
            sizeClasses[size],
            className
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
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
                className={cn(
                  iconSizes[size],
                  isWishlisted 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-gray-600 hover:text-red-500'
                )}
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>
      ) : variant === 'floating' ? (
        <motion.button
          onClick={handleToggle}
          className={cn(
            'fixed bottom-20 right-4 z-50 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200',
            sizeClasses[size],
            className
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart 
            className={cn(
              iconSizes[size],
              isWishlisted 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-600'
            )}
          />
        </motion.button>
      ) : (
        <motion.button
          onClick={handleToggle}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200',
            isWishlisted
              ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-red-200',
            className
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
                className={cn(
                  iconSizes[size],
                  isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'
                )}
              />
            </motion.div>
          </AnimatePresence>
          <span className="text-sm font-medium">
            {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
          </span>
        </motion.button>
      )}
    </>
  );
}