import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Group, Text, Line } from 'react-konva';
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
  downloadOnlyImage?: boolean;
  onImageDrag?: (pos: { x: number; y: number }) => void;
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
  downloadOnlyImage = false, // NEW PROP
  onImageDrag,
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
  // Classic frame border colors
  const classicTopBottom = '#333';
  const classicLeftRight = '#000';
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
  // const matting = 10; // REMOVE for classic
  const matting = customization.material === 'classic' ? 0 : 10;

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

  // Drag logic for image
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const handleImageDragStart = (e: any) => {
    if (!isEditable) return;
    setDragging(true);
    setDragStart({
      x: e.target.x() - (uploadedImage?.transform.x || 0),
      y: e.target.y() - (uploadedImage?.transform.y || 0),
    });
  };
  const handleImageDragMove = (e: any) => {
    if (!isEditable || !dragging || !onImageDrag) return;
    const newX = e.target.x();
    const newY = e.target.y();
    onImageDrag({ x: newX, y: newY });
  };
  const handleImageDragEnd = (e: any) => {
    setDragging(false);
    setDragStart(null);
    if (isEditable && onMouseUp) onMouseUp();
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
    <div className={className} style={{ width: canvasWidth, height: canvasHeight, display: downloadOnlyImage ? 'none' : undefined }}>
      <Stage ref={stageRef} width={canvasWidth} height={canvasHeight} style={{ borderRadius: 6, background: 'transparent' }}>
        <Layer>
          {/* Only render the image if downloadOnlyImage is true */}
          {downloadOnlyImage ? (
            image && (
              <KonvaImage
                image={image}
                width={canvasWidth}
                height={canvasHeight}
                x={transform.x}
                y={transform.y}
                scaleX={transform.scale}
                scaleY={transform.scale}
                rotation={transform.rotation}
                filters={[]}
                style={{ filter: getEffectFilter(customization.effect) }}
                listening={false}
                perfectDrawEnabled={false}
                draggable={false}
              />
            )
          ) : (
            <>
              {/* Frame */}
              {customization.material === 'classic' ? (
                // Draw 3D beveled classic frame using polygons
                <>
                  {/* Main background */}
                  <Rect
                    x={0}
                    y={0}
                    width={canvasWidth}
                    height={canvasHeight}
                    fill={'#fff'}
                    cornerRadius={6}
                    {...shadow}
                  />
                  {/* Top bevel (trapezoid) */}
                  <Line
                    points={[
                      0, 0,
                      canvasWidth, 0,
                      canvasWidth - frameBorder, frameBorder,
                      frameBorder, frameBorder
                    ]}
                    closed
                    fill={'#444'} // slightly lighter than left/right
                    listening={false}
                  />
                  {/* Left bevel (trapezoid) */}
                  <Line
                    points={[
                      0, 0,
                      frameBorder, frameBorder,
                      frameBorder, canvasHeight - frameBorder,
                      0, canvasHeight
                    ]}
                    closed
                    fill={'#111'} // darkest for left
                    listening={false}
                  />
                  {/* Right bevel (trapezoid) */}
                  <Line
                    points={[
                      canvasWidth, 0,
                      canvasWidth, canvasHeight,
                      canvasWidth - frameBorder, canvasHeight - frameBorder,
                      canvasWidth - frameBorder, frameBorder
                    ]}
                    closed
                    fill={'#111'} // mid-tone for right
                    listening={false}
                  />
                  {/* Bottom bevel (trapezoid) */}
                  <Line
                    points={[
                      frameBorder, canvasHeight - frameBorder,
                      canvasWidth - frameBorder, canvasHeight - frameBorder,
                      canvasWidth, canvasHeight,
                      0, canvasHeight
                    ]}
                    closed
                    fill={'#222'} // similar to right bevel
                    listening={false}
                  />
                  {/* Bottom left triangle */}
                  <Line
                    points={[
                      0, canvasHeight,
                      frameBorder, canvasHeight - frameBorder,
                      0, canvasHeight - frameBorder
                    ]}
                    closed
                    fill={'#111'}
                    listening={false}
                  />
                  {/* Bottom right triangle */}
                  <Line
                    points={[
                      canvasWidth, canvasHeight,
                      canvasWidth, canvasHeight - frameBorder,
                      canvasWidth - frameBorder, canvasHeight - frameBorder
                    ]}
                    closed
                    fill={'#111'}
                    listening={false}
                  />
                </>
              ) : (
                // Other frame types
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
              )}
              {/* Matting/inner border - only for non-classic */}
              {customization.material !== 'classic' && (
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
              )}
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
                    style={{ filter: getEffectFilter(customization.effect) }}
                    listening={isEditable}
                    perfectDrawEnabled={false}
                    draggable={isEditable}
                    onDragStart={handleImageDragStart}
                    onDragMove={handleImageDragMove}
                    onDragEnd={handleImageDragEnd}
                  />
                )}
                {/* Custom Border (now inside image group, overlays image) */}
                {showCustomBorder && (
                  <Rect
                    x={0}
                    y={0}
                    width={canvasWidth - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0))}
                    height={canvasHeight - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0))}
                    stroke={customization.borderColor}
                    strokeWidth={customization.borderWidth}
                    fillEnabled={false}
                    listening={false}
                    cornerRadius={6}
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
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
});

export default KonvaFrameRenderer; 