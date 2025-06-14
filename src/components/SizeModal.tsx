import React from 'react';
import { X } from 'lucide-react';
import { SizeOption, FrameCustomization } from '../types';

interface SizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSize: FrameCustomization['size'];
  onSelect: (size: FrameCustomization['size']) => void;
}

const SizeModal: React.FC<SizeModalProps> = ({
  isOpen,
  onClose,
  currentSize,
  onSelect,
}) => {
  if (!isOpen) return null;

  const sizes: SizeOption[] = [
    {
      id: '8x8',
      name: '8" × 8"',
      dimensions: 'Square format',
      aspectRatio: 1,
    },
    {
      id: '8x11',
      name: '8" × 11"',
      dimensions: 'Portrait format',
      aspectRatio: 8/11,
    },
    {
      id: '11x8',
      name: '11" × 8"',
      dimensions: 'Landscape format',
      aspectRatio: 11/8,
    },
  ];

  const handleSelect = (sizeId: FrameCustomization['size']) => {
    onSelect(sizeId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Select Size</h2>
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

        <div className="p-6">
          <div className="space-y-3">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => handleSelect(size.id)}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  currentSize === size.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div 
                    className="bg-gray-400 rounded-sm"
                    style={{
                      width: size.aspectRatio >= 1 ? '32px' : `${32 * size.aspectRatio}px`,
                      height: size.aspectRatio <= 1 ? '32px' : `${32 / size.aspectRatio}px`,
                    }}
                  />
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-900">{size.name}</h3>
                  <p className="text-sm text-gray-500">{size.dimensions}</p>
                </div>

                {currentSize === size.id && (
                  <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
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

export default SizeModal;