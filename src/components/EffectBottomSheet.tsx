import React from 'react';
import BottomSheet from './BottomSheet';
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
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Effect" height="compact">
      <div className="px-4 pb-4">
        {/* Horizontal Scrolling Effect Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-3 min-w-max">
            {effects.map((effect, index) => (
              <button
                key={effect.id}
                onClick={() => handleSelect(effect.id)}
                className={`flex-shrink-0 w-24 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                  currentEffect === effect.id
                    ? 'border-pink-500 ring-2 ring-pink-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="h-16 overflow-hidden">
                  <img
                    src={sampleImage}
                    alt={effect.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    style={{ filter: effect.filter }}
                  />
                </div>
                
                <div className="p-2 bg-white">
                  <h3 className="text-xs font-medium text-gray-900">
                    {effect.name}
                  </h3>
                </div>

                {currentEffect === effect.id && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default EffectBottomSheet;