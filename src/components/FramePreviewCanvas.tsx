'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Group, Line } from 'react-konva';
import useImage from 'use-image';
import { FrameCustomization, UploadedImage } from '../types';

// Helper functions from KonvaFrameRenderer
const getFrameColor = (color: string) => {
  switch (color) {
    case 'white':
      return '#fff';
    case 'brown':
      return '#a0522d';
    default:
      return '#111';
  }
};

const getFrameBorderColor = (color: string) => {
  switch (color) {
    case 'white':
      return '#e5e7eb';
    case 'brown':
      return '#8b5c2d';
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

// Utility to lighten or darken a hex color
function shadeColor(hex: string, percent: number): string {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  r = Math.min(255, Math.max(0, Math.round(r + (percent / 100) * 255)));
  g = Math.min(255, Math.max(0, Math.round(g + (percent / 100) * 255)));
  b = Math.min(255, Math.max(0, Math.round(b + (percent / 100) * 255)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Helper for aspect ratio
const getAspectRatio = (size: string): number => {
  switch (size) {
    case '8x8':
    case '12x12':
    case '18x18':
      return 1;
    case '8x10':
      return 8 / 10;
    case '10x8':
      return 10 / 8;
    case '9x12':
      return 9 / 12;
    case '12x9':
      return 12 / 9;
    case '12x18':
      return 12 / 18;
    case '18x12':
      return 18 / 12;
    case '18x24':
      return 18 / 24;
    case '24x18':
      return 24 / 18;
    case '24x32':
      return 24 / 32;
    case '32x24':
      return 32 / 24;
    default:
      return 1;
  }
};

interface FramePreviewCanvasProps {
  customization: FrameCustomization;
  uploadedImage?: UploadedImage | null;
  backgroundImage?: string;
  wallColor?: string;
  onFrameDrag?: (pos: { x: number; y: number }) => void;
  imageFit?: 'cover' | 'fill' | 'contain' | 'none';
}

const FramePreviewCanvas: React.FC<FramePreviewCanvasProps> = ({
  customization,
  uploadedImage,
  backgroundImage = "/framedecor1.png",
  wallColor = "#f3f4f6",
  onFrameDrag,
  imageFit = 'cover'
}) => {
  const stageRef = useRef<any>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [framePosition, setFramePosition] = useState({ x: 200, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  
  // Load images
  const [backgroundImg] = useImage(backgroundImage, 'anonymous');
  const [frameImg] = useImage(uploadedImage?.url || '', 'anonymous');

  // Responsive stage size
  useEffect(() => {
    const updateStageSize = () => {
      const container = stageRef.current?.container()?.parentElement;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        // Ensure minimum size and handle mobile better
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

  // Frame size calculation - use same method as KonvaFrameRenderer for consistency
  const getFrameSize = () => {
    // Use the same calculation method as KonvaFrameRenderer
    const responsiveWidth = Math.min(400, window.innerWidth - 32);
    const aspect = getAspectRatio(customization.size);
    const canvasWidth = responsiveWidth - 30;
    const canvasHeight = responsiveWidth / aspect;
    
    return {
      width: canvasWidth,
      height: canvasHeight
    };
  };

  const frameSize = getFrameSize();

  // Recalculate frame size and position when stage size changes
  React.useEffect(() => {
    if (stageSize.width > 0 && stageSize.height > 0) {
      // Recalculate frame size based on new viewport
      const newFrameSize = getFrameSize();
      
      // Only update position if not dragged yet
      if (!hasBeenDragged) {
        const centerX = (stageSize.width - newFrameSize.width) / 2;
        const centerY = (stageSize.height - newFrameSize.height) / 2;
        setFramePosition({ x: centerX, y: centerY });
      }
    }
  }, [stageSize, hasBeenDragged]);

  // Frame style calculations (same as KonvaFrameRenderer)
  let frameBorder = 0;
  let frameColor = getFrameColor(customization.frameColor);
  let frameBorderColor = getFrameBorderColor(customization.frameColor);
  
  // Use exact same values as KonvaFrameRenderer
  if (customization.material === 'classic') {
    frameBorder = 15;
  } else if (customization.material === 'frameless') {
    frameBorder = 0;
  } else if (customization.material === 'canvas') {
    frameBorder = 0;
  }

  // Shadow and bevel colors - needed for frame rendering
  let shadow = {};
  const bevelTop = frameColor;
  const bevelLeft = frameColor;
  const bevelRight = frameColor;
  const bevelBottom = frameColor;

  // Matting/inner border - same as KonvaFrameRenderer
  const matting = customization.material === 'classic' || customization.material === 'frameless' || customization.material === 'canvas' ? 0 : 10;

  // Image transform
  const transform = uploadedImage?.transform || { scale: 1, rotation: 0, x: 0, y: 0 };

  // Border - same as KonvaFrameRenderer
  const showCustomBorder = customization.border && customization.borderWidth && customization.borderColor;
  const customBorderWidth = showCustomBorder ? Math.max(customization.borderWidth! * 3, 8) : 0;

  // Calculate available area for image - use exact same method as KonvaFrameRenderer
  const baseAvailableWidth = customization.material === 'frameless' || customization.material === 'canvas'
    ? frameSize.width - 2 * (customization.material === 'canvas' ? frameBorder : 0)
    : frameSize.width - 2 * (frameBorder + matting);
  const baseAvailableHeight = customization.material === 'frameless' || customization.material === 'canvas'
    ? frameSize.height - 2 * (customization.material === 'canvas' ? frameBorder : 0)
    : frameSize.height - 2 * (frameBorder + matting);
    
  // Final available area after accounting for custom border
  const availableWidth = baseAvailableWidth - 2 * customBorderWidth;
  const availableHeight = baseAvailableHeight - 2 * customBorderWidth;

  // Get natural image size
  const naturalWidth = frameImg?.width || 1;
  const naturalHeight = frameImg?.height || 1;
  const imageAspect = naturalWidth / naturalHeight;
  const areaAspect = availableWidth / availableHeight;

  let displayWidth = availableWidth;
  let displayHeight = availableHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (frameImg) {
    if (imageFit === 'fill') {
      // Fill mode: stretch to fill the available space
      displayWidth = availableWidth;
      displayHeight = availableHeight;
      offsetX = 0;
      offsetY = 0;
    } else {
      // Cover mode: maintain aspect ratio and cover the entire area
      if (customization.material === 'frameless' || customization.material === 'canvas') {
        if (imageAspect > areaAspect) {
          // Image is wider than area - match height
          displayHeight = availableHeight;
          displayWidth = availableHeight * imageAspect;
          offsetX = (availableWidth - displayWidth) / 2;
        } else {
          // Image is taller than area - match width
          displayWidth = availableWidth;
          displayHeight = availableWidth / imageAspect;
          offsetY = (availableHeight - displayHeight) / 2;
        }
      } else {
        if (imageAspect > areaAspect) {
          // Image is wider than area - match height
          displayWidth = availableWidth;
          displayHeight = availableWidth / imageAspect;
          offsetY = (availableHeight - displayHeight) / 2;
        } else {
          // Image is taller than area - match width
          displayHeight = availableHeight;
          displayWidth = availableHeight * imageAspect;
          offsetX = (availableWidth - displayWidth) / 2;
        }
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
    setHasBeenDragged(true); // Mark that frame has been manually positioned
    if (onFrameDrag) {
      onFrameDrag(newPos);
    }
  };

  return (
    <div className="w-full h-full min-h-[60vh] relative">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        style={{ 
          background: wallColor,
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <Layer>
          {/* Background Image */}
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
             scaleX={isDragging ? 0.35 : 0.3}
             scaleY={isDragging ? 0.35 : 0.3}
           >
             {/* Frame rendering (same as KonvaFrameRenderer) */}
             {customization.material === 'classic' ? (
               // Draw 3D beveled classic frame using polygons
               <>
                 {/* Main background */}
                 <Rect
                   x={0}
                   y={0}
                   width={frameSize.width}
                   height={frameSize.height}
                   fill={customization.borderColor ?? '#fff'}
                  //  cornerRadius={6}
                   {...shadow}  
                 />
                 
                 {/* Matting/inner border */}
                 <Rect
                   x={frameBorder}
                   y={frameBorder}
                   width={frameSize.width - 2 * frameBorder}
                   height={frameSize.height - 2 * frameBorder}
                   fill={customization.borderColor ?? '#fff'}
                 />
                 
                 {/* Inner shadow for border thickness illusion */}
                 {/* Top inner shadow */}
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
                 {/* Bottom inner shadow */}
                 <Rect
                   x={frameBorder}
                   y={frameSize.height - frameBorder - 8}
                   width={frameSize.width - 2 * frameBorder}
                   height={8}
                   fillLinearGradientStartPoint={{ x: 0, y: 8 }}
                   fillLinearGradientEndPoint={{ x: 0, y: 0 }}
                   fillLinearGradientColorStops={[0, 'rgba(0,0,0,0.18)', 1, 'rgba(0,0,0,0)']}
                   listening={false}
                 />
                 {/* Left inner shadow */}
                 <Rect
                   x={frameBorder}
                   y={frameBorder}
                   width={8}
                   height={frameSize.height - 2 * frameBorder}
                   fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                   fillLinearGradientEndPoint={{ x: 8, y: 0 }}
                   fillLinearGradientColorStops={[0, 'rgba(0,0,0,0.18)', 1, 'rgba(0,0,0,0)']}
                   listening={false}
                 />
                 {/* Right inner shadow */}
                 <Rect
                   x={frameSize.width - frameBorder - 8}
                   y={frameBorder}
                   width={8}
                   height={frameSize.height - 2 * frameBorder}
                   fillLinearGradientStartPoint={{ x: 8, y: 0 }}
                   fillLinearGradientEndPoint={{ x: 0, y: 0 }}
                   fillLinearGradientColorStops={[0, 'rgba(0,0,0,0.18)', 1, 'rgba(0,0,0,0)']}
                   listening={false}
                 />
                 
                 {/* Top bevel (trapezoid) */}
                 <Line
                   points={[
                     0, 0,
                     frameSize.width, 0,
                     frameSize.width - frameBorder, frameBorder,
                     frameBorder, frameBorder
                   ]}
                   closed
                   fill={bevelTop}
                   listening={false}
                 />
                 {/* Left bevel (trapezoid) */}
                 <Line
                   points={[
                     0, 0,
                     frameBorder, frameBorder,
                     frameBorder, frameSize.height - frameBorder,
                     0, frameSize.height
                   ]}
                   closed
                   fill={bevelLeft}
                   listening={false}
                 />
                 {/* Right bevel (trapezoid) */}
                 <Line
                   points={[
                     frameSize.width, 0,
                     frameSize.width, frameSize.height,
                     frameSize.width - frameBorder, frameSize.height - frameBorder,
                     frameSize.width - frameBorder, frameBorder
                   ]}
                   closed
                   fill={bevelRight}
                   listening={false}
                 />
                 {/* Bottom bevel (trapezoid) */}
                 <Line
                   points={[
                     frameBorder, frameSize.height - frameBorder,
                     frameSize.width - frameBorder, frameSize.height - frameBorder,
                     frameSize.width, frameSize.height,
                     0, frameSize.height
                   ]}
                   closed
                   fill={bevelBottom}
                   listening={false}
                 />
              
                
               </>
             ) : customization.material === 'frameless' || customization.material === 'canvas' ? (
               // Border rectangle illusion for frameless
               <Rect
                 x={0}
                 y={0}
                 width={frameSize.width}
                 height={frameSize.height}
                 fill={customization.borderColor ?? '#fff'}
                 stroke={getFrameBorderColor(customization.frameColor)}
                 strokeWidth={0}
                //  cornerRadius={6}
                 {...shadow}
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
                 {...shadow}
               />
             )}
             
             {/* Matting/inner border - only for non-classic */}
             {customization.material !== 'classic' && (
               <Rect
                 x={frameBorder}
                 y={frameBorder}
                 width={frameSize.width - 2 * frameBorder}
                 height={frameSize.height - 2 * frameBorder}
                 fill={customization.borderColor ?? '#fff'}
                 shadowColor={'#000'}
                 shadowBlur={2}
                 shadowOpacity={0.08}
               />
             )}
             
             {/* Image group (for transform) */}
             <Group
               x={customization.material === 'frameless' 
                 ? customBorderWidth
                 : customization.material === 'canvas'
                   ? frameBorder + customBorderWidth
                   : frameBorder + matting + customBorderWidth
               }
               y={customization.material === 'frameless' 
                 ? customBorderWidth
                 : customization.material === 'canvas'
                   ? frameBorder + customBorderWidth
                   : frameBorder + matting + customBorderWidth
               }
               width={availableWidth}
               height={availableHeight}
               clipFunc={ctx => {
                 ctx.beginPath();
                 ctx.rect(0, 0, availableWidth, availableHeight);
                 ctx.closePath();
               }}
             >
               {/* Image */}
               {frameImg && (
                 <KonvaImage
                   image={frameImg}
                   width={displayWidth}
                   height={displayHeight}
                   x={imageFit === 'fill' ? 0 : offsetX + (transform.x || 0)}
                   y={imageFit === 'fill' ? 0 : offsetY + (transform.y || 0)}
                   scaleX={imageFit === 'fill' ? 1 : transform.scale}
                   scaleY={imageFit === 'fill' ? 1 : transform.scale}
                   rotation={imageFit === 'fill' ? 0 : transform.rotation}
                   filters={[]}
                   style={{ filter: getEffectFilter(customization.effect)}}
                   listening={false}
                   perfectDrawEnabled={false}
                 />
               )}
             </Group>
           </Group>
        </Layer>
      </Stage>
      
      {/* Instructions overlay */}
      <div className="max-w-xs md:mx-0 md:max-w-none absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-2 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></div>
          <span>Click and drag the frame to place it anywhere on the wall</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-2 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></div>
          <span>
            Select your preferred image or color from the <b>Background </b>menu
            in the left panel.
          </span>
        </div>
        </div>
    </div>
  );
};

export default FramePreviewCanvas; 