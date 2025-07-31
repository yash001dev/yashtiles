'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Group } from 'react-konva';
import useImage from 'use-image';
import { FrameCustomization, UploadedImage } from '../types';

interface FramePreviewCanvasProps {
  customization: FrameCustomization;
  uploadedImage?: UploadedImage | null;
  backgroundImage?: string;
  wallColor?: string;
  onFrameDrag?: (pos: { x: number; y: number }) => void;
}

const FramePreviewCanvas: React.FC<FramePreviewCanvasProps> = ({
  customization,
  uploadedImage,
  backgroundImage = "/framedecor1.png",
  wallColor = "#f3f4f6",
  onFrameDrag
}) => {
  const stageRef = useRef<any>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [framePosition, setFramePosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  
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

  // Frame size calculation
  const getFrameSize = () => {
    const [width, height] = customization.size.split('x').map(Number);
    const maxFrameSize = Math.min(stageSize.width, stageSize.height) * 0.3;
    const aspectRatio = width / height;
    
    if (aspectRatio > 1) {
      return {
        width: maxFrameSize,
        height: maxFrameSize / aspectRatio
      };
    } else {
      return {
        width: maxFrameSize * aspectRatio,
        height: maxFrameSize
      };
    }
  };

  const frameSize = getFrameSize();

  // Handle frame drag
  const handleFrameDragStart = () => {
    setIsDragging(true);
  };

  const handleFrameDragEnd = (e: any) => {
    const newPos = e.target.position();
    setFramePosition(newPos);
    setIsDragging(false);
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
            scaleX={isDragging ? 1.05 : 1}
            scaleY={isDragging ? 1.05 : 1}
          >
            {/* Frame Background with proper styling based on material */}
            {customization.material === 'classic' ? (
              // Classic frame with 3D effect
              <>
                <Rect
                  x={0}
                  y={0}
                  width={frameSize.width}
                  height={frameSize.height}
                  fill={customization.borderColor || '#fff'}
                  cornerRadius={6}
                  shadowColor="black"
                  shadowBlur={15}
                  shadowOffset={{ x: 3, y: 3 }}
                  shadowOpacity={0.4}
                />
                {/* 3D bevel effect */}
                <Rect
                  x={8}
                  y={8}
                  width={frameSize.width - 16}
                  height={frameSize.height - 16}
                  fill={customization.borderColor || '#fff'}
                  cornerRadius={4}
                  shadowColor="black"
                  shadowBlur={2}
                  shadowOpacity={0.1}
                />
              </>
            ) : (
              // Other frame types
              <Rect
                x={0}
                y={0}
                width={frameSize.width}
                height={frameSize.height}
                fill={customization.borderColor || '#fff'}
                stroke={customization.frameColor === 'white' ? '#e5e7eb' : '#1f2937'}
                strokeWidth={customization.material === 'frameless' ? 1 : 3}
                cornerRadius={6}
                shadowColor="black"
                shadowBlur={10}
                shadowOffset={{ x: 2, y: 2 }}
                shadowOpacity={0.3}
              />
            )}
            
            {/* Image inside frame */}
            {frameImg && (
              <Group
                x={customization.material === 'classic' ? 16 : 10}
                y={customization.material === 'classic' ? 16 : 10}
                width={frameSize.width - (customization.material === 'classic' ? 32 : 20)}
                height={frameSize.height - (customization.material === 'classic' ? 32 : 20)}
                clipFunc={ctx => {
                  ctx.beginPath();
                  ctx.rect(0, 0, frameSize.width - (customization.material === 'classic' ? 32 : 20), frameSize.height - (customization.material === 'classic' ? 32 : 20));
                  ctx.closePath();
                }}
              >
                <KonvaImage
                  image={frameImg}
                  x={0}
                  y={0}
                  width={frameSize.width - (customization.material === 'classic' ? 32 : 20)}
                  height={frameSize.height - (customization.material === 'classic' ? 32 : 20)}
                  listening={false}
                />
              </Group>
            )}
          </Group>
        </Layer>
      </Stage>
      
      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Drag the frame to position it on the wall</span>
        </div>
      </div>
    </div>
  );
};

export default FramePreviewCanvas; 