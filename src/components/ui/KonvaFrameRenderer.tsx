import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Group, Text, Line } from 'react-konva';
import useImage from 'use-image';
import { Edit } from 'lucide-react';
import { FrameCustomization, UploadedImage } from '../../types';
import { useAppDispatch } from '../../redux/hooks';
import { setPrintReadyImage } from '../../redux/slices/frameCustomizerSlice';

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
  frameId?: string; // ID of the frame for storing print-ready image
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
    // case 'oak':
    //   return '#fef3c7'; // amber-100
    case 'brown':
      return '#a0522d'; // brown
    default:
      return '#111'; // black
  }
};

const getFrameBorderColor = (color: string) => {
  switch (color) {
    case 'white':
      return '#e5e7eb'; // gray-200
    // case 'oak':
    //   return '#fde68a'; // amber-200
    case 'brown':
      return '#8b5c2d'; // darker brown
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

// Utility to lighten or darken a hex color
function shadeColor(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  // Parse r, g, b
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  // Adjust each channel
  r = Math.min(255, Math.max(0, Math.round(r + (percent / 100) * 255)));
  g = Math.min(255, Math.max(0, Math.round(g + (percent / 100) * 255)));
  b = Math.min(255, Math.max(0, Math.round(b + (percent / 100) * 255)));
  // Return as hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

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
  frameId,
}, ref) => {
  const dispatch = useAppDispatch();

  // Responsive width logic
  const [responsiveWidth, setResponsiveWidth] = useState<number>(typeof window !== 'undefined' ? Math.min(400, window.innerWidth - 32) : 400);

  useEffect(() => {
    const handleResize = () => {
      setResponsiveWidth(Math.min(400, window.innerWidth - 32));
    };
    window.addEventListener('resize', handleResize);
    // Set initial width
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate aspect ratio and canvas size
  const aspect = getAspectRatio(customization.size);
  const canvasWidth = responsiveWidth;
  const canvasHeight = height || responsiveWidth / aspect;


  const sampleImage = 'https://picsum.photos/id/237/200/300';
  const imageToShow = uploadedImage?.url || sampleImage;
  const [image] = useImage(imageToShow, 'anonymous');

  // Frame style
  let frameBorder = 0;
  let frameColor = getFrameColor(customization.frameColor);
  let frameBorderColor = getFrameBorderColor(customization.frameColor);
  // Compute bevel colors based on frameBorderColor
  const bevelTop = shadeColor(frameBorderColor, 30);    // lighter
  const bevelLeft = shadeColor(frameBorderColor, -30);   // darker
  const bevelRight = shadeColor(frameBorderColor, -15);  // slightly dark
  const bevelBottom = shadeColor(frameBorderColor, 30); // darkest
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
    frameBorder = 0; // No traditional frame border
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
  const matting = customization.material === 'classic' || customization.material === 'frameless' ? 0 : 10;

  // Image transform
  const transform = uploadedImage?.transform || { scale: 1, rotation: 0, x: 0, y: 0 };

  // Border
  const showCustomBorder = customization.border && customization.borderWidth && customization.borderColor;

  // --- Aspect ratio fit logic ---
  // Calculate available area for image
  const availableWidth = customization.material === 'frameless'
    ? canvasWidth - 2 * (showCustomBorder ? customization.borderWidth! : 0)
    : canvasWidth - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0));
  const availableHeight = customization.material === 'frameless'
    ? canvasHeight - 2 * (showCustomBorder ? customization.borderWidth! : 0)
    : canvasHeight - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0));

  // Get natural image size
  const naturalWidth = image?.width || 1;
  const naturalHeight = image?.height || 1;
  const imageAspect = naturalWidth / naturalHeight;
  const areaAspect = availableWidth / availableHeight;

  let displayWidth = availableWidth;
  let displayHeight = availableHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (image) {
    if (customization.material === 'frameless' || customization.material === 'canvas') {
      // For frameless and canvas, use "cover" approach to fill the entire frame
      if (imageAspect > areaAspect) {
        // Image is wider than area - scale to cover height
        displayHeight = availableHeight;
        displayWidth = availableHeight * imageAspect;
        offsetX = (availableWidth - displayWidth) / 2;
      } else {
        // Image is taller than area - scale to cover width
        displayWidth = availableWidth;
        displayHeight = availableWidth / imageAspect;
        offsetY = (availableHeight - displayHeight) / 2;
      }
    } else {
      // For classic frames, use "fit" approach to maintain aspect ratio
      if (imageAspect > areaAspect) {
        // Image is wider than area
        displayWidth = availableWidth;
        displayHeight = availableWidth / imageAspect;
        offsetY = (availableHeight - displayHeight) / 2;
      } else {
        // Image is taller than area
        displayHeight = availableHeight;
        displayWidth = availableHeight * imageAspect;
        offsetX = (availableWidth - displayWidth) / 2;
      }
    }
  }

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

  // Function to generate and store print-ready image
  const generatePrintReadyImage = () => {
    if (stageRef.current && frameId) {
      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
      dispatch(setPrintReadyImage({ frameId, dataUrl }));
      return dataUrl;
    }
    return undefined;
  };

  // Auto-generate print-ready image when component updates
  useEffect(() => {
     console.log('Frme id:',frameId)
    if (frameId && uploadedImage && image) {
      // Small delay to ensure canvas is fully rendered
      const timer = setTimeout(() => {
        generatePrintReadyImage();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [frameId, uploadedImage, customization, image]);

  useImperativeHandle(ref, () => ({
    getCanvasDataURL: () => {
      if (stageRef.current) {
        const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
        // Also store it in Redux if frameId is available
        if (frameId) {
          dispatch(setPrintReadyImage({ frameId, dataUrl }));
        }
        return dataUrl;
      }
      return undefined;
    },
  }));

  return (
    <div className={className} style={{ width: canvasWidth, height: canvasHeight, display: downloadOnlyImage ? 'none' : undefined, position: 'relative' }}>
      {/* Edit icon in top-right corner */}
      {uploadedImage && showEditOverlay && onImageClick && !downloadOnlyImage && (
        <button
          type="button"
          aria-label="Edit Image"
          onClick={onImageClick}
          style={{
            position: 'absolute',
            top: 8,
            right: 20,
            zIndex: 10,
            background: 'rgba(255,255,255,0.85)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {/* Simple pencil SVG icon */}
          <Edit size={18} color="#374151" />
        </button>
      )}
      <Stage ref={stageRef} width={canvasWidth} height={canvasHeight} style={{ borderRadius: 6, background: 'transparent' }}>
        <Layer>
          {/* Only render the image if downloadOnlyImage is true */}
          {downloadOnlyImage ? (
            image && (
              <>
                {customization.material === 'frameless' ? (
                  // Border rectangle illusion for frameless download
                  <Rect
                    x={0}
                    y={0}
                    width={canvasWidth}
                    height={canvasHeight}
                    fill={customization.borderColor ?? '#fff'}
                    stroke={getFrameBorderColor(customization.frameColor)}
                    strokeWidth={showCustomBorder ? customization.borderWidth! : 2}
                    cornerRadius={6}
                  />
                ) : (
                  // Regular border background for other materials
                  <Rect
                    x={0}
                    y={0}
                    width={canvasWidth}
                    height={canvasHeight}
                    fill={customization.borderColor ?? '#fff'}
                    cornerRadius={6}
                  />
                )}
                {/* Image group with same positioning as regular view */}
                <Group
                  x={customization.material === 'frameless' ? (showCustomBorder ? customization.borderWidth! : 0) : frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0)}
                  y={customization.material === 'frameless' ? (showCustomBorder ? customization.borderWidth! : 0) : frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0)}
                  width={availableWidth}
                  height={availableHeight}
                  clipFunc={ctx => {
                    ctx.beginPath();
                    if (customization.material === 'frameless') {
                      ctx.rect(0, 0, availableWidth, availableHeight);
                    } else {
                      ctx.rect(0, 0, availableWidth, availableHeight);
                    }
                    ctx.closePath();
                  }}
                  listening={false}
                >
                  <KonvaImage
                    image={image}
                    width={displayWidth}
                    height={displayHeight}
                    x={offsetX + (transform.x || 0)}
                    y={offsetY + (transform.y || 0)}
                    scaleX={transform.scale}
                    scaleY={transform.scale}
                    rotation={transform.rotation}
                    filters={[]}
                    style={{ filter: getEffectFilter(customization.effect) }}
                    listening={false}
                    perfectDrawEnabled={false}
                    draggable={false}
                  />
                </Group>
              </>
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
                    fill={customization.borderColor ?? '#fff'}
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
                    fill={bevelTop}
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
                    fill={bevelLeft}
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
                    fill={bevelRight}
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
                    fill={bevelBottom}
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
                    fill={bevelLeft}
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
                    fill={bevelRight}
                    listening={false}
                  />
                </>
              ) : customization.material === 'frameless' ? (
                // Border rectangle illusion for frameless
                <Rect
                  x={0}
                  y={0}
                  width={canvasWidth}
                  height={canvasHeight}
                  fill={customization.borderColor ?? '#fff'}
                  stroke={getFrameBorderColor(customization.frameColor)}
                  strokeWidth={showCustomBorder ? customization.borderWidth! : 2}
                  cornerRadius={6}
                  {...shadow}
                />
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
                  fill={customization.borderColor ?? '#fff'}
                  cornerRadius={4}
                  shadowColor={'#000'}
                  shadowBlur={2}
                  shadowOpacity={0.08}
                />
              )}
              {/* Image group (for transform) */}
              <Group
                x={customization.material === 'frameless' ? (showCustomBorder ? customization.borderWidth! : 0) : frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0)}
                y={customization.material === 'frameless' ? (showCustomBorder ? customization.borderWidth! : 0) : frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0)}
                width={availableWidth}
                height={availableHeight}
                clipFunc={ctx => {
                  ctx.beginPath();
                  if (customization.material === 'frameless') {
                    ctx.rect(0, 0, availableWidth, availableHeight);
                  } else {
                    ctx.rect(0, 0, availableWidth, availableHeight);
                  }
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
                    width={displayWidth}
                    height={displayHeight}
                    x={offsetX + (transform.x || 0)}
                    y={offsetY + (transform.y || 0)}
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
                {/* {showCustomBorder && (
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
                )} */}
               
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