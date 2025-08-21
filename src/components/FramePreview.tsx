'use client';

import React from 'react';
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
  imageFitMode?: 'contain' | 'cover' | 'fill' | 'none';
  fromPDP?: boolean;
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
  onFrameDrag,
  imageFitMode,
  fromPDP=false
}) => {
  if (mode === 'preview') {
    return (
      <FramePreviewCanvas
        customization={customization}
        uploadedImage={uploadedImage}
        backgroundImage={backgroundImage}
        wallColor={wallColor}
        onFrameDrag={onFrameDrag}
        imageFit={"cover"}
        fromPDP={fromPDP}
      />
    );
  }

  return (
    <div 
      className="flex items-center justify-center min-h-[60vh] px-4 py-8 relative"
      style={{
        backgroundColor: 'transparent',
        backgroundImage: 'none'
      }}
    >
      
      <div className="relative animate-fadeIn z-10">
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

        <div className="absolute -bottom-[2.5rem] left-1/2 transform -translate-x-1/2 text-sm text-black drop-shadow-lg whitespace-nowrap animate-slideUp">
          {customization.size.replace('x', ' × ')} • {customization.material} • {customization.frameColor}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};

export default FramePreview;