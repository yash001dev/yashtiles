'use client';

import React, { useState, useEffect } from 'react';
import { Edit3, Eye } from 'lucide-react';

interface PreviewModeToggleProps {
  mode: 'edit' | 'preview';
  onModeChange: (mode: 'edit' | 'preview') => void;
}

const PreviewModeToggle: React.FC<PreviewModeToggleProps> = ({
  mode,
  onModeChange
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousMode, setPreviousMode] = useState(mode);
  const [isDisabled, setIsDisabled] = useState(false);

  // Handle mode changes with transition state
  useEffect(() => {
    if (mode !== previousMode) {
      setIsTransitioning(true);
      setIsDisabled(true);
      setTimeout(() => {
        setIsTransitioning(false);
        setIsDisabled(false);
      }, 400); // Slightly longer than the frame transition to prevent rapid clicking
      setPreviousMode(mode);
    }
  }, [mode, previousMode]);

  const handleModeChange = (newMode: 'edit' | 'preview') => {
    if (newMode !== mode && !isDisabled && !isTransitioning) {
      setIsDisabled(true);
      onModeChange(newMode);
    }
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className={`bg-white rounded-full p-1 shadow-xl border border-gray-200 backdrop-blur-sm transition-all duration-300 ${
        isTransitioning ? 'scale-105 shadow-2xl' : 'scale-100'
      } ${isDisabled ? 'opacity-75' : ''}`}>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleModeChange('edit')}
            disabled={isDisabled || isTransitioning}
            className={`flex items-center space-x-2 px-5 py-3 rounded-full transition-all duration-300 ${
              mode === 'edit'
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Edit3 size={18} className={`transition-transform duration-300 ${
              mode === 'edit' ? 'rotate-0' : 'rotate-0'
            }`} />
            <span className="text-sm font-semibold">Edit Frame</span>
          </button>
          
          <button
            onClick={() => handleModeChange('preview')}
            disabled={isDisabled || isTransitioning}
            className={`flex items-center space-x-2 px-5 py-3 rounded-full transition-all duration-300 ${
              mode === 'preview'
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Eye size={18} className={`transition-transform duration-300 ${
              mode === 'preview' ? 'scale-110' : 'scale-100'
            }`} />
            <span className="text-sm font-semibold">Wall Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModeToggle; 