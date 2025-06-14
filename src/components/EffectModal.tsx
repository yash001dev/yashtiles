import React from 'react';
import { X } from 'lucide-react';
import { EffectOption, FrameCustomization } from '../types';

interface EffectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEffect: FrameCustomization['effect'];
  onSelect: (effect: FrameCustomization['effect']) => void;
}

const EffectModal: React.FC<EffectModalProps> = ({
  isOpen,
  onClose,
  currentEffect,
  onSelect,
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Select Effect</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-pink-500 hover:text-pink-600 font-medium transition-colors duration-200"
            >
              Done
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {effects.map((effect) => (
              <button
                key={effect.id}
                onClick={() => handleSelect(effect.id)}
                className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                  currentEffect === effect.id
                    ? 'border-pink-500 ring-2 ring-pink-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-square">
                  <img
                    src={sampleImage}
                    alt={effect.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ filter: effect.filter }}
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <h3 className="text-white font-medium text-sm">
                    {effect.name}
                  </h3>
                </div>

                {currentEffect === effect.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EffectModal;