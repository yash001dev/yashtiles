'use client';

import React from 'react';
import { Edit3, Eye } from 'lucide-react';

interface PreviewModeToggleProps {
  mode: 'edit' | 'preview';
  onModeChange: (mode: 'edit' | 'preview') => void;
}

const PreviewModeToggle: React.FC<PreviewModeToggleProps> = ({
  mode,
  onModeChange
}) => {
  return (
    <div className="flex items-center justify-center my-2">
      <div className="bg-white rounded-full p-1 px-2 shadow-xl border border-gray-200 backdrop-blur-sm">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onModeChange('edit')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
              mode === 'edit'
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Edit3 size={18} />
            <span className="text-sm font-semibold">Frame</span>
          </button>
          
          <button
            onClick={() => onModeChange('preview')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
              mode === 'preview'
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Eye size={18} />
            <span className="text-sm font-semibold">Wall Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModeToggle; 