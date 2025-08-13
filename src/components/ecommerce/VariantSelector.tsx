'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FrameVariant {
  name: string;
  displayName: string;
  basePrice: number;
  colors: Array<{
    name: string;
    value: string;
    hexCode?: string;
    priceModifier: number;
    stock: number;
    isDefault: boolean;
    image?: {
      url: string;
      alt: string;
    };
  }>;
}

interface VariantSelectorProps {
  variants: FrameVariant[];
  selectedVariant: string;
  selectedColor: string;
  onVariantChange: (variant: string) => void;
  onColorChange: (color: string) => void;
  className?: string;
}

export function VariantSelector({
  variants,
  selectedVariant,
  selectedColor,
  onVariantChange,
  onColorChange,
  className = ''
}: VariantSelectorProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getCurrentVariant = () => {
    return variants.find(v => v.name === selectedVariant);
  };

  const getCurrentColor = () => {
    const variant = getCurrentVariant();
    return variant?.colors.find(c => c.value === selectedColor);
  };

  const getTotalPrice = () => {
    const variant = getCurrentVariant();
    const color = getCurrentColor();
    if (!variant || !color) return 0;
    return variant.basePrice + color.priceModifier;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Size</h3>
          <span className="text-sm text-gray-600">
            {variants.length} size{variants.length !== 1 ? 's' : ''} available
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {variants.map((variant) => {
            const isSelected = selectedVariant === variant.name;
            const hasStock = variant.colors.some(c => c.stock > 0);
            
            return (
              <motion.button
                key={variant.name}
                onClick={() => {
                  if (hasStock) {
                    onVariantChange(variant.name);
                    // Auto-select default color or first available color
                    const defaultColor = variant.colors.find(c => c.isDefault && c.stock > 0) ||
                                       variant.colors.find(c => c.stock > 0);
                    if (defaultColor) {
                      onColorChange(defaultColor.value);
                    }
                  }
                }}
                disabled={!hasStock}
                className={`relative p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50 shadow-lg'
                    : hasStock
                    ? 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                }`}
                whileHover={hasStock ? { scale: 1.02 } : {}}
                whileTap={hasStock ? { scale: 0.98 } : {}}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Size Info */}
                <div className="font-medium text-gray-900 mb-1">{variant.displayName}</div>
                <div className="text-sm text-gray-600 mb-2">{formatPrice(variant.basePrice)}</div>
                
                {/* Stock Status */}
                <div className="text-xs">
                  {hasStock ? (
                    <span className="text-green-600">In Stock</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>

                {/* Price Modifier Indicator */}
                {isSelected && getCurrentColor()?.priceModifier !== 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    {getCurrentColor()!.priceModifier > 0 ? '+' : ''}
                    {formatPrice(getCurrentColor()!.priceModifier)}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Color Selection */}
      {selectedVariant && getCurrentVariant() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Color: {getCurrentColor()?.name || 'Select a color'}
            </h3>
            {getCurrentColor()?.priceModifier !== 0 && (
              <span className={`text-sm font-medium ${
                getCurrentColor()!.priceModifier > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {getCurrentColor()!.priceModifier > 0 ? '+' : ''}
                {formatPrice(getCurrentColor()!.priceModifier)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {getCurrentVariant()!.colors.map((color) => {
              const isSelected = selectedColor === color.value;
              const isHovered = hoveredColor === color.value;
              const hasStock = color.stock > 0;

              return (
                <motion.div
                  key={color.value}
                  className="relative"
                  onHoverStart={() => setHoveredColor(color.value)}
                  onHoverEnd={() => setHoveredColor(null)}
                >
                  <motion.button
                    onClick={() => hasStock && onColorChange(color.value)}
                    disabled={!hasStock}
                    className={`relative w-16 h-16 rounded-full border-4 transition-all duration-200 ${
                      isSelected
                        ? 'border-pink-500 shadow-lg scale-110'
                        : hasStock
                        ? 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        : 'border-gray-100 cursor-not-allowed opacity-50'
                    }`}
                    style={{ 
                      backgroundColor: color.hexCode || color.value,
                      boxShadow: isSelected ? `0 0 0 2px ${color.hexCode || color.value}33` : undefined
                    }}
                    whileHover={hasStock ? { scale: 1.1 } : {}}
                    whileTap={hasStock ? { scale: 0.95 } : {}}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 rounded-full flex items-center justify-center"
                      >
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-pink-500" />
                        </div>
                      </motion.div>
                    )}

                    {/* Out of Stock Overlay */}
                    {!hasStock && (
                      <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-500 font-medium">✕</span>
                      </div>
                    )}
                  </motion.button>

                  {/* Color Info Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10"
                      >
                        <div className="font-medium">{color.name}</div>
                        <div className="text-xs opacity-80">
                          {hasStock ? `${color.stock} in stock` : 'Out of stock'}
                        </div>
                        {color.priceModifier !== 0 && (
                          <div className="text-xs opacity-80">
                            {color.priceModifier > 0 ? '+' : ''}{formatPrice(color.priceModifier)}
                          </div>
                        )}
                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Color Details */}
          {getCurrentColor() && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{getCurrentColor()!.name}</div>
                  <div className="text-sm text-gray-600">
                    Stock: {getCurrentColor()!.stock} available
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    {formatPrice(getTotalPrice())}
                  </div>
                  {getCurrentColor()!.priceModifier !== 0 && (
                    <div className="text-sm text-gray-600">
                      Base: {formatPrice(getCurrentVariant()!.basePrice)}
                      {getCurrentColor()!.priceModifier > 0 ? ' + ' : ' - '}
                      {formatPrice(Math.abs(getCurrentColor()!.priceModifier))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Size Guide Link */}
      <div className="flex items-center justify-center pt-4 border-t">
        <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
          <Info className="w-4 h-4 mr-2" />
          Size Guide & Frame Comparison
        </Button>
      </div>
    </div>
  );
}