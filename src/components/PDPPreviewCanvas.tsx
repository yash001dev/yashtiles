'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Group, Line } from 'react-konva';
import { motion } from 'framer-motion';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useImage from 'use-image';

// Helper functions from FramePreviewCanvas
const getFrameColor = (color: string) => {
  // Handle hex colors
  if (color.startsWith('#')) {
    return color;
  }
  
  // Handle color names
  switch (color.toLowerCase()) {
    case 'white':
    case 'classic white':
      return '#fff';
    case 'brown':
    case 'classic brown':
      return '#a0522d';
    case 'black':
    case 'classic black':
      return '#111';
    case 'gold':
      return '#FFD700';
    case 'silver':
      return '#C0C0C0';
    default:
      return '#111';
  }
};

const getFrameBorderColor = (color: string) => {
  // Handle hex colors
  if (color.startsWith('#')) {
    return color;
  }
  
  switch (color.toLowerCase()) {
    case 'white':
    case 'classic white':
      return '#e5e7eb';
    case 'brown':
    case 'classic brown':
      return '#8b5c2d';
    case 'black':
    case 'classic black':
      return '#1f2937';
    default:
      return '#1f2937';
  }
};

const getEffectFilter = (effect: string) => {
  switch (effect) {
    case 'silver':
      return 'grayscale(1) contrast(1.1)';
    case 'noir':
      return 'grayscale(1) contrast(1.5) brightness(0.9)';
    case 'vivid':
      return 'saturate(1.5) contrast(1.2)';
    case 'dramatic':
      return 'contrast(1.4) brightness(0.95) saturate(1.3)';
    default:
      return 'none';
  }
};

// Helper for aspect ratio from dimensions
const getAspectRatioFromDimensions = (dimensions: string): number => {
  const parts = dimensions.split('x').map(s => parseInt(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] / parts[1];
  }
  return 1;
};

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
  onFrameDrag?: (pos: { x: number; y: number }) => void;
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
  className = ""
}) => {
  const stageRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use useImage hook like FramePreviewCanvas
  const [backgroundImg] = useImage(wallImage, 'anonymous');
  const [frameImg] = useImage(selectedImage, 'anonymous');
  
  const [isLoadingWall, setIsLoadingWall] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [framePosition, setFramePosition] = useState({ x: 200, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  
  // Responsive stage size
  useEffect(() => {
    const updateStageSize = () => {
      const container = stageRef.current?.container()?.parentElement;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        const minWidth = 300;
        const minHeight = 400;
        setStageSize({ 
          width: Math.max(width || 800, minWidth), 
          height: Math.max(height || 600, minHeight) 
        });
      }
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    return () => window.removeEventListener('resize', updateStageSize);
  }, []);

  // Frame size calculation based on FramePreviewCanvas method
  const getFrameSize = () => {
    const responsiveWidth = Math.min(400, window.innerWidth - 32);
    const aspect = selectedSize?.aspectRatio || getAspectRatioFromDimensions(selectedSize?.dimensions || '1x1');
    const canvasWidth = responsiveWidth - 30;
    const canvasHeight = responsiveWidth / aspect;
    
    return {
      width: canvasWidth,
      height: canvasHeight
    };
  };

  const frameSize = getFrameSize();

  // Recalculate frame position when stage size changes
  useEffect(() => {
    if (stageSize.width > 0 && stageSize.height > 0) {
      const newFrameSize = getFrameSize();
      
      if (!hasBeenDragged) {
        const centerX = (stageSize.width - newFrameSize.width) / 2;
        const centerY = (stageSize.height - newFrameSize.height) / 2;
        setFramePosition({ x: centerX, y: centerY });
      }
    }
  }, [stageSize, hasBeenDragged]);

  // Frame style calculations based on material (from FramePreviewCanvas)
  let frameBorder = 0;
  let frameColor = getFrameColor(selectedColor);
  let frameBorderColor = getFrameBorderColor(selectedColor);
  
  if (selectedMaterial.toLowerCase() === 'classic') {
    frameBorder = 15;
  } else if (selectedMaterial.toLowerCase() === 'frameless') {
    frameBorder = 0;
  } else if (selectedMaterial.toLowerCase() === 'canvas') {
    frameBorder = 0;
  }

  // Matting/inner border
  const matting = selectedMaterial.toLowerCase() === 'classic' || 
                  selectedMaterial.toLowerCase() === 'frameless' || 
                  selectedMaterial.toLowerCase() === 'canvas' ? 0 : 10;

  // Calculate available area for image
  const baseAvailableWidth = selectedMaterial.toLowerCase() === 'frameless' || selectedMaterial.toLowerCase() === 'canvas'
    ? frameSize.width - 2 * (selectedMaterial.toLowerCase() === 'canvas' ? frameBorder : 0)
    : frameSize.width - 2 * (frameBorder + matting);
  const baseAvailableHeight = selectedMaterial.toLowerCase() === 'frameless' || selectedMaterial.toLowerCase() === 'canvas'
    ? frameSize.height - 2 * (selectedMaterial.toLowerCase() === 'canvas' ? frameBorder : 0)
    : frameSize.height - 2 * (frameBorder + matting);
    
  const availableWidth = baseAvailableWidth;
  const availableHeight = baseAvailableHeight;

  // Image sizing logic
  const naturalWidth = frameImg?.width || 1;
  const naturalHeight = frameImg?.height || 1;
  const imageAspect = naturalWidth / naturalHeight;
  const areaAspect = availableWidth / availableHeight;

  let displayWidth = availableWidth;
  let displayHeight = availableHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (frameImg) {
    if (selectedMaterial.toLowerCase() === 'frameless' || selectedMaterial.toLowerCase() === 'canvas') {
      if (imageAspect > areaAspect) {
        displayHeight = availableHeight;
        displayWidth = availableHeight * imageAspect;
        offsetX = (availableWidth - displayWidth) / 2;
      } else {
        displayWidth = availableWidth;
        displayHeight = availableWidth / imageAspect;
        offsetY = (availableHeight - displayHeight) / 2;
      }
    } else {
      if (imageAspect > areaAspect) {
        displayWidth = availableWidth;
        displayHeight = availableWidth / imageAspect;
        offsetY = (availableHeight - displayHeight) / 2;
      } else {
        displayHeight = availableHeight;
        displayWidth = availableHeight * imageAspect;
        offsetX = (availableWidth - displayWidth) / 2;
      }
    }
  }

  // Handle frame drag
  const handleFrameDragStart = () => {
    setIsDragging(true);
  };

  const handleFrameDragEnd = (e: any) => {
    const newPos = e.target.position();
    setFramePosition(newPos);
    setIsDragging(false);
    setHasBeenDragged(true);
    if (onFrameDrag) {
      onFrameDrag(newPos);
    }
  };

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
      <div className="relative bg-gray-100 rounded-lg overflow-hidden w-full h-full min-h-[60vh]">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          style={{ 
            background: '#f3f4f6',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <Layer>
            {/* Background/Wall Image */}
            {backgroundImg && (
              <KonvaImage
                image={backgroundImg}
                x={0}
                y={0}
                width={stageSize.width}
                height={stageSize.height}
                listening={false}
              />
            )}
            
            {/* Frame Group - Draggable */}
            <Group
              x={framePosition.x}
              y={framePosition.y}
              draggable={true}
              onDragStart={handleFrameDragStart}
              onDragEnd={handleFrameDragEnd}
              opacity={isDragging ? 0.8 : 1}
              scaleX={isDragging ? 0.45 : 0.4}
              scaleY={isDragging ? 0.45 : 0.4}
            >
              {/* Frame rendering based on material (same as FramePreviewCanvas) */}
              {selectedMaterial.toLowerCase() === 'classic' ? (
                // Draw 3D beveled classic frame
                <>
                  {/* Main background */}
                  <Rect
                    x={0}
                    y={0}
                    width={frameSize.width}
                    height={frameSize.height}
                    fill={frameColor}
                    shadowColor={'#000'}
                    shadowBlur={10}
                    shadowOpacity={0.3}
                    shadowOffset={{ x: 2, y: 2 }}
                  />
                  
                  {/* Matting/inner border */}
                  <Rect
                    x={frameBorder}
                    y={frameBorder}
                    width={frameSize.width - 2 * frameBorder}
                    height={frameSize.height - 2 * frameBorder}
                    fill={'#fff'}
                  />
                  
                  {/* Inner shadow for depth */}
                  <Rect
                    x={frameBorder}
                    y={frameBorder}
                    width={frameSize.width - 2 * frameBorder}
                    height={8}
                    fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                    fillLinearGradientEndPoint={{ x: 0, y: 8 }}
                    fillLinearGradientColorStops={[0, 'rgba(0,0,0,0.18)', 1, 'rgba(0,0,0,0)']}
                    listening={false}
                  />
                  
                  {/* Top bevel */}
                  <Line
                    points={[
                      0, 0,
                      frameSize.width, 0,
                      frameSize.width - frameBorder, frameBorder,
                      frameBorder, frameBorder
                    ]}
                    closed
                    fill={frameColor}
                    listening={false}
                  />
                  {/* Left bevel */}
                  <Line
                    points={[
                      0, 0,
                      frameBorder, frameBorder,
                      frameBorder, frameSize.height - frameBorder,
                      0, frameSize.height
                    ]}
                    closed
                    fill={frameColor}
                    listening={false}
                  />
                  {/* Right bevel */}
                  <Line
                    points={[
                      frameSize.width, 0,
                      frameSize.width, frameSize.height,
                      frameSize.width - frameBorder, frameSize.height - frameBorder,
                      frameSize.width - frameBorder, frameBorder
                    ]}
                    closed
                    fill={frameColor}
                    listening={false}
                  />
                  {/* Bottom bevel */}
                  <Line
                    points={[
                      frameBorder, frameSize.height - frameBorder,
                      frameSize.width - frameBorder, frameSize.height - frameBorder,
                      frameSize.width, frameSize.height,
                      0, frameSize.height
                    ]}
                    closed
                    fill={frameColor}
                    listening={false}
                  />
                </>
              ) : selectedMaterial.toLowerCase() === 'frameless' || selectedMaterial.toLowerCase() === 'canvas' ? (
                // Frameless/Canvas style
                <Rect
                  x={0}
                  y={0}
                  width={frameSize.width}
                  height={frameSize.height}
                  fill={'#fff'}
                  stroke={frameBorderColor}
                  strokeWidth={2}
                  shadowColor={'#000'}
                  shadowBlur={8}
                  shadowOpacity={0.2}
                  shadowOffset={{ x: 2, y: 2 }}
                />
              ) : (
                // Other frame types
                <Rect
                  x={0}
                  y={0}
                  width={frameSize.width}
                  height={frameSize.height}
                  fill={frameColor}
                  stroke={frameBorderColor}
                  strokeWidth={frameBorder}
                  cornerRadius={6}
                  shadowColor={'#000'}
                  shadowBlur={8}
                  shadowOpacity={0.2}
                  shadowOffset={{ x: 2, y: 2 }}
                />
              )}
              
              {/* Matting/inner border for non-classic */}
              {selectedMaterial.toLowerCase() !== 'classic' && matting > 0 && (
                <Rect
                  x={frameBorder}
                  y={frameBorder}
                  width={frameSize.width - 2 * frameBorder}
                  height={frameSize.height - 2 * frameBorder}
                  fill={'#fff'}
                  shadowColor={'#000'}
                  shadowBlur={2}
                  shadowOpacity={0.08}
                />
              )}
              
              {/* Image group with clipping */}
              <Group
                x={selectedMaterial.toLowerCase() === 'frameless' 
                  ? 0
                  : selectedMaterial.toLowerCase() === 'canvas'
                    ? frameBorder
                    : frameBorder + matting
                }
                y={selectedMaterial.toLowerCase() === 'frameless' 
                  ? 0
                  : selectedMaterial.toLowerCase() === 'canvas'
                    ? frameBorder
                    : frameBorder + matting
                }
                width={availableWidth}
                height={availableHeight}
                clipFunc={ctx => {
                  ctx.beginPath();
                  ctx.rect(0, 0, availableWidth, availableHeight);
                  ctx.closePath();
                }}
              >
                {/* Product Image */}
                {frameImg && (
                  <KonvaImage
                    image={frameImg}
                    width={displayWidth}
                    height={displayHeight}
                    x={offsetX}
                    y={offsetY}
                    listening={false}
                    perfectDrawEnabled={false}
                  />
                )}
              </Group>
            </Group>
          </Layer>
        </Stage>
        
        {/* Loading Overlay */}
        {isLoadingWall && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}

        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm max-w-xs">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Drag the frame to place it on the wall</span>
          </div>
          <div className="text-xs opacity-75">
            Size: {selectedSize?.name} | Material: {selectedMaterial} | Color: {selectedColor}
          </div>
        </div>
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
