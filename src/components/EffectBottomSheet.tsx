import React from 'react';
import { ResponsiveBottomSheet } from './ResponsiveBottomSheet';
import { EffectOption, FrameCustomization } from '../types';

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

  return (
    <ResponsiveBottomSheet 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Select Effect"
      description="Add beautiful effects to your photo"    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {effects.map((effect, index) => (
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
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <h3 className="text-white font-medium text-sm">
                  {effect.name}
                </h3>
              </div>

              {currentEffect === effect.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center animate-bounce">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>              )}
            </button>
          ))}
        </div>
      </div>
    </ResponsiveBottomSheet>
  );
};

export default EffectBottomSheet;