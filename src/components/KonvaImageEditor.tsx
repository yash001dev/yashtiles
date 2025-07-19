'use client';
import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut, Move, Download, RefreshCw } from 'lucide-react';
import { Stage, Layer, Image as KonvaImage, Transformer, Group } from 'react-konva';
import { UploadedImage, ImageTransform, FrameCustomization } from '../types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateActiveFrame } from '@/redux/slices/frameCustomizerSlice';
import Konva from 'konva';

interface KonvaImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  image: UploadedImage;
  customization: FrameCustomization;
  onTransformUpdate: (transform: Partial<ImageTransform>) => void;
  onImageReplace: (file: File) => void;
}

const KonvaImageEditor: React.FC<KonvaImageEditorProps> = ({
  isOpen,
  onClose,
  image,
  customization,
  onTransformUpdate,
  onImageReplace,
}) => {
  const [konvaImage, setKonvaImage] = useState<HTMLImageElement | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 600, height: 400 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const dispatch = useAppDispatch();
  const activeFrameId = useAppSelector(state => state.frameCustomizer.frameCollection.activeFrameId);

  // Load image
  useEffect(() => {
    if (image?.url) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setKonvaImage(img);
      };
      img.src = image.url;
    }
  }, [image?.url]);

  // Update stage size based on window
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 100, 800);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
      setStageSize({ width: maxWidth, height: maxHeight });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle transformer
  useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // Ensure frame updates are saved when the editor closes
  useEffect(() => {
    if (isOpen && activeFrameId) {
      dispatch(updateActiveFrame());
    }
    
    return () => {
      if (activeFrameId) {
        dispatch(updateActiveFrame());
      }
    };
  }, [isOpen, activeFrameId, dispatch]);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      onImageReplace(file);
      
      setTimeout(() => {
        dispatch(updateActiveFrame());
      }, 100);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = () => {
    setIsSelected(!isSelected);
  };

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      setIsSelected(false);
    }
  };

  const handleTransformEnd = () => {
    if (imageRef.current) {
      const node = imageRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      
      // Keep aspect ratio
      const scale = Math.max(scaleX, scaleY);
      
      onTransformUpdate({
        x: node.x(),
        y: node.y(),
        scale: scale,
        rotation: node.rotation(),
      });

      // Reset scale to 1 and adjust width/height instead
      node.scaleX(1);
      node.scaleY(1);
      
      if (activeFrameId) {
        dispatch(updateActiveFrame());
      }
    }
  };

  const handleKonvaDownload = () => {
    if (stageRef.current) {
      // Export the canvas with all transformations applied
      const uri = stageRef.current.toDataURL({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 2, // Higher resolution for better quality
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `edited-image-${Date.now()}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDragEnd = () => {
    if (imageRef.current) {
      const node = imageRef.current;
      onTransformUpdate({
        x: node.x(),
        y: node.y(),
      });
      
      if (activeFrameId) {
        dispatch(updateActiveFrame());
      }
    }
  };

  const handleScaleChange = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(3, image.transform.scale + delta));
    onTransformUpdate({ scale: newScale });
    
    if (activeFrameId) {
      dispatch(updateActiveFrame());
    }
  };

  const handleRotate = () => {
    const newRotation = (image.transform.rotation + 90) % 360;
    onTransformUpdate({ rotation: newRotation });
    
    if (activeFrameId) {
      dispatch(updateActiveFrame());
    }
  };

  const handleReset = () => {
    onTransformUpdate({
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    });
    
    if (activeFrameId) {
      dispatch(updateActiveFrame());
    }
  };

  const getImageDimensions = () => {
    if (!konvaImage) return { width: 200, height: 200 };
    
    // Use the actual image dimensions, but scale them to fit reasonably in the editor
    // while preserving the full image content
    const maxWidth = stageSize.width * 0.9;
    const maxHeight = stageSize.height * 0.9;
    
    const aspectRatio = konvaImage.width / konvaImage.height;
    
    let width = konvaImage.width;
    let height = konvaImage.height;
    
    // Scale down only if the image is larger than the available space
    if (width > maxWidth || height > maxHeight) {
      if (width / maxWidth > height / maxHeight) {
        // Width is the limiting factor
        width = maxWidth;
        height = width / aspectRatio;
      } else {
        // Height is the limiting factor
        height = maxHeight;
        width = height * aspectRatio;
      }
    }
    
    return { width, height };
  };

  const { width: imgWidth, height: imgHeight } = getImageDimensions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Canvas Area */}
          <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center min-h-[400px]">
            <div className="relative">
              <Stage
                ref={stageRef}
                width={stageSize.width}
                height={stageSize.height}
                onClick={handleStageClick}
                className="border border-gray-300 bg-white shadow-lg"
                style={{ overflow: 'visible' }}
              >
                <Layer>
                  {konvaImage && (
                    <Group>
                      <KonvaImage
                        ref={imageRef}
                        image={konvaImage}
                        x={stageSize.width / 2 - imgWidth / 2 + image.transform.x}
                        y={stageSize.height / 2 - imgHeight / 2 + image.transform.y}
                        width={imgWidth}
                        height={imgHeight}
                        scaleX={image.transform.scale}
                        scaleY={image.transform.scale}
                        rotation={image.transform.rotation}
                        draggable
                        onClick={handleImageClick}
                        onDragEnd={handleDragEnd}
                        onTransformEnd={handleTransformEnd}
                        offsetX={0}
                        offsetY={0}
                      />
                      {isSelected && (
                        <Transformer
                          ref={transformerRef}
                          boundBoxFunc={(oldBox, newBox) => {
                            // Limit resize
                            if (newBox.width < 50 || newBox.height < 50) {
                              return oldBox;
                            }
                            return newBox;
                          }}
                        />
                      )}
                    </Group>
                  )}
                </Layer>
              </Stage>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-full lg:w-80 p-4 border-l border-gray-200 bg-white">
            <div className="space-y-6">
              {/* Transform Controls */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Transform</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleScaleChange(0.1)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                    Zoom In
                  </button>
                  <button
                    onClick={() => handleScaleChange(-0.1)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                    Zoom Out
                  </button>
                  <button
                    onClick={handleRotate}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                    Rotate
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>

              {/* Transform Values */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Current Values</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Scale:</span>
                    <span>{image.transform.scale.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rotation:</span>
                    <span>{image.transform.rotation}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span>({image.transform.x}, {image.transform.y})</span>
                  </div>
                </div>
              </div>

              {/* Replace Image */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Replace Image</h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
                >
                  Choose New Image
                </button>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <button
                    onClick={handleKonvaDownload}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Edited Image
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Done Editing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Click the image to select it, then drag to move or use the transform handles to resize and rotate.
            Use the controls on the right for precise adjustments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KonvaImageEditor;
