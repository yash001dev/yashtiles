import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import FrameDetails from './FrameDetails';
import MultiFrameSlider from './MultiFrameSlider';
import { FrameCustomization, FrameItem } from '../types';

interface ResponsiveLayoutProps {
  customization: FrameCustomization;
  frames: FrameItem[];
  activeFrameId: string | null;
  onFrameSelect: (frameId: string) => void;
  onFrameRemove: (frameId: string) => void;
  onAddFrame: () => void;
  onAddToCart?: () => void;
  hasUploadedImage: boolean;
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  customization,
  frames,
  activeFrameId,
  onFrameSelect,
  onFrameRemove,
  onAddFrame,
  onAddToCart,
  hasUploadedImage,
  children
}) => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  if (isLargeScreen) {
    // Desktop layout with sidebar
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
        <div className="flex">
          {/* Main content area */}
          <div className="flex-1 pr-6">
            {children}
            
            {/* Multi-frame slider for desktop */}
            {frames.length > 0 && (
              <div className="mt-6 px-6">
                <MultiFrameSlider
                  frames={frames}
                  activeFrameId={activeFrameId}
                  onFrameSelect={onFrameSelect}
                  onFrameRemove={onFrameRemove}
                  onAddFrame={onAddFrame}
                />
              </div>
            )}
          </div>          {/* Right sidebar for frame details */}
          {hasUploadedImage && (
            <div className="w-80 bg-white border-l border-gray-200 p-6 min-h-screen">
              <FrameDetails
                customization={customization}
                onAddToCart={onAddToCart}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  // Mobile/tablet layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      {children}
      
      {/* Multi-frame slider for mobile - placed before frame details */}
      {frames.length > 0 && (
        <div className="px-4 py-4">
          <MultiFrameSlider
            frames={frames}
            activeFrameId={activeFrameId}
            onFrameSelect={onFrameSelect}
            onFrameRemove={onFrameRemove}
            onAddFrame={onAddFrame}
          />
        </div>
      )}
        {/* Frame details as a card for mobile */}
      {hasUploadedImage && (
        <div className="px-4 pb-24">
          <FrameDetails
            customization={customization}
            onAddToCart={onAddToCart}
          />
        </div>
      )}
    </div>
  );
};

export default ResponsiveLayout;
