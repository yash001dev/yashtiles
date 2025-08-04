import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Group, Text, Line } from 'react-konva';
import useImage from 'use-image';
import { Scaling } from 'lucide-react';
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
  const canvasWidth = responsiveWidth-30;
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
    frameBorder = 0;
    shadow = {
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffset: { x: 2, y: 2 },
      shadowOpacity: 0.4,
    };
  }

  // Matting/inner border
  // const matting = 10; // REMOVE for classic
  const matting = customization.material === 'classic' || customization.material === 'frameless' || customization.material === 'canvas' ? 0 : 10;

  // Image transform
  const transform = uploadedImage?.transform || { scale: 1, rotation: 0, x: 0, y: 0 };

  // Border
  const showCustomBorder = customization.border && customization.borderWidth && customization.borderColor;

  // --- Aspect ratio fit logic ---
  // Calculate available area for image
  const availableWidth = customization.material === 'frameless' || customization.material === 'canvas'
    ? canvasWidth - 2 * (showCustomBorder ? customization.borderWidth! : 0) - 2 * (customization.material === 'canvas' ? frameBorder : 0)
    : canvasWidth - 2 * (frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0));
  const availableHeight = customization.material === 'frameless' || customization.material === 'canvas'
    ? canvasHeight - 2 * (showCustomBorder ? customization.borderWidth! : 0) - 2 * (customization.material === 'canvas' ? frameBorder : 0)
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
  const sideBevelColor=useMemo(()=>{
    if(frameColor === '#fff') {
      return '#4D4D4D'; // light gray for white frame
    }
    else if(frameColor === '#a0522d') {
      return shadeColor(frameColor,-20); // light brown for brown frame
    }
    return '#4D4D4D'; // default gray for other colors
  },[frameColor])

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
  const downloadStageRef = useRef<any>(null); // Separate stage for download

  // Function to generate and store print-ready image
  const generatePrintReadyImage = () => {
    // Use download stage if available, otherwise fall back to main stage
    const targetStage = downloadStageRef.current || stageRef.current;
    if (targetStage && frameId) {
      const dataUrl = targetStage.toDataURL({ pixelRatio: 2 });
      dispatch(setPrintReadyImage({ frameId, dataUrl }));
      return dataUrl;
    }
    return undefined;
  };

  // Auto-generate print-ready image when component updates
  useEffect(() => {
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
      // Use download stage for better quality output
      const targetStage = downloadStageRef.current || stageRef.current;
      if (targetStage) {
        const dataUrl = targetStage.toDataURL({ pixelRatio: 2 });
        // Also store it in Redux if frameId is available
        if (frameId) {
          console.log("frame id:",frameId)
          dispatch(setPrintReadyImage({ frameId, dataUrl }));
        }
        return dataUrl;
      }
      return undefined;
    },
  }));

   const outline = 9;
    const translate = 8;
      console.log("frame color:",frameColor)


  return (
    <div className={className} style={{ width: canvasWidth, height: canvasHeight, display: downloadOnlyImage ? 'none' : undefined, position: 'relative' }}>
      {/* Edit icon in top-right corner */}
      {uploadedImage && showEditOverlay && onImageClick && !downloadOnlyImage && (
        <button
          type="button"
          aria-label="Edit Image"
          className='absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors'
          onClick={onImageClick}
        >
          {/* Simple pencil SVG icon */}
          <Scaling size={18} color="#ec4899" />
        </button>
      )}
      <Stage ref={stageRef} width={canvasWidth+30} height={canvasHeight+30} style={{ borderRadius: 6, background: 'transparent' }}>
        <Layer>
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
                    fill={
                      frameColor
                    }
                    shadowColor='black'
                    shadowBlur={10}
                    shadowOffset={{
                      x:8,
                      y:18
                    }}
                    shadowOpacity={0.3}
                    listening={false}
                    // cornerRadius={6}
                    // {...shadow}
                  />
                  
                  {/* Matting/inner border */}
                  <Rect
                    x={frameBorder}
                    y={frameBorder}
                    width={canvasWidth - 2 * frameBorder}
                    height={canvasHeight - 2 * frameBorder}
                    fill={ frameBorderColor}
                    // cornerRadius={4}
                   
                  />


                  {/* Black inner shadow on all four sides */}
                  {/* Natural inner shadow for layered look (black, soft fade) */}
                  {/* Top edge shadow */}
                

                  {/* Right Face  */}
                  <Line
                    points={[
                      canvasWidth, 0, //Top-Right
                      canvasWidth+outline, translate, //Outer Top-Right
                      canvasWidth+outline, canvasHeight + translate, //Outer Bottom-Right
                      canvasWidth, canvasHeight //Bottom-Right
                    ]}
                    stroke={'#FFF'}
                    strokeWidth={0}

                    lineCap="round"
                    lineJoin="round"
                     fill={sideBevelColor}  
                     closed={true}

                      shadowColor='black'
                     shadowBlur={10}
                     shadowOffset={{
                      x:8,
                      y:8
                     }}
                     shadowOpacity={0.3}
                     listening={false}
                    

                    // perfectDrawEnabled={false}
                    // shadowColor={'black'}
                    // shadowBlur={10}
                    // shadowOffsetX={5}
                    // shadowOffsetY={5}
                  />

                  {/* Bottom Face */}
                  <Line
                    points={[
                      0, canvasHeight, //Bottom-Left
                      canvasWidth, canvasHeight, //Bottom-Right
                      canvasWidth+outline, canvasHeight + translate, //Outer Bottom-Right
                      0+outline-5, canvasHeight + translate //Outer Bottom-Left
                    ]}
                    stroke={'#FFF'}
                    strokeWidth={0}
                    lineCap="round"
                    lineJoin="round"
                    fill={sideBevelColor}  
                    closed={true}
                    perfectDrawEnabled={false}
                    />

                    {/* Bottom-right edge with custom stroke */}
                    <Line
                      points={[
                        canvasWidth, canvasHeight,
                        canvasWidth+outline, canvasHeight + translate
                      ]}
                      stroke={'#FFF'} // Your custom color
                      strokeWidth={0.2}
                      lineCap="round"
                      perfectDrawEnabled={false}
                    />

                </>
              ) : customization.material === 'frameless' ? (
                // Border rectangle illusion for frameless
                <>
                  {/* Main background */}
                  <Rect
                    x={0}
                    y={0}
                    width={canvasWidth}
                    height={canvasHeight}
                    fill={frameColor}
                    shadowColor='black'
                    shadowBlur={10}
                    shadowOffset={{
                      x:8,
                      y:18
                    }}
                    shadowOpacity={0.3}
                    listening={false}
                    // cornerRadius={6}
                    // {...shadow}
                  />
                  
                  {/* Matting/inner border */}
                  <Rect
                    x={frameBorder}
                    y={frameBorder}
                    width={canvasWidth - 2 * frameBorder}
                    height={canvasHeight - 2 * frameBorder}
                    fill={ frameBorderColor}
                    // cornerRadius={4}
                   
                  />


                  {/* Black inner shadow on all four sides */}
                  {/* Natural inner shadow for layered look (black, soft fade) */}
                  {/* Top edge shadow */}
                

                  {/* Right Face  */}
                  <Line
                    points={[
                      canvasWidth, 0, //Top-Right
                      canvasWidth+outline, translate, //Outer Top-Right
                      canvasWidth+outline, canvasHeight + translate, //Outer Bottom-Right
                      canvasWidth, canvasHeight //Bottom-Right
                    ]}
                    stroke={'#FFF'}
                    strokeWidth={0}

                    lineCap="round"
                    lineJoin="round"
                     fill={sideBevelColor}   
                     closed={true}

                      shadowColor='black'
                     shadowBlur={10}
                     shadowOffset={{
                      x:8,
                      y:8
                     }}
                     shadowOpacity={0.3}
                     listening={false}
                    

                    // perfectDrawEnabled={false}
                    // shadowColor={'black'}
                    // shadowBlur={10}
                    // shadowOffsetX={5}
                    // shadowOffsetY={5}
                  />

                  {/* Bottom Face */}
                  <Line
                    points={[
                      0, canvasHeight, //Bottom-Left
                      canvasWidth, canvasHeight, //Bottom-Right
                      canvasWidth+outline, canvasHeight + translate, //Outer Bottom-Right
                      0+outline-5, canvasHeight + translate //Outer Bottom-Left
                    ]}
                    stroke={'#FFF'}
                    strokeWidth={0}
                    lineCap="round"
                    lineJoin="round"
                    fill={sideBevelColor}  
                    closed={true}
                    perfectDrawEnabled={false}
                    />

                    {/* Bottom-right edge with custom stroke */}
                    <Line
                      points={[
                        canvasWidth, canvasHeight,
                        canvasWidth+outline, canvasHeight + translate
                      ]}
                      stroke={'#FFF'} // Your custom color
                      strokeWidth={0.2}
                      lineCap="round"
                      perfectDrawEnabled={false}
                    />

                </>
              ) : (
                // Other frame types
                <>
                  {/* Main background */}
                  <Rect
                    x={0}
                    y={0}
                    width={canvasWidth}
                    height={canvasHeight}
                     fill={
                      frameColor
                    }
                    shadowColor='black'
                    shadowBlur={10}
                    shadowOffset={{
                      x:8,
                      y:18
                    }}
                    shadowOpacity={0.3}
                    listening={false}
                    // cornerRadius={6}
                    // {...shadow}
                  />
                  
                  {/* Matting/inner border */}
                  <Rect
                    x={frameBorder}
                    y={frameBorder}
                    width={canvasWidth - 2 * frameBorder}
                    height={canvasHeight - 2 * frameBorder}
                    fill={frameBorderColor}
                    // cornerRadius={4}
                   
                  />


                  {/* Black inner shadow on all four sides */}
                  {/* Natural inner shadow for layered look (black, soft fade) */}
                  {/* Top edge shadow */}
                

                  {/* Right Face  */}
                  <Line
                    points={[
                      canvasWidth, 0, //Top-Right
                      canvasWidth+outline, translate, //Outer Top-Right
                      canvasWidth+outline, canvasHeight + translate, //Outer Bottom-Right
                      canvasWidth, canvasHeight //Bottom-Right
                    ]}
                    stroke={'#FFF'}
                    strokeWidth={0}

                    lineCap="round"
                    lineJoin="round"
                     fill={sideBevelColor}   
                     closed={true}

                      shadowColor='black'
                     shadowBlur={10}
                     shadowOffset={{
                      x:8,
                      y:8
                     }}
                     shadowOpacity={0.3}
                     listening={false}
                    

                    // perfectDrawEnabled={false}
                    // shadowColor={'black'}
                    // shadowBlur={10}
                    // shadowOffsetX={5}
                    // shadowOffsetY={5}
                  />

                  {/* Bottom Face */}
                  <Line
                    points={[
                      0, canvasHeight, //Bottom-Left
                      canvasWidth, canvasHeight, //Bottom-Right
                      canvasWidth+outline, canvasHeight + translate, //Outer Bottom-Right
                      0+outline-5, canvasHeight + translate //Outer Bottom-Left
                    ]}
                    stroke={'#FFF'}
                    strokeWidth={0}
                    lineCap="round"
                    lineJoin="round"
                    fill={sideBevelColor}  
                    closed={true}
                    perfectDrawEnabled={false}
                    />

                    {/* Bottom-right edge with custom stroke */}
                    <Line
                      points={[
                        canvasWidth, canvasHeight,
                        canvasWidth+outline, canvasHeight + translate
                      ]}
                      stroke={'#FFF'} // Your custom color
                      strokeWidth={0.2}
                      lineCap="round"
                      perfectDrawEnabled={false}
                    />

                </>
              )}
              {/* Matting/inner border - only for non-classic */}
              {/* {customization.material !== 'classic' && (
                <Rect
                  x={frameBorder}
                  y={frameBorder}
                  width={canvasWidth - 2 * frameBorder}
                  height={canvasHeight - 2 * frameBorder}
                  fill={customization.borderColor ?? '#fff'}
                  cornerRadius={4}
                  shadowColor={'#e42a2a'}
                  shadowBlur={2}
                  shadowOpacity={0.08}
                />  
              )} */}
              {/* Image group (for transform) */}
              <Group
                x={customization.material === 'frameless' 
                  ? (showCustomBorder ? customization.borderWidth! : 0) 
                  : customization.material === 'canvas'
                    ? frameBorder + (showCustomBorder ? customization.borderWidth! : 0)
                    : frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0)
                }
                y={customization.material === 'frameless' 
                  ? (showCustomBorder ? customization.borderWidth! : 0) 
                  : customization.material === 'canvas'
                    ? frameBorder + (showCustomBorder ? customization.borderWidth! : 0)
                    : frameBorder + matting + (showCustomBorder ? customization.borderWidth! : 0)
                }
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
                    //Add shadow
                   

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
        </Layer>
      </Stage>
      
      {/* Separate hidden stage for download purposes - renders clean image with minimal white space */}
      <Stage 
        ref={downloadStageRef} 
        width={canvasWidth} 
        height={canvasHeight} 
        style={{ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden' }}
      >
        <Layer>
          {image && (
            <>
              {/* Minimal background - only small border */}
              <Rect
                x={0}
                y={0}
                width={canvasWidth}
                height={canvasHeight}
                fill={customization.borderColor ?? '#fff'}
                cornerRadius={6}
              />
              
              {/* Image positioned with minimal padding - recalculated for tight crop */}
              {(() => {
                // Calculate even tighter dimensions for download - minimal padding
                const downloadPadding = customization.material === 'classic' ? 4 : 2; // Reduced from 8:4 to 4:2
                const downloadAvailableWidth = canvasWidth - (2 * downloadPadding);
                const downloadAvailableHeight = canvasHeight - (2 * downloadPadding);
                
                // Recalculate image size to fill more of the available space
                let downloadDisplayWidth = downloadAvailableWidth;
                let downloadDisplayHeight = downloadAvailableHeight;
                let downloadOffsetX = 0;
                let downloadOffsetY = 0;
                
                if (customization.material === 'frameless' || customization.material === 'canvas') {
                  // Use "cover" approach - fill the entire available space
                  const downloadAreaAspect = downloadAvailableWidth / downloadAvailableHeight;
                  if (imageAspect > downloadAreaAspect) {
                    downloadDisplayHeight = downloadAvailableHeight;
                    downloadDisplayWidth = downloadAvailableHeight * imageAspect;
                    downloadOffsetX = (downloadAvailableWidth - downloadDisplayWidth) / 2;
                  } else {
                    downloadDisplayWidth = downloadAvailableWidth;
                    downloadDisplayHeight = downloadAvailableWidth / imageAspect;
                    downloadOffsetY = (downloadAvailableHeight - downloadDisplayHeight) / 2;
                  }
                } else {
                  // Use "fit" approach for classic frames but with tighter bounds
                  const downloadAreaAspect = downloadAvailableWidth / downloadAvailableHeight;
                  if (imageAspect > downloadAreaAspect) {
                    downloadDisplayWidth = downloadAvailableWidth;
                    downloadDisplayHeight = downloadAvailableWidth / imageAspect;
                    downloadOffsetY = (downloadAvailableHeight - downloadDisplayHeight) / 2;
                  } else {
                    downloadDisplayHeight = downloadAvailableHeight;
                    downloadDisplayWidth = downloadAvailableHeight * imageAspect;
                    downloadOffsetX = (downloadAvailableWidth - downloadDisplayWidth) / 2;
                  }
                }
                
                return (
                  <Group
                    x={downloadPadding}
                    y={downloadPadding}
                    width={downloadAvailableWidth}
                    height={downloadAvailableHeight}
                    clipFunc={ctx => {
                      ctx.beginPath();
                      ctx.rect(0, 0, downloadAvailableWidth, downloadAvailableHeight);
                      ctx.closePath();
                    }}
                  >
                    <KonvaImage
                      image={image}
                      width={downloadDisplayWidth}
                      height={downloadDisplayHeight}
                      x={downloadOffsetX + (transform.x || 0)}
                      y={downloadOffsetY + (transform.y || 0)}
                      scaleX={transform.scale}
                      scaleY={transform.scale}
                      rotation={transform.rotation}
                      filters={[]}
                      style={{ filter: getEffectFilter(customization.effect) }}
                      listening={false}
                      perfectDrawEnabled={false}
                    />
                  </Group>
                );
              })()}
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
});

export default KonvaFrameRenderer; 