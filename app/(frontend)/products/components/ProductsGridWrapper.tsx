'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useProductsContext } from './ProductsContext';
import { FormattedProduct } from '@/lib/payload-server';

interface FilteredProductsContextType {
  filteredProducts: FormattedProduct[];
  resultsInfo: {
    searchQuery: string;
    selectedCategory: string;
    viewMode: 'grid' | 'list';
    categoryName: string;
  };
}

const FilteredProductsContext = createContext<FilteredProductsContextType | undefined>(undefined);

export function useFilteredProducts() {
  const context = useContext(FilteredProductsContext);
  if (!context) {
    throw new Error('useFilteredProducts must be used within FilteredProductsProvider');
  }
  return context;
}

interface ProductsGridWrapperProps {
  initialProducts: FormattedProduct[];
  initialCategories: any[];
  children: React.ReactNode;
}

export default function ProductsGridWrapper({ 
  initialProducts, 
  initialCategories, 
  children 
}: ProductsGridWrapperProps) {
  const [filteredProducts, setFilteredProducts] = useState<FormattedProduct[]>(initialProducts);
  const { searchQuery, selectedCategory, viewMode, sortBy } = useProductsContext();

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

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, sortBy, initialProducts]);

  const categoryName = initialCategories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory;

  const contextValue: FilteredProductsContextType = {
    filteredProducts,
    resultsInfo: {
      searchQuery,
      selectedCategory,
      viewMode,
      categoryName
    }
  };

  return (
    <FilteredProductsContext.Provider value={contextValue}>
      {children}
    </FilteredProductsContext.Provider>
  );
}
