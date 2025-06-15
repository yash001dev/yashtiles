import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import BottomSheet from './BottomSheet';
import { BorderOption, FrameCustomization, UploadedImage } from '../types';

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
  onBorderUpdate,
  uploadedImage,
}) => {
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
  };

  const handleColorSelect = (color: string) => {
    onBorderUpdate({ borderColor: color });
    if (!currentBorder) {
      onToggle(true);
    }
  };

  const handleWidthChange = (width: number) => {
    onBorderUpdate({ borderWidth: width });
    if (!currentBorder) {
      onToggle(true);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Border" height="auto">
      <div className="px-4 pb-4 space-y-4">
        {/* Preview */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-white rounded-lg shadow-lg overflow-hidden">
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

        {/* Border Toggle */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleBorderToggle(false)}
            className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
              !currentBorder
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="w-8 h-8 bg-gray-100 rounded mx-auto mb-1 flex items-center justify-center">
              <div className="w-5 h-5 bg-gray-400 rounded-sm" />
            </div>
            <p className="text-xs font-medium text-gray-900">No Border</p>
          </button>

          <button
            onClick={() => handleBorderToggle(true)}
            className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
              currentBorder
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="w-8 h-8 bg-gray-100 rounded mx-auto mb-1 flex items-center justify-center">
              <div className="w-5 h-5 bg-gray-400 rounded-sm border-2 border-gray-600" />
            </div>
            <p className="text-xs font-medium text-gray-900">With Border</p>
          </button>
        </div>

        {/* Border Customization */}
        {currentBorder && (
          <div className="space-y-4">
            {/* Border Colors */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <Palette size={14} className="mr-1" />
                Border Colors
              </h3>
              
              <div className="overflow-x-auto pb-2">
                <div className="flex space-x-2 min-w-max">
                  {borderOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleColorSelect(option.color)}
                      className={`flex-shrink-0 w-12 p-2 rounded-lg border-2 transition-all duration-200 ${
                        borderColor === option.color
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${option.preview} shadow-sm`} />
                      <p className="text-xs font-medium text-gray-700">{option.name}</p>
                      
                      {borderColor === option.color && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-pink-500 rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Border Width */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">Border Width</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
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
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </BottomSheet>
  );
};

export default BorderBottomSheet;