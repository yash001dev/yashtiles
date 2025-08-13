'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FilterOption[];
  priceRanges: FilterOption[];
  materials: FilterOption[];
  sizes: FilterOption[];
  selectedFilters: {
    categories: string[];
    priceRange: string;
    materials: string[];
    sizes: string[];
    minPrice?: number;
    maxPrice?: number;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  className?: string;
}

export function ProductFilters({
  isOpen,
  onClose,
  categories,
  priceRanges,
  materials,
  sizes,
  selectedFilters,
  onFiltersChange,
  onClearFilters,
  className = ''
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['categories', 'price', 'materials', 'sizes'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedFilters.categories.includes(category)
      ? selectedFilters.categories.filter(c => c !== category)
      : [...selectedFilters.categories, category];
    
    onFiltersChange({
      ...selectedFilters,
      categories: newCategories,
    });
  };

  const handleMaterialChange = (material: string) => {
    const newMaterials = selectedFilters.materials.includes(material)
      ? selectedFilters.materials.filter(m => m !== material)
      : [...selectedFilters.materials, material];
    
    onFiltersChange({
      ...selectedFilters,
      materials: newMaterials,
    });
  };

  const handleSizeChange = (size: string) => {
    const newSizes = selectedFilters.sizes.includes(size)
      ? selectedFilters.sizes.filter(s => s !== size)
      : [...selectedFilters.sizes, size];
    
    onFiltersChange({
      ...selectedFilters,
      sizes: newSizes,
    });
  };

  const handlePriceRangeChange = (range: string) => {
    onFiltersChange({
      ...selectedFilters,
      priceRange: range,
    });
  };

  const handleCustomPriceChange = (min?: number, max?: number) => {
    onFiltersChange({
      ...selectedFilters,
      minPrice: min,
      maxPrice: max,
      priceRange: '', // Clear predefined range when using custom
    });
  };

  const getActiveFiltersCount = () => {
    return selectedFilters.categories.length +
           selectedFilters.materials.length +
           selectedFilters.sizes.length +
           (selectedFilters.priceRange ? 1 : 0) +
           (selectedFilters.minPrice || selectedFilters.maxPrice ? 1 : 0);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto"
    >
      {/* Mobile Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Filter Panel */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`absolute left-0 top-0 h-full w-80 bg-white shadow-xl lg:relative lg:w-full lg:h-auto lg:shadow-none lg:bg-gray-50 lg:rounded-xl overflow-y-auto ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b lg:border-none">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear All
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full lg:hidden"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Categories Filter */}
          <FilterSection
            title="Categories"
            isExpanded={expandedSections.has('categories')}
            onToggle={() => toggleSection('categories')}
          >
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category.value}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.categories.includes(category.value)}
                    onChange={() => handleCategoryChange(category.value)}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="flex-1 text-sm text-gray-700">{category.label}</span>
                  {category.count && (
                    <span className="text-xs text-gray-500">({category.count})</span>
                  )}
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Price Filter */}
          <FilterSection
            title="Price Range"
            isExpanded={expandedSections.has('price')}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-4">
              {/* Predefined Ranges */}
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label
                    key={range.value}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={selectedFilters.priceRange === range.value}
                      onChange={() => handlePriceRangeChange(range.value)}
                      className="border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="flex-1 text-sm text-gray-700">{range.label}</span>
                    {range.count && (
                      <span className="text-xs text-gray-500">({range.count})</span>
                    )}
                  </label>
                ))}
              </div>

              {/* Custom Price Range */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-3">Custom Range</p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={selectedFilters.minPrice || ''}
                    onChange={(e) => handleCustomPriceChange(
                      e.target.value ? Number(e.target.value) : undefined,
                      selectedFilters.maxPrice
                    )}
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={selectedFilters.maxPrice || ''}
                    onChange={(e) => handleCustomPriceChange(
                      selectedFilters.minPrice,
                      e.target.value ? Number(e.target.value) : undefined
                    )}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </FilterSection>

          {/* Materials Filter */}
          <FilterSection
            title="Frame Material"
            isExpanded={expandedSections.has('materials')}
            onToggle={() => toggleSection('materials')}
          >
            <div className="space-y-2">
              {materials.map((material) => (
                <label
                  key={material.value}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.materials.includes(material.value)}
                    onChange={() => handleMaterialChange(material.value)}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="flex-1 text-sm text-gray-700">{material.label}</span>
                  {material.count && (
                    <span className="text-xs text-gray-500">({material.count})</span>
                  )}
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Sizes Filter */}
          <FilterSection
            title="Frame Sizes"
            isExpanded={expandedSections.has('sizes')}
            onToggle={() => toggleSection('sizes')}
          >
            <div className="grid grid-cols-2 gap-2">
              {sizes.map((size) => (
                <label
                  key={size.value}
                  className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedFilters.sizes.includes(size.value)
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.sizes.includes(size.value)}
                    onChange={() => handleSizeChange(size.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{size.label}</div>
                    {size.count && (
                      <div className="text-xs text-gray-500">({size.count})</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Apply Filters Button (Mobile) */}
        <div className="p-6 border-t bg-white lg:hidden">
          <Button onClick={onClose} className="w-full">
            Apply Filters ({getActiveFiltersCount()})
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Filter Section Component
function FilterSection({ 
  title, 
  children, 
  isExpanded, 
  onToggle 
}: { 
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <h4 className="font-medium text-gray-900">{title}</h4>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}