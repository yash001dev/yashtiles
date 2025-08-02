'use client';

import React, { useState, useEffect } from 'react';
import { FrameCustomization, UploadedImage } from '../types';
import FrameRenderer from './ui/FrameRenderer';
import FramePreviewCanvas from './FramePreviewCanvas';

interface FramePreviewProps {
  customization: FrameCustomization;
  uploadedImage?: UploadedImage | null;
  onImageClick?: () => void;
  frameCount?: number;
  currentFrameIndex?: number;
  backgroundImage?: string;
  wallColor?: string;
  mode?: 'edit' | 'preview';
  onFrameDrag?: (pos: { x: number; y: number }) => void;
}

const FramePreview: React.FC<FramePreviewProps> = ({
  customization,
  uploadedImage,
  onImageClick,
  frameCount = 0,
  currentFrameIndex = 0,
  backgroundImage = "/framedecor1.png",
  wallColor = "#f3f4f6",
  mode = 'edit',
  onFrameDrag
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousMode, setPreviousMode] = useState(mode);
  const [showEditMode, setShowEditMode] = useState(mode === 'edit');
  const [showPreviewMode, setShowPreviewMode] = useState(mode === 'preview');
  const [isLoading, setIsLoading] = useState(false);

  // Handle mode changes with smooth transitions
  useEffect(() => {
    if (mode !== previousMode) {
      setIsTransitioning(true);
      setIsLoading(true);
      
      // Start transition
      if (mode === 'preview') {
        setShowEditMode(false);
        setTimeout(() => {
          setShowPreviewMode(true);
          setIsTransitioning(false);
          // Add a small delay before hiding loading to ensure smooth transition
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        }, 200); // Reduced transition time
      } else {
        setShowPreviewMode(false);
        setTimeout(() => {
          setShowEditMode(true);
          setIsTransitioning(false);
          // Add a small delay before hiding loading to ensure smooth transition
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        }, 200); // Reduced transition time
      }
      
      setPreviousMode(mode);
    }
  }, [mode, previousMode]);

  // Initialize modes on first render
  useEffect(() => {
    if (mode === 'edit') {
      setShowEditMode(true);
      setShowPreviewMode(false);
    } else {
      setShowEditMode(false);
      setShowPreviewMode(true);
    }
  }, []);

  const renderEditMode = () => (
    <div 
      className={`flex items-center justify-center min-h-[60vh] px-4 py-8 relative transition-all duration-200 ease-in-out ${
        showEditMode 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-4 pointer-events-none absolute inset-0'
      }`}
      style={{
        backgroundColor: 'transparent',
        backgroundImage: 'none'
      }}
    >
      <div className={`relative transition-all duration-200 ease-in-out ${
        showEditMode 
          ? 'opacity-100 transform scale-100' 
          : 'opacity-0 transform scale-95'
      }`}>
        {/* Outer frame with 3D shadow effect */}
        <div className="relative">
          <FrameRenderer
            customization={customization}
            uploadedImage={uploadedImage}
            onImageClick={onImageClick}
            frameCount={frameCount}
            currentFrameIndex={currentFrameIndex}
            showFrameCounter={true}
            showEditOverlay={true}
            isEditable={false}
            frameId={frameCount.toString()}
          />
        </div>

        <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-white drop-shadow-lg whitespace-nowrap transition-all duration-200 ease-in-out ${
          showEditMode 
            ? 'opacity-100 transform translate-x-1/2 translate-y-0' 
            : 'opacity-0 transform translate-x-1/2 translate-y-2'
        }`}>
          {customization.size.replace('x', ' × ')} • {customization.material} • {customization.frameColor}
        </div>
      </div>
    </div>
  );

  const renderPreviewMode = () => (
    <div className={`w-full h-full min-h-[60vh] relative transition-all duration-200 ease-in-out ${
      showPreviewMode 
        ? 'opacity-100 transform scale-100' 
        : 'opacity-0 transform scale-95 pointer-events-none absolute inset-0'
    }`}>
      <FramePreviewCanvas
        customization={customization}
        uploadedImage={uploadedImage}
        backgroundImage={backgroundImage}
        wallColor={wallColor}
        onFrameDrag={onFrameDrag}
      />
    </div>
  );

  return (
    <div className="relative w-full h-full min-h-[60vh]">
      {/* Edit Mode */}
      {renderEditMode()}
      
      {/* Preview Mode */}
      {renderPreviewMode()}
      
      {/* Improved Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-pink-300 rounded-full animate-ping"></div>
            </div>
            <div className="text-gray-600 font-medium text-sm">
              {mode === 'preview' ? 'Loading Wall Preview...' : 'Loading Edit Mode...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FramePreview;