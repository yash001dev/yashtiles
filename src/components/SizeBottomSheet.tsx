import React, { useState } from 'react';
import { Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { ResponsiveBottomSheet } from './ResponsiveBottomSheet';
import { SizeOption, FrameCustomization } from '../types';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SizeBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentSize: FrameCustomization['size'];
  onSelect: (size: FrameCustomization['size']) => void;
}

const SizeBottomSheet: React.FC<SizeBottomSheetProps> = ({
  isOpen,
  onClose,
  currentSize,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const sizes: SizeOption[] = [
    { id: '8x8', name: '8" × 8"', dimensions: 'Square format', aspectRatio: 1, price: 25 },
    { id: '8x10', name: '8" × 10"', dimensions: 'Portrait format', aspectRatio: 8/10, price: 35 },
    { id: '10x8', name: '10" × 8"', dimensions: 'Landscape format', aspectRatio: 10/8, price: 35 },
    { id: '9x12', name: '9" × 12"', dimensions: 'Portrait format', aspectRatio: 9/12, price: 45 },
    { id: '12x9', name: '12" × 9"', dimensions: 'Landscape format', aspectRatio: 12/9, price: 45 },
    { id: '12x12', name: '12" × 12"', dimensions: 'Large square', aspectRatio: 1, price: 55 },
    { id: '12x18', name: '12" × 18"', dimensions: 'Portrait format', aspectRatio: 12/18, price: 65 },
    { id: '18x12', name: '18" × 12"', dimensions: 'Landscape format', aspectRatio: 18/12, price: 65 },
    { id: '18x18', name: '18" × 18"', dimensions: 'Extra large square', aspectRatio: 1, price: 85 },
    { id: '18x24', name: '18" × 24"', dimensions: 'Portrait format', aspectRatio: 18/24, price: 95 },
    { id: '24x18', name: '24" × 18"', dimensions: 'Landscape format', aspectRatio: 24/18, price: 95 },
    { id: '24x32', name: '24" × 32"', dimensions: 'Large portrait', aspectRatio: 24/32, price: 149 },
    { id: '32x24', name: '32" × 24"', dimensions: 'Large landscape', aspectRatio: 32/24, price: 149 },
  ];

  const filteredSizes = sizes.filter(size =>
    size.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    size.dimensions.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (sizeId: FrameCustomization['size']) => {
    onSelect(sizeId);
    onClose();
  };

  const itemsPerPage = isLargeScreen ? 6 : filteredSizes.length;
  const totalPages = Math.ceil(filteredSizes.length / itemsPerPage);
  const currentItems = isLargeScreen 
    ? filteredSizes.slice(currentIndex, currentIndex + itemsPerPage)
    : filteredSizes;

  const nextPage = () => {
    if (currentIndex + itemsPerPage < filteredSizes.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(Math.max(0, currentIndex - itemsPerPage));
    }
  };

  return (
    <ResponsiveBottomSheet 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Select Size"
      description="Choose the perfect size for your photo"
    >
      <div className="space-y-4">
        {/* Search - only show on mobile */}
        {!isLargeScreen && (
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sizes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        )}

        {/* Welcome Offer */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-3 border border-pink-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-pink-700">WELCOME</span>
            <span className="text-sm text-gray-600">8 for US$129 (36% OFF)</span>
          </div>
        </div>

        {/* Size Grid */}
        <div className="relative">
          {isLargeScreen && filteredSizes.length > itemsPerPage && (
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={prevPage}
                disabled={currentIndex === 0}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-500">
                {Math.floor(currentIndex / itemsPerPage) + 1} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentIndex + itemsPerPage >= filteredSizes.length}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <div className={`grid gap-3 ${isLargeScreen ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}>
            {currentItems.map((size) => (
              <button
                key={size.id}
                onClick={() => handleSelect(size.id)}
                className={`relative group p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  currentSize === size.id
                    ? 'border-pink-500 bg-pink-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {/* Size Preview */}
                <div className="flex items-center justify-center mb-2 h-8">
                  <div 
                    className={`bg-gray-300 rounded-sm shadow-sm transition-colors duration-200 ${
                      currentSize === size.id ? 'bg-pink-300' : 'group-hover:bg-gray-400'
                    }`}
                    style={{
                      width: size.aspectRatio >= 1 ? '24px' : `${24 * size.aspectRatio}px`,
                      height: size.aspectRatio <= 1 ? '24px' : `${24 / size.aspectRatio}px`,
                    }}
                  />
                </div>
                
                {/* Size Info */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-xs mb-1">{size.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{size.dimensions}</p>
                  <p className="text-xs font-medium text-pink-600">US${size.price}</p>
                </div>

                {/* Selection Indicator */}
                {currentSize === size.id && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredSizes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No sizes found matching your search.</p>
          </div>
        )}
      </div>
    </ResponsiveBottomSheet>
  );
};

export default SizeBottomSheet;