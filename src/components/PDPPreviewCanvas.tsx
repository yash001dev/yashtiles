'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Group } from 'react-konva';
import { motion } from 'framer-motion';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDPPreviewCanvasProps {
  selectedImage: string;
  selectedSize: { 
    name: string; 
    dimensions: string; 
    aspectRatio: number; 
  };
  selectedColor: string;
  selectedMaterial: string;
  wallImage: string;
  onWallImageChange: (imageUrl: string) => void;
  className?: string;
}

export const PDPPreviewCanvas: React.FC<PDPPreviewCanvasProps> = ({
  selectedImage,
  selectedSize,
  selectedColor,
  selectedMaterial,
  wallImage,
  onWallImageChange,
  className = ""
}) => {
  const stageRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [backgroundImageObj, setBackgroundImageObj] = useState<HTMLImageElement | null>(null);
  const [productImageObj, setProductImageObj] = useState<HTMLImageElement | null>(null);
  const [isLoadingWall, setIsLoadingWall] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  
  const canvasWidth = 400;
  const canvasHeight = 400;
  
  // Frame settings based on selection
  const frameThickness = 20;
  
  // Frame color mapping
  const getFrameColor = () => {
    if (selectedColor.startsWith('#')) {
      return selectedColor;
    }
    // Map color names to hex codes
    const colorMap: { [key: string]: string } = {
      'Classic Black': '#000000',
      'White': '#FFFFFF',
      'Brown': '#8B4513',
      'Gold': '#FFD700',
      'Silver': '#C0C0C0',
    };
    return colorMap[selectedColor] || '#8B4513';
  };
  
  const frameColor = getFrameColor();
  
  // Calculate frame dimensions based on selected size
  const getFrameDimensions = () => {
    const aspectRatio = selectedSize?.aspectRatio || 1;
    const maxFrameWidth = canvasWidth * 0.6;
    const maxFrameHeight = canvasHeight * 0.6;
    
    let frameWidth, frameHeight;
    
    if (aspectRatio >= 1) {
      frameWidth = maxFrameWidth;
      frameHeight = frameWidth / aspectRatio;
      if (frameHeight > maxFrameHeight) {
        frameHeight = maxFrameHeight;
        frameWidth = frameHeight * aspectRatio;
      }
    } else {
      frameHeight = maxFrameHeight;
      frameWidth = frameHeight * aspectRatio;
      if (frameWidth > maxFrameWidth) {
        frameWidth = maxFrameWidth;
        frameHeight = frameWidth / aspectRatio;
      }
    }
    
    return { frameWidth, frameHeight };
  };

  const { frameWidth, frameHeight } = getFrameDimensions();
  const frameX = (canvasWidth - frameWidth) / 2;
  const frameY = (canvasHeight - frameHeight) / 2;

  // Load background image
  useEffect(() => {
    if (wallImage) {
      setIsLoadingWall(true);
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setBackgroundImageObj(img);
        setIsLoadingWall(false);
      };
      img.onerror = () => {
        setIsLoadingWall(false);
      };
      img.src = wallImage;
    }
  }, [wallImage]);

  // Load product image
  useEffect(() => {
    if (selectedImage) {
      setIsLoadingProduct(true);
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setProductImageObj(img);
        setIsLoadingProduct(false);
      };
      img.onerror = () => {
        setIsLoadingProduct(false);
      };
      img.src = selectedImage;
    }
  }, [selectedImage]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onWallImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWallImageSelect = (imagePath: string) => {
    onWallImageChange(imagePath);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Canvas Container */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <Stage width={canvasWidth} height={canvasHeight} ref={stageRef}>
          <Layer>
            {/* Background/Wall Image */}
            {backgroundImageObj && (
              <KonvaImage
                image={backgroundImageObj}
                x={0}
                y={0}
                width={canvasWidth}
                height={canvasHeight}
                listening={false}
              />
            )}
            
            {/* Frame Group */}
            <Group
              x={frameX}
              y={frameY}
            >
              {/* Frame Border */}
              <Rect
                x={0}
                y={0}
                width={frameWidth}
                height={frameHeight}
                fill={frameColor}
                listening={false}
              />
              
              {/* Inner Frame Area (mat) */}
              <Rect
                x={frameThickness}
                y={frameThickness}
                width={frameWidth - frameThickness * 2}
                height={frameHeight - frameThickness * 2}
                fill="white"
                listening={false}
              />
              
              {/* Product Image */}
              {productImageObj && (
                <KonvaImage
                  image={productImageObj}
                  x={frameThickness}
                  y={frameThickness}
                  width={frameWidth - frameThickness * 2}
                  height={frameHeight - frameThickness * 2}
                  listening={false}
                />
              )}
            </Group>
          </Layer>
        </Stage>
        
        {/* Loading Overlays */}
        {(isLoadingWall || isLoadingProduct) && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
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
      
      {/* Frame Info */}
      <div className="text-sm text-gray-600 space-y-1">
        <div>Size: {selectedSize?.name || 'Not selected'}</div>
        <div>Material: {selectedMaterial || 'Not selected'}</div>
        <div>Color: {selectedColor || 'Not selected'}</div>
      </div>
    </div>
  );
};
