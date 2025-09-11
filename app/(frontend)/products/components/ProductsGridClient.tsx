'use client';

import { useState, useEffect } from 'react';
import { useProductsContext } from './ProductsContext';
import { FormattedProduct } from '@/lib/payload-server';

interface ProductsGridClientProps {
  children: React.ReactNode;
  initialProducts: FormattedProduct[];
  initialCategories: any[];
  onFilteredProducts: (products: FormattedProduct[]) => void;
}

export default function ProductsGridClient({ 
  children, 
  initialProducts, 
  initialCategories,
  onFilteredProducts 
}: ProductsGridClientProps) {
  const {
    selectedCategory,
    searchQuery,
    sortBy,
  } = useProductsContext();

  // Filter and sort products whenever context changes
  useEffect(() => {
    const filtered = initialProducts
      .filter(product => {
        const matchesCategory = selectedCategory === 'all' || 
          product.categories.some(cat => cat.slug === selectedCategory);
        const matchesSearch = !searchQuery || 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return (a.price || 0) - (b.price || 0);
          case 'price-high':
            return (b.price || 0) - (a.price || 0);
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });

    onFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, sortBy, initialProducts, onFilteredProducts]);

  return <>{children}</>;
}
