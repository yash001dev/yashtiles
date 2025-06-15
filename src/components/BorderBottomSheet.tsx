import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { ResponsiveBottomSheet } from './ResponsiveBottomSheet';
import { BorderOption, UploadedImage } from '../types';

interface BorderBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentBorder: boolean;
  borderColor?: string;
  borderWidth?: number;
  onToggle: (border: boolean) => void;
  onBorderUpdate: (updates: { borderColor?: string; borderWidth?: number }) => void;
  uploadedImage?: UploadedImage | null;
}

const BorderBottomSheet: React.FC<BorderBottomSheetProps> = ({
  isOpen,
  onClose,
  currentBorder,
  borderColor = '#000000',
  borderWidth = 2,
  onToggle,
  onBorderUpdate,  uploadedImage,
}) => {
  const [selectedBorderType, setSelectedBorderType] = useState<'none' | 'solid' | 'pattern'>('none');

  const borderOptions: BorderOption[] = [
    { id: 'white', name: 'White', color: '#ffffff', width: 2, preview: 'bg-white border-2 border-gray-300' },
    { id: 'black', name: 'Black', color: '#000000', width: 2, preview: 'bg-gray-900' },
    { id: 'gray', name: 'Gray', color: '#6b7280', width: 2, preview: 'bg-gray-500' },
    { id: 'pink', name: 'Pink', color: '#ec4899', width: 2, preview: 'bg-pink-500' },
    { id: 'blue', name: 'Blue', color: '#3b82f6', width: 2, preview: 'bg-blue-500' },
    { id: 'green', name: 'Green', color: '#10b981', width: 2, preview: 'bg-green-500' },
    { id: 'purple', name: 'Purple', color: '#8b5cf6', width: 2, preview: 'bg-purple-500' },
    { id: 'yellow', name: 'Yellow', color: '#f59e0b', width: 2, preview: 'bg-yellow-500' },
    { id: 'red', name: 'Red', color: '#ef4444', width: 2, preview: 'bg-red-500' },
  ];

  const sampleImage = uploadedImage?.url || "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=300";

  const handleBorderToggle = (enabled: boolean) => {
    onToggle(enabled);
    if (enabled) {
      setSelectedBorderType('solid');
    } else {
      setSelectedBorderType('none');
    }
  };

  const handleColorSelect = (color: string) => {
    onBorderUpdate({ borderColor: color });
    if (!currentBorder) {
      onToggle(true);
      setSelectedBorderType('solid');
    }
  };

  const handleWidthChange = (width: number) => {
    onBorderUpdate({ borderWidth: width });
    if (!currentBorder) {
      onToggle(true);
      setSelectedBorderType('solid');
    }
  };

  return (
    <ResponsiveBottomSheet 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Select Border"
      description="Add borders to enhance your photo"
    >
      <div className="space-y-6">
        {/* Preview */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={sampleImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {currentBorder && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    border: `${borderWidth}px solid ${borderColor}`,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Border Type Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Border Style</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleBorderToggle(false)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                !currentBorder
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-400 rounded-sm" />
              </div>
              <h4 className="font-medium text-gray-900">No Border</h4>
              <p className="text-sm text-gray-500">Clean edge finish</p>
            </button>

            <button
              onClick={() => handleBorderToggle(true)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                currentBorder
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-400 rounded-sm border-2 border-gray-600" />
              </div>
              <h4 className="font-medium text-gray-900">With Border</h4>
              <p className="text-sm text-gray-500">Classic framed look</p>
            </button>
          </div>
        </div>

        {/* Border Customization */}
        {currentBorder && (
          <div className="space-y-6 animate-fadeIn">
            {/* Border Colors */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Palette size={18} className="mr-2" />
                Border Colors
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {borderOptions.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => handleColorSelect(option.color)}
                    className={`relative group p-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                      borderColor === option.color
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInScale 0.5s ease-out forwards'
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${option.preview} shadow-sm`} />
                    <p className="text-xs font-medium text-gray-700">{option.name}</p>
                    
                    {borderColor === option.color && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Width */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Border Width</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Thin</span>
                  <span>{borderWidth}px</span>
                  <span>Thick</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={borderWidth}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Width Preview */}
              <div className="flex justify-center space-x-4">
                {[1, 2, 4, 6, 8].map((width) => (
                  <button
                    key={width}
                    onClick={() => handleWidthChange(width)}
                    className={`w-8 h-8 rounded border-2 transition-all duration-200 ${
                      borderWidth === width ? 'border-pink-500' : 'border-gray-300'
                    }`}
                    style={{ borderWidth: `${width}px` }}
                  />
                ))}
              </div>            </div>
          </div>
        )}
      </div>
    </ResponsiveBottomSheet>
  );
};

export default BorderBottomSheet;