'use client';

import React, {  } from 'react';
import { ResponsiveBottomSheet } from './ResponsiveBottomSheet';
import { FrameCustomization } from '../types';
import { FrameColorData, useFrameColors } from '@/hooks/useFrameColors';
import _ from 'lodash';

interface FrameBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentFrame: FrameCustomization['frameColor'];
  onSelect: (frame: FrameCustomization['frameColor']) => void;
}

const FrameBottomSheet: React.FC<FrameBottomSheetProps> = ({
  isOpen,
  onClose,
  currentFrame,
  onSelect,
}) => {
  const { data:frameColors, isLoading: fetchingLoading, isError: fetchingError } = useFrameColors();

  
  const handleSelect = (frameId: FrameCustomization['frameColor']) => {
    onSelect(frameId);
    onClose();
  };
  if ( fetchingLoading) {
    return (
      <ResponsiveBottomSheet 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Select Frame"
        description="Loading frame colors..."    >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      </ResponsiveBottomSheet>
    );
  }

  if ( fetchingError) {
    return (
      <ResponsiveBottomSheet 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Select Frame"
        description="Error loading frame colors"    >
        <div className="text-center py-8">
          <p className="text-red-500">{
            fetchingError?.message?? 'Failed to load frame colors'
          }</p>
        </div>
      </ResponsiveBottomSheet>
    );
  }
  return (
    <ResponsiveBottomSheet 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Select Frame"
      description="Choose the perfect frame color for your photo"    >
      <div className="space-y-4">
        <div className="space-y-3">
        {frameColors?.map((frame: FrameColorData) => (
          <button
            key={frame.id}
            onClick={() => handleSelect(frame?.name)}
            className={`w-full flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
              currentFrame === frame?.name
                ? 'border-pink-500 bg-pink-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg shadow-sm`}
            style={{ backgroundColor: frame.color }}
            />
            
            <div className="flex-1 text-left">
              <h3 className="font-medium text-gray-900">{_.capitalize(frame.name)}</h3>
              <p className="text-sm text-gray-500">{frame.description}</p>
            </div>
          </button>
        ))}
        </div>
      </div>
    </ResponsiveBottomSheet>
  );
};

export default FrameBottomSheet;