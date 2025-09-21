'use client';

import React from 'react';
import { Heart, X, Star, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

interface WishlistItem {
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
  dateAdded: string;
}

interface WishlistCardProps {
  item: WishlistItem;
}

function WishlistCard({ item }: WishlistCardProps) {
  const { removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();

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

  const handleAddToCart = () => {
    // Create a basic cart item - you may need to adjust this based on your cart structure
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: 'Default', // You might want to make this configurable
      color: 'Default',
      material: 'Default',
      quantity: 1,
      customization: {
        size: 'Default',
        color: 'Default',
        material: 'Default',
        price: {
          base: item.price,
          size: 0,
          total: item.price
        }
      }
    };
    
    addToCart(cartItem);
    // Optionally remove from wishlist after adding to cart
    // removeItem(item.id);
  };

  const discount = calculateDiscount(item.price, item.compareAtPrice);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden">
          <img
            src={item.image || '/placeholder-image.jpg'}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeItem(item.id)}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          aria-label="Remove from wishlist"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {discount}% OFF
          </div>
        )}

        {/* Featured Badge */}
        {item.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <Link href={`/products/${item.slug}`}>
            <h3 className="font-semibold text-gray-900 hover:text-pink-600 transition-colors line-clamp-2">
              {item.name}
            </h3>
          </Link>
        </div>

        {item.shortDescription && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.shortDescription}
          </p>
        )}

        {/* Categories */}
        {item.categories && item.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.categories.slice(0, 2).map((category) => (
              <span
                key={category.slug}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(item.price)}
          </span>
          {item.compareAtPrice && item.compareAtPrice > item.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(item.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            className="flex-1 flex items-center gap-2"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
          <Link href={`/products/${item.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>

        {/* Added Date */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Added {new Date(item.dateAdded).toLocaleDateString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function WishlistPage() {
  const { items, clearWishlist, getItemCount } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">
            Start adding products you love to your wishlist
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-gray-600 mt-1">
              {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
          
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearWishlist}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          layout
        >
          <AnimatePresence>
            {items.map((item) => (
              <WishlistCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Link href="/products">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}