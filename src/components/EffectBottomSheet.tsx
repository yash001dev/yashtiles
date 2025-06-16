import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ResponsiveBottomSheet } from './ResponsiveBottomSheet';
import { EffectOption, FrameCustomization } from '../types';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface EffectBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentEffect: FrameCustomization['effect'];
  onSelect: (effect: FrameCustomization['effect']) => void;
}

const EffectBottomSheet: React.FC<EffectBottomSheetProps> = ({
  isOpen,
  onClose,
  currentEffect,
  onSelect,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const effects: EffectOption[] = [
    {
      id: 'original',
      name: 'Original',
      filter: 'none',
    },
    {
      id: 'silver',
      name: 'Silver',
      filter: 'grayscale(100%) contrast(110%)',
    },
    {
      id: 'noir',
      name: 'Noir',
      filter: 'grayscale(100%) contrast(150%) brightness(90%)',
    },
    {
      id: 'vivid',
      name: 'Vivid',
      filter: 'saturate(150%) contrast(120%)',
    },
    {
      id: 'dramatic',
      name: 'Dramatic',
      filter: 'contrast(140%) brightness(95%) saturate(130%)',
    },
  ];

  const sampleImage = "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=300";

  const handleSelect = (effectId: FrameCustomization['effect']) => {
    onSelect(effectId);
    onClose();
  };

  const itemsPerPage = isLargeScreen ? 5 : effects.length;
  const totalPages = Math.ceil(effects.length / itemsPerPage);
  const currentItems = isLargeScreen 
    ? effects.slice(currentIndex, currentIndex + itemsPerPage)
    : effects;

  const nextPage = () => {
    if (currentIndex + itemsPerPage < effects.length) {
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
      title="Select Effect"
      description="Add beautiful effects to your photo"
    >
      <div className="space-y-4">
        {/* Navigation for desktop */}
        {isLargeScreen && effects.length > itemsPerPage && (
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
              disabled={currentIndex + itemsPerPage >= effects.length}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        <div className={`grid gap-3 ${isLargeScreen ? 'grid-cols-5' : 'grid-cols-2'}`}>
          {currentItems.map((effect, index) => (
            <button
              key={effect.id}
              onClick={() => handleSelect(effect.id)}
              className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                currentEffect === effect.id
                  ? 'border-pink-500 ring-2 ring-pink-200 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isOpen ? 'zoomIn 0.5s ease-out forwards' : 'none'
              }}
            >
              <div className="aspect-square">
                <img
                  src={sampleImage}
                  alt={effect.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  style={{ filter: effect.filter }}
                />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <h3 className="text-white font-medium text-xs">
                  {effect.name}
                </h3>
              </div>

              {currentEffect === effect.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center animate-bounce">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </ResponsiveBottomSheet>
  );
};

export default EffectBottomSheet;