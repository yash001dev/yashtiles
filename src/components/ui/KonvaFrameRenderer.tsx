'use client';
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Text, Group } from 'react-konva';
import { FrameCustomization, UploadedImage } from '../../types';
import Konva from 'konva';

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

export interface KonvaFrameRendererRef {
  downloadImage: () => void;
  getImageDataUrl: () => Promise<string | null>;
}

const KonvaFrameRenderer = forwardRef<KonvaFrameRendererRef, KonvaFrameRendererProps>(({
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
  height = 400,
}, ref) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [stageSize, setStageSize] = useState({ width, height });
  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);
  
  const sampleImage = "https://picsum.photos/id/237/200/300";
  const imageToShow = uploadedImage?.url || sampleImage;

  // Load image
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImage(img);
    };
    img.src = imageToShow;
  }, [imageToShow]);

  // Update stage size
  useEffect(() => {
    setStageSize({ width, height });
  }, [width, height]);

  // Calculate frame dimensions first
  const frameWidth = customization.material === 'frameless' ? 0 : 20;
  const mattingWidth = customization.material === 'classic' ? 15 : 0; // Only classic has matting
  const totalPadding = frameWidth + mattingWidth;

  // Simple dimensions based on original working logic
  const getImageDimensions = () => {
    const [widthStr, heightStr] = customization.size.split('x');
    const widthRatio = parseInt(widthStr);
    const heightRatio = parseInt(heightStr);
    const frameAspectRatio = widthRatio / heightRatio;
    
    // Use the same simple approach as the original FrameRenderer
    // Calculate dimensions that fit within the stage while maintaining aspect ratio
    const availableWidth = width - (totalPadding * 2);
    const availableHeight = height - (totalPadding * 2);
    
    let imgWidth, imgHeight;
    
    // Fit the frame aspect ratio within available space
    if (frameAspectRatio > (availableWidth / availableHeight)) {
      // Frame is wider - fit by width
      imgWidth = availableWidth;
      imgHeight = imgWidth / frameAspectRatio;
    } else {
      // Frame is taller - fit by height
      imgHeight = availableHeight;
      imgWidth = imgHeight * frameAspectRatio;
    }
    
    return { 
      width: imgWidth, 
      height: imgHeight,
      canvasWidth: imgWidth,
      canvasHeight: imgHeight
    };
  };

  const { width: imgWidth, height: imgHeight, canvasWidth, canvasHeight } = getImageDimensions();

  // Handle image transform
  const getImageTransform = () => {
    if (uploadedImage) {
      return {
        x: uploadedImage.transform.x,
        y: uploadedImage.transform.y,
        scaleX: uploadedImage.transform.scale,
        scaleY: uploadedImage.transform.scale,
        rotation: uploadedImage.transform.rotation,
      };
    }
    return { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 };
  };

  // Get frame colors
  const getFrameColor = () => {
    switch (customization.frameColor) {
      case 'white':
        return '#ffffff';
      case 'oak':
        return '#f3e8d0';
      default:
        return '#1f2937';
    }
  };

  // Get image filters
  const getImageFilters = () => {
    const filters = [];
    switch (customization.effect) {
      case 'silver':
        filters.push(Konva.Filters.Grayscale);
        filters.push(Konva.Filters.Contrast);
        break;
      case 'noir':
        filters.push(Konva.Filters.Grayscale);
        filters.push(Konva.Filters.Contrast);
        break;
      case 'vivid':
        filters.push(Konva.Filters.HSV);
        break;
      case 'dramatic':
        filters.push(Konva.Filters.Contrast);
        break;
      default:
        break;
    }
    return filters;
  };

  // Apply filter values
  const applyFilterValues = (imageNode: Konva.Image) => {
    switch (customization.effect) {
      case 'silver':
        imageNode.contrast(0.1);
        break;
      case 'noir':
        imageNode.contrast(0.5);
        break;
      case 'vivid':
        imageNode.saturation(0.5);
        break;
      case 'dramatic':
        imageNode.contrast(0.4);
        break;
    }
  };

  // Expose download method through ref
  useImperativeHandle(ref, () => ({
    downloadImage: async () => {
      const dataUrl = await getImageDataUrl();
      if (dataUrl) {
        // Create download link
        const link = document.createElement('a');
        link.download = `frame-${customization.size}-${customization.material}-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    getImageDataUrl: () => getImageDataUrl(),
  }));
  
  const getImageDataUrl = async (): Promise<string | null> => {
    if (!stageRef.current || !uploadedImage) return null;
    
    // Create a clone of the stage to avoid affecting the display
    const stage = stageRef.current;
    
    // Wait for the next tick to ensure all filters and customizations are applied
    return new Promise((resolve) => {
      // Use requestAnimationFrame to ensure the stage is fully rendered
      requestAnimationFrame(() => {
        // Get the pixel ratio for high DPI devices
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Create a clone of the stage to avoid affecting the display
        const dataUrl = stage.toDataURL({
          mimeType: 'image/png',
          quality: 1,
          pixelRatio: 2, // Higher quality
          x: 0,
          y: 0,
          width: stage.width(),
          height: stage.height(),
        });
        
        resolve(dataUrl);
      });
    });
  };

  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className="relative">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          className="shadow-2xl"
          style={{ backgroundColor: 'transparent' }}
        >
          <Layer>
            {/* White background for the canvas area */}
            <Rect
              x={(stageSize.width - (canvasWidth || imgWidth)) / 2}
              y={(stageSize.height - (canvasHeight || imgHeight)) / 2}
              width={canvasWidth || imgWidth}
              height={canvasHeight || imgHeight}
              fill="white"
            />
            
            {/* Outer Frame - only for framed materials */}
            {customization.material !== 'frameless' && customization.material !== 'canvas' && (
              <Rect
                x={(stageSize.width - (canvasWidth || imgWidth) - totalPadding * 2) / 2}
                y={(stageSize.height - (canvasHeight || imgHeight) - totalPadding * 2) / 2}
                width={(canvasWidth || imgWidth) + totalPadding * 2}
                height={(canvasHeight || imgHeight) + totalPadding * 2}
                fill={getFrameColor()}
                shadowColor="black"
                shadowBlur={10}
                shadowOffset={{ x: 2, y: 2 }}
                shadowOpacity={0.3}
              />
            )}

            {/* White Matting - only for classic material */}
            {customization.material === 'classic' && (
              <Rect
                x={(stageSize.width - imgWidth - mattingWidth * 2) / 2}
                y={(stageSize.height - imgHeight - mattingWidth * 2) / 2}
                width={imgWidth + mattingWidth * 2}
                height={imgHeight + mattingWidth * 2}
                fill="white"
                shadowColor="black"
                shadowBlur={5}
                shadowOffset={{ x: 1, y: 1 }}
                shadowOpacity={0.1}
              />
            )}

            {/* Image */}
            {image && (
              <Group
                clipX={(stageSize.width - (canvasWidth || imgWidth)) / 2}
                clipY={(stageSize.height - (canvasHeight || imgHeight)) / 2}
                clipWidth={canvasWidth || imgWidth}
                clipHeight={canvasHeight || imgHeight}
              >
                <KonvaImage
                  ref={imageRef}
                  image={image}
                  x={(stageSize.width - (canvasWidth || imgWidth)) / 2 + (uploadedImage?.transform.x || 0)}
                  y={(stageSize.height - (canvasHeight || imgHeight)) / 2 + (uploadedImage?.transform.y || 0)}
                  width={canvasWidth || imgWidth}
                  height={canvasHeight || imgHeight}
                  scaleX={uploadedImage?.transform.scale || 1}
                  scaleY={uploadedImage?.transform.scale || 1}
                  rotation={uploadedImage?.transform.rotation || 0}
                  filters={getImageFilters()}
                  draggable={isEditable}
                  onClick={onImageClick}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseLeave}
                  onTransform={() => {
                    if (imageRef.current) {
                      applyFilterValues(imageRef.current);
                    }
                  }}
                />
              </Group>
            )}

            {/* Custom Border */}
            {customization.border && (
              <Rect
                x={(stageSize.width - imgWidth) / 2}
                y={(stageSize.height - imgHeight) / 2}
                width={imgWidth}
                height={imgHeight}
                stroke={customization.borderColor}
                strokeWidth={customization.borderWidth}
                fill="transparent"
              />
            )}

            {/* Frame Counter */}
            {frameCount > 1 && showFrameCounter && (
              <Group>
                <Rect
                  x={stageSize.width - 80}
                  y={20}
                  width={60}
                  height={25}
                  fill="rgba(255, 255, 255, 0.9)"
                  cornerRadius={12}
                  shadowColor="black"
                  shadowBlur={3}
                  shadowOpacity={0.2}
                />
                <Text
                  x={stageSize.width - 80}
                  y={27}
                  width={60}
                  height={25}
                  text={`${currentFrameIndex + 1} of ${frameCount}`}
                  fontSize={10}
                  fontFamily="Arial"
                  fill="#374151"
                  align="center"
                  verticalAlign="middle"
                />
              </Group>
            )}

            {/* Edit Overlay */}
            {uploadedImage && showEditOverlay && onImageClick && (
              <Group
                opacity={0}
                onMouseEnter={(e) => {
                  const parent = e.target.getParent();
                  if (parent) {
                    parent.opacity(1);
                  }
                }}
                onMouseLeave={(e) => {
                  const parent = e.target.getParent();
                  if (parent) {
                    parent.opacity(0);
                  }
                }}
                onClick={onImageClick}
              >
                <Rect
                  x={(stageSize.width - imgWidth) / 2}
                  y={(stageSize.height - imgHeight) / 2}
                  width={imgWidth}
                  height={imgHeight}
                  fill="rgba(0, 0, 0, 0.2)"
                />
                <Rect
                  x={(stageSize.width - 100) / 2}
                  y={(stageSize.height - 30) / 2}
                  width={100}
                  height={30}
                  fill="rgba(255, 255, 255, 0.95)"
                  cornerRadius={15}
                />
                <Text
                  x={(stageSize.width - 100) / 2}
                  y={(stageSize.height - 30) / 2}
                  width={100}
                  height={30}
                  text="Change Image"
                  fontSize={12}
                  fontFamily="Arial"
                  fill="#374151"
                  align="center"
                  verticalAlign="middle"
                />
              </Group>
            )}
          </Layer>
        </Stage>

        {/* Size info below canvas */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 whitespace-nowrap">
          {customization.size.replace('x', ' × ')} • {customization.material} • {customization.frameColor}
        </div>
      </div>
    </div>
  );
});

KonvaFrameRenderer.displayName = 'KonvaFrameRenderer';

export default KonvaFrameRenderer;
