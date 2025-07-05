import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import FrameDetails from './FrameDetails';
import MultiFrameSlider from './MultiFrameSlider';
import { FrameCustomization, FrameItem, UploadedImage } from '../types';

interface ResponsiveLayoutProps {
  customization: FrameCustomization;
  frames: FrameItem[];
  activeFrameId: string | null;
  onFrameSelect: (frameId: string) => void;
  onFrameRemove: (frameId: string) => void;
  onAddFrame: () => void;
  onAddToCart?: () => void;
  onAuthRequired?: () => void;
  hasUploadedImage: boolean;
  uploadedImage?: UploadedImage | null;
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
  onAuthRequired,
  hasUploadedImage,
  uploadedImage,
  children
}) => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');  if (isLargeScreen) {
    // Desktop layout with left sidebar and right panel - starts after header
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-pink-50 min-h-[calc(100vh-4rem)]">
        <div className="flex">
          {/* Main content area - offset by left sidebar, positioned after header */}
          <div className="flex-1 pl-20">
            {children}
            
            {/* Multi-frame slider for desktop */}
            {hasUploadedImage && (
              <div className="mt-6 px-6">
                <MultiFrameSlider
                  frames={frames}
                  activeFrameId={activeFrameId}
                  onFrameSelect={onFrameSelect}
                  onFrameRemove={onFrameRemove}
                  onAddFrame={onAddFrame}
                  onAuthRequired={onAuthRequired}
                  uploadedImage={uploadedImage}
                  currentCustomization={customization}
                />
              </div>
            )}
          </div>
          
          {/* Right sidebar for frame details */}
          {hasUploadedImage && (
            <div className="w-80 bg-white border-l border-gray-200 p-6 min-h-[calc(100vh-4rem)]">
              <FrameDetails
                frames={frames}
                customization={customization}
                onAddToCart={onAddToCart}
              />
            </div>
          )}
        </div>
      </div>
    );
  }  // Mobile/tablet layout
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-pink-50 min-h-[calc(100vh-4rem)]">
      {children}
      
      {/* Multi-frame slider for mobile - placed before frame details */}
      {hasUploadedImage && (
        <div className="px-4 py-4">
          <MultiFrameSlider
            frames={frames}
            activeFrameId={activeFrameId}
            onFrameSelect={onFrameSelect}
            onFrameRemove={onFrameRemove}
            onAddFrame={onAddFrame}
            onAuthRequired={onAuthRequired}
            uploadedImage={uploadedImage}
            currentCustomization={customization}
          />
        </div>
      )}
      
      {/* Frame details as a card for mobile */}
      {hasUploadedImage && (
        <div className="px-4 pb-24">
          <FrameDetails
            frames={frames}
            customization={customization}
            onAddToCart={onAddToCart}
          />
        </div>
      )}
    </div>
  );
};

export default ResponsiveLayout;
