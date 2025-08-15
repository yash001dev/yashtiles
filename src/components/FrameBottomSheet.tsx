'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveBottomSheet } from './ResponsiveBottomSheet';
import { FrameColorOption, FrameCustomization } from '../types';

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
  const [frameColors, setFrameColors] = useState<FrameColorOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/frame-colors?where[available][equals]=true&sort=sortOrder`);
        if (!res.ok) throw new Error('Failed to fetch frame colors');
        const data = await res.json();
        const mapped: FrameColorOption[] = (data?.docs || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          color: c.color,
          description: c.description,
        }));
        if (isMounted) setFrameColors(mapped);
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to load frame colors');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = (frameId: FrameCustomization['frameColor']) => {
    onSelect(frameId);
    onClose();
  };
  if (loading) {
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

  if (error) {
    return (
      <ResponsiveBottomSheet 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Select Frame"
        description="Error loading frame colors"    >
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
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
        {frameColors.map((frame: FrameColorOption) => (
          <button
            key={frame.id}
            onClick={() => handleSelect(frame.id)}
            className={`w-full flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
              currentFrame === frame.id
                ? 'border-pink-500 bg-pink-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg shadow-sm ${frame.color}`} />
            
            <div className="flex-1 text-left">
              <h3 className="font-medium text-gray-900">{frame.name}</h3>
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