'use client';

import React, { useRef, useState } from 'react';
import FramePreview from './FramePreview';
import { FrameCustomization, UploadedImage } from '../types';
import { Button } from './ui/button';
import { Upload, Loader2 } from 'lucide-react';

interface PDPPreviewCanvasProps {
  selectedImage: string;
  selectedSize:string;
  selectedColor: string;
  selectedMaterial: string;
  wallImage: string;
  onWallImageChange: (imageUrl: string) => void;
  onFrameDrag?: (pos: { x: number; y: number }) => void;
  onMaterialSelect?: (material: "classic" | "frameless" | "canvas" | "3d") => void;
  onBorderChange?: (updates: { borderColor?: string; borderWidth?: number }) => void;
  previewMode?: 'edit' | 'preview';
  className?: string;
}

export const PDPPreviewCanvas: React.FC<PDPPreviewCanvasProps> = ({
  selectedImage,
  selectedSize,
  selectedColor,
  selectedMaterial,
  wallImage,
  onWallImageChange,
  onFrameDrag,
  onMaterialSelect,
  onBorderChange,
  previewMode = 'preview',
  className = ""
}) => {
  // Local state for file input and loading
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingWall, setIsLoadingWall] = useState(false);

  // Handler for wall image selection
  const handleWallImageSelect = (imagePath: string) => {
    onWallImageChange(imagePath);
  };

  // Handler for custom wall image upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoadingWall(true);
    try {
      // Create object URL for the uploaded file
      const imageUrl = URL.createObjectURL(file);
      onWallImageChange(imageUrl);
    } catch (error) {
      console.error('Error uploading wall image:', error);
    } finally {
      setIsLoadingWall(false);
    }
  };

  // Convert the props to match FramePreview's expected customization prop
  const customization: FrameCustomization = {
    material: selectedMaterial.toLowerCase() as "classic" | "frameless" | "canvas" | "3d",
    frameColor: selectedColor.toLowerCase() as "black" | "white" | "brown",
    size: selectedSize as "8x8" | "8x10" | "10x8" | "9x12" | "12x9" | "12x12" | "12x18" | "18x12" | "18x18" | "18x24" | "24x18" | "24x32" | "32x24" | "8x11" | "11x8",
    effect: 'original',
    border: true,
    borderColor: selectedColor.toLowerCase(), // Using the selected color as border color
    borderWidth: selectedMaterial.toLowerCase() === 'frameless' ? 1 : selectedMaterial.toLowerCase() === 'canvas' ? 2 : 3,
    hangType: 'stickable_tape'
  };

  // Create the uploaded image object with transform
  const uploadedImage: UploadedImage = {
    url: selectedImage,
    file: new File([], ""), // Empty file since we're using URL
    transform: {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0
    }
  };

  // Return the FramePreview component with proper props
  // Update border when material changes
  React.useEffect(() => {
    if (onBorderChange) {
      onBorderChange({
        borderColor: selectedColor.toLowerCase(),
        borderWidth: selectedMaterial.toLowerCase() === 'frameless' ? 1 : selectedMaterial.toLowerCase() === 'canvas' ? 2 : 3
      });
    }
  }, [selectedMaterial, selectedColor, onBorderChange]);
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <FramePreview
          customization={customization}
          uploadedImage={uploadedImage}
          backgroundImage={wallImage}
          onFrameDrag={onFrameDrag}
          mode={previewMode}
          imageFitMode="fill"
        />
        
        {/* Loading Overlay */}
        {isLoadingWall && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading wall image...</span>
            </div>
          </div>
        )}
      </div>

      {/* Wall Image Selection */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Choose Wall Background</h4>
        
        {/* Preset Wall Images */}
        <div className="grid grid-cols-3 gap-2">
          {[
            '/framedecor1.png',
            '/framedecor2.png',
            '/framedecor3.png'
          ].map((imagePath, index) => (
            <button
              key={index}
              onClick={() => handleWallImageSelect(imagePath)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:border-pink-300 ${
                wallImage === imagePath ? 'border-pink-500' : 'border-gray-200'
              }`}
            >
              <img
                src={imagePath}
                alt={`Wall decoration ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
        
        {/* Upload Custom Wall Image */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            disabled={isLoadingWall}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Custom Wall
          </Button>
        </div>
      </div>
    </div>
  );
};
