'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProductsContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
  initialFilters?: {
    category?: string;
    search?: string;
    sort?: string;
    view?: 'grid' | 'list';
  };
}

export function ProductsProvider({ children, initialFilters = {} }: ProductsProviderProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || 'all');
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [sortBy, setSortBy] = useState(initialFilters.sort || 'name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialFilters.view || 'grid');
  const [showFilters, setShowFilters] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy !== 'name') params.set('sort', sortBy);
    if (viewMode !== 'grid') params.set('view', viewMode);

    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    
    window.history.replaceState({}, '', newUrl);
  }, [selectedCategory, searchQuery, sortBy, viewMode]);

  return (
    <ProductsContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        showFilters,
        setShowFilters,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
}
