import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Group, Text } from 'react-konva';
import useImage from 'use-image';
import { FrameCustomization, UploadedImage } from '../../types';

interface KonvaFrameRendererProps {
  customization: FrameCustomization;
  uploadedImage?: UploadedImage | null;
  onImageClick?: () => void;
  frameCount?: number;
  currentFrameIndex?: number;
  isEditable?: boolean;
  onMouseDown?: (e: any) => void;
  onMouseMove?: (e: any) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  showFrameCounter?: boolean;
  showEditOverlay?: boolean;
  addClassicPadding?: boolean;
  width?: number;
  height?: number;
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

const getFrameColor = (color: string) => {
  switch (color) {
    case 'white':
      return '#fff';
    case 'oak':
      return '#fef3c7'; // amber-100
    default:
      return '#111'; // black
  }
};

const getFrameBorderColor = (color: string) => {
  switch (color) {
    case 'white':
      return '#e5e7eb'; // gray-200
    case 'oak':
      return '#fde68a'; // amber-200
    default:
      return '#1f2937'; // gray-800
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

const KonvaFrameRenderer = forwardRef<
  { getCanvasDataURL: () => string | undefined },
  KonvaFrameRendererProps
>(({
  customization,
  uploadedImage,
  onImageClick,
  frameCount = 0,
  currentFrameIndex = 0,
  isEditable = false,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  className = '',
  showFrameCounter = true,
  showEditOverlay = true,
  addClassicPadding = false,
  width = 400,
  height,
}, ref) => {
  // Calculate aspect ratio and canvas size
  const aspect = getAspectRatio(customization.size);
  const canvasWidth = width;
  const canvasHeight = height || width / aspect;

  console.log("EDITNG:",uploadedImage && showEditOverlay && onImageClick && !isEditable)

  const sampleImage = 'https://picsum.photos/id/237/200/300';
  const imageToShow = uploadedImage?.url || sampleImage;
  const [image] = useImage(imageToShow, 'anonymous');

  // Frame style
  let frameBorder = 0;
  let frameColor = getFrameColor(customization.frameColor);
  let frameBorderColor = getFrameBorderColor(customization.frameColor);
  let shadow = {};
  if (customization.material === 'classic') {
    frameBorder = 15;
    shadow = {
      shadowColor: 'black',
      shadowBlur: 12,
      shadowOffset: { x: 2, y: 2 },
      shadowOpacity: 0.6,
    };
  } else if (customization.material === 'frameless') {
    frameBorder = 4;
    shadow = {
      shadowColor: 'black',
      shadowBlur: 8,
      shadowOffset: { x: 1, y: 1 },
      shadowOpacity: 0.3,
    };
  } else if (customization.material === 'canvas') {
    frameBorder = 8;
    shadow = {
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffset: { x: 2, y: 2 },
      shadowOpacity: 0.4,
    };
  }

  // Matting/inner border
  const matting = 10;

  // Image transform
  const transform = uploadedImage?.transform || { scale: 1, rotation: 0, x: 0, y: 0 };

  // Border
  const showCustomBorder = customization.border && customization.borderWidth && customization.borderColor;

  // Mouse events for editing
  const handleGroupMouseDown = (e: any) => {
    if (isEditable && onMouseDown) onMouseDown(e);
  };
  const handleGroupMouseMove = (e: any) => {
    if (isEditable && onMouseMove) onMouseMove(e);
  };
  const handleGroupMouseUp = (e: any) => {
    if (isEditable && onMouseUp) onMouseUp();
  };
  const handleGroupMouseLeave = (e: any) => {
    if (isEditable && onMouseLeave) onMouseLeave();
  };

  // Overlay for edit
  const [hovered, setHovered] = useState(false);

  const stageRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    getCanvasDataURL: () => {
      if (stageRef.current) {
        return stageRef.current.toDataURL({ pixelRatio: 2 });
      }
      return undefined;
    },
  }));

  return (
    <div className={className} style={{ width: canvasWidth, height: canvasHeight }}>
      <Stage ref={stageRef} width={canvasWidth} height={canvasHeight} style={{ borderRadius: 6, background: 'transparent' }}>
        <Layer>
          {/* Frame */}
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill={frameColor}
            stroke={frameBorderColor}
            strokeWidth={frameBorder}
            cornerRadius={6}
            {...shadow}
          />
          {/* Matting/inner border */}
          <Rect
            x={frameBorder}
            y={frameBorder}
            width={canvasWidth - 2 * frameBorder}
            height={canvasHeight - 2 * frameBorder}
            fill={'#fff'}
            cornerRadius={4}
            shadowColor={'#000'}
            shadowBlur={2}
            shadowOpacity={0.08}
          />
          {/* Image group (for transform) */}
          <Group
            x={frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0)}
            y={frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0)}
            width={canvasWidth - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0))}
            height={canvasHeight - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0))}
            clipFunc={ctx => {
              ctx.beginPath();
              ctx.rect(0, 0, canvasWidth - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0)), canvasHeight - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0)));
              ctx.closePath();
            }}
            draggable={isEditable}
            onClick={uploadedImage && onImageClick ? onImageClick : undefined}
            onMouseDown={handleGroupMouseDown}
            onMouseMove={handleGroupMouseMove}
            onMouseUp={handleGroupMouseUp}
            onMouseLeave={handleGroupMouseLeave}
            onMouseEnter={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
          >
            {/* Image */}
            {image && (
              <KonvaImage
                image={image}
                width={canvasWidth - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0))}
                height={canvasHeight - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0))}
                x={transform.x}
                y={transform.y}
                scaleX={transform.scale}
                scaleY={transform.scale}
                rotation={transform.rotation}
                filters={[]}
                // CSS filter fallback for effects (Konva doesn't support all CSS filters)
                // You can use custom shaders for advanced effects if needed
                // For now, we use grayscale/contrast via CSS for preview
                style={{ filter: getEffectFilter(customization.effect) }}
                listening={isEditable}
                perfectDrawEnabled={false}
                draggable={false}
              />
            )}
            {/* Custom Border */}
            {showCustomBorder && (
              <Rect
                x={-customization.borderWidth!}
                y={-customization.borderWidth!}
                width={canvasWidth - 2 * (frameBorder + matting) + 2 * customization.borderWidth!}
                height={canvasHeight - 2 * (frameBorder + matting) + 2 * customization.borderWidth!}
                stroke={customization.borderColor}
                strokeWidth={customization.borderWidth}
                fillEnabled={false}
                listening={false}
              />
            )}
            {/* Edit overlay */}
            {uploadedImage && showEditOverlay && onImageClick && hovered && !isEditable && (
              <Group>
                <Rect
                  x={0}
                  y={0}
                  width={canvasWidth - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0))}
                  height={canvasHeight - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0))}
                  fill={'rgba(0,0,0,0.2)'}
                />
                <Group
                  x={(canvasWidth - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0))) / 2 - 60}
                  y={(canvasHeight - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0))) / 2 - 20}
                >
                  <Rect
                    width={120}
                    height={40}
                    fill={'rgba(255,255,255,0.95)'}
                    cornerRadius={20}
                  />
                  <Text
                    text={'Click to edit'}
                    fontSize={16}
                    fill={'#333'}
                    align={'center'}
                    width={120}
                    height={40}
                    verticalAlign={'middle'}
                    y={10}
                  />
                </Group>
              </Group>
            )}
          </Group>
          {/* Frame counter */}
          {frameCount > 1 && showFrameCounter && (
            <Group x={canvasWidth - 90} y={20}>
              <Rect
                width={70}
                height={28}
                fill={'rgba(255,255,255,0.9)'}
                cornerRadius={14}
                shadowColor={'#000'}
                shadowBlur={4}
                shadowOpacity={0.12}
              />
              <Text
                text={`${currentFrameIndex + 1} of ${frameCount}`}
                fontSize={14}
                fill={'#333'}
                align={'center'}
                width={70}
                height={28}
                verticalAlign={'middle'}
                y={6}
              />
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  );
});

export default KonvaFrameRenderer; 