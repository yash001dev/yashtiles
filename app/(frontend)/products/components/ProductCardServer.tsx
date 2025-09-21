'use client';

/* eslint-disable @next/next/no-img-element */
import { Star, Heart, Eye } from 'lucide-react';
import Link from 'next/link';
import { FormattedProduct } from '@/lib/payload-server';
import Image from 'next/image';
import WishlistButtonServer from '@/components/wishlist/WishlistButtonServer';

interface ProductCardServerProps {
  product: FormattedProduct;
}

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

export default function ProductCardServer({ product }: ProductCardServerProps) {
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  console.log('Rendering ProductCardServer for:', product.images);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 h-full hover:transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={'https://d3eklbyrx2lntp.cloudfront.net'+ product.images[0]?.image.url.replace('/api/media/file','') +'?format=webp' || '/placeholder.png'}
          alt={product.images[0]?.alt || product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Image Navigation Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === 0 ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {discount}% OFF
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-200 z-10">
          <WishlistButtonServer
            productId={product.id}
            productName={product.name}
            productSlug={product.slug}
            productPrice={product.price}
            compareAtPrice={product.compareAtPrice}
            imageUrl={product.images[0]?.image.url}
            shortDescription={product.shortDescription}
            featured={product.featured}
            categories={product.categories}
          />
          <Link href={`/products/${product.slug}`}>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          </Link>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Link href={`/products/${product.slug}`}>
            <div className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors">
              View Details
            </div>
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
          {product.featured && (
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.shortDescription}
        </p>

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
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
             From {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
