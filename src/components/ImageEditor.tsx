'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut, Move, Download, RefreshCw } from 'lucide-react';
import { UploadedImage, ImageTransform, FrameCustomization } from '../types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateActiveFrame } from '@/redux/slices/frameCustomizerSlice';
import KonvaFrameRenderer from './ui/KonvaFrameRenderer';
import { Input } from '@/components/ui/input';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  image: UploadedImage;
  customization: FrameCustomization;
  onTransformUpdate: (transform: Partial<ImageTransform>) => void;
  onDownload: () => void;
  onImageReplace: (file: File) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  isOpen,
  onClose,
  image,
  customization,
  onTransformUpdate,   
  onDownload,
  onImageReplace,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tempTransform, setTempTransform] = useState<Partial<ImageTransform> | null>(null);
  
  // Local state for smooth editing without Redux updates
  const [localTransform, setLocalTransform] = useState<ImageTransform>(image.transform);
  const [hasChanges, setHasChanges] = useState(false);
  const [showGrid, setShowGrid] = useState(true); // Grid overlay toggle
  
  // Refs to track current values for cleanup
  const hasChangesRef = useRef(false);
  const localTransformRef = useRef<ImageTransform>(image.transform);
  
  // Update refs when state changes
  useEffect(() => {
    hasChangesRef.current = hasChanges;
    localTransformRef.current = localTransform;
  }, [hasChanges, localTransform]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const activeFrameId = useAppSelector(state => state.frameCustomizer.frameCollection.activeFrameId);
  const newState= useAppSelector(state => state.frameCustomizer.frameCollection);
  const konvaRef = useRef<{ getCanvasDataURL: () => string | undefined }>(null);
  const downloadImageRef = useRef<{ getCanvasDataURL: () => string | undefined }>(null);

  // Helper function to calculate actual image display dimensions based on material and constraints
  const getActualImageDimensions = () => {
    const responsiveWidth = typeof window !== 'undefined' ? Math.min(400, window.innerWidth - 32) : 400;
    const aspect = customization.size === '8x8' || customization.size === '12x12' || customization.size === '18x18' ? 1 : 0.8;
    const canvasWidth = responsiveWidth - 30;
    const canvasHeight = responsiveWidth / aspect;
    
    // Calculate frame structure
    const frameBorder = customization.material === 'classic' ? 15 : 0;
    const matting = customization.material === 'classic' || customization.material === 'frameless' || customization.material === 'canvas' ? 0 : 10;
    const showCustomBorder = customization.border && customization.borderWidth && customization.borderColor;
    const customBorderWidth = showCustomBorder ? Math.max(customization.borderWidth! * 3, 8) : 0;
    
    // Base available area calculation (without custom border influence on frame)
    const baseAvailableWidth = customization.material === 'frameless' || customization.material === 'canvas'
      ? canvasWidth - 2 * (customization.material === 'canvas' ? frameBorder : 0)
      : canvasWidth - 2 * (frameBorder + matting);
    const baseAvailableHeight = customization.material === 'frameless' || customization.material === 'canvas'
      ? canvasHeight - 2 * (customization.material === 'canvas' ? frameBorder : 0)
      : canvasHeight - 2 * (frameBorder + matting);
      
    // Final available area after accounting for custom border
    const availableWidth = baseAvailableWidth - 2 * customBorderWidth;
    const availableHeight = baseAvailableHeight - 2 * customBorderWidth;

    // Image group position
    const imageGroupX = customization.material === 'frameless' 
      ? customBorderWidth 
      : customization.material === 'canvas'
        ? frameBorder + customBorderWidth
        : frameBorder + matting + customBorderWidth;
    const imageGroupY = imageGroupX;

    return {
      width: availableWidth,
      height: availableHeight,
      imageGroupX,
      imageGroupY,
      customBorderWidth,
      canvasWidth,
      canvasHeight
    };
  };

  // Update local state when image prop changes
  useEffect(() => {
    setLocalTransform(image.transform);
    setHasChanges(false);
  }, [image.transform]);

  // Function to save local changes to Redux
  const handleSave = () => {
    onTransformUpdate(localTransform);
    setHasChanges(false);
    if (activeFrameId) {
      dispatch(updateActiveFrame());
    }
  };

  // Helper function to get drag boundaries based on border settings
  const getDragBoundaries = () => {
    const dimensions = getActualImageDimensions();
    
    // If there's a custom border, constrain to the available image area
    if (customization.border && customization.borderWidth && customization.borderColor) {
      // The image should stay within the available area (inside the custom border)
      return {
        minX: 0, // Relative to image group position
        maxX: 0, // Image should not move beyond its container
        minY: 0,
        maxY: 0,
        // Boundaries for the visible area
        containerWidth: dimensions.width,
        containerHeight: dimensions.height
      };
    }
    
    // No border constraints - can drag within reasonable bounds
    return {
      minX: -dimensions.width * 0.5,
      maxX: dimensions.width * 0.5,
      minY: -dimensions.height * 0.5,
      maxY: dimensions.height * 0.5,
      containerWidth: dimensions.width,
      containerHeight: dimensions.height
    };
  };

  // Helper function to constrain position within boundaries
  const constrainPosition = (x: number, y: number, scale: number = localTransform.scale) => {
    const boundaries = getDragBoundaries();
    const dimensions = getActualImageDimensions();
   
    // Calculate image dimensions at current scale
    const scaledWidth = dimensions.width * scale;
    const scaledHeight = dimensions.height * scale;
    
    // If custom border is active, ensure image stays within available area
    if (customization.border && customization.borderWidth && customization.borderColor) {
      // Allow some movement even when image is larger than container
      // Calculate how much the image can move while keeping at least some part visible
      const minVisibleWidth = Math.min(scaledWidth, dimensions.width * 0.3); // At least 30% visible
      const minVisibleHeight = Math.min(scaledHeight, dimensions.height * 0.3);
      
      const maxX = Math.max(0, dimensions.width - minVisibleWidth);
      const maxY = Math.max(0, dimensions.height - minVisibleHeight);
      const minX = Math.min(0, dimensions.width - scaledWidth);
      const minY = Math.min(0, dimensions.height - scaledHeight);
      
      return {
        x: Math.max(minX, Math.min(maxX, x)),
        y: Math.max(minY, Math.min(maxY, y))
      };
    }
    
    // No custom border - allow some flexibility but keep image mostly visible
    return {
      x: Math.max(boundaries.minX, Math.min(boundaries.maxX, x)),
      y: Math.max(boundaries.minY, Math.min(boundaries.maxY, y))
    };
  };

  // Ensure frame updates are saved when the editor closes
  useEffect(() => {
    // Only run initial setup when editor opens
    if (isOpen && activeFrameId) {
      dispatch(updateActiveFrame());
    }
  }, [isOpen, activeFrameId, dispatch]);

  // Handle auto-save on close
  useEffect(() => {
    return () => {
      // Auto-save when unmounting if there are unsaved changes
      if (hasChangesRef.current) {
        onTransformUpdate(localTransformRef.current);
        if (activeFrameId) {
          dispatch(updateActiveFrame());
        }
      }
    };
  }, []); // Empty dependency array to only run on unmount

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      onImageReplace(file);
      // Reset local transform when replacing image
      setLocalTransform({
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
      });
      setHasChanges(false);
      setTimeout(() => {
        dispatch(updateActiveFrame());
      }, 100);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    // Use the hidden KonvaFrameRenderer for print-ready image
    let dataUrl = undefined;
    if (downloadImageRef.current) {
      // Try to get JPEG data URL
      const stage = downloadImageRef.current;
      // getCanvasDataURL may not accept mime type, so fallback to canvas API if needed
      const canvasDataUrl = (stage.getCanvasDataURL as any)?.('image/jpeg', 0.92);
      if (canvasDataUrl && canvasDataUrl.startsWith('data:image/jpeg')) {
        dataUrl = canvasDataUrl;
      } else {
        // fallback: get PNG and convert to JPEG
        const pngUrl = stage.getCanvasDataURL();
        if (pngUrl) {
          const img = new window.Image();
          img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const jpegUrl = canvas.toDataURL('image/jpeg', 0.92);
              const link = document.createElement('a');
              link.href = jpegUrl;
              link.download = 'print-ready-image.jpg';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          };
          img.src = pngUrl;
          return;
        }
      }
    }
    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'print-ready-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Smooth drag logic with local state
  const handleKonvaMouseDown = (e: any) => {
    setIsDragging(true);
    const pos = e.target.getStage().getPointerPosition();
    setDragStart({
      x: pos.x - localTransform.x,
      y: pos.y - localTransform.y,
    });
    setTempTransform(null);
  };

  const handleKonvaMouseMove = (e: any) => {
    if (isDragging) {
      const pos = e.target.getStage().getPointerPosition();
      const newX = pos.x - dragStart.x;
      const newY = pos.y - dragStart.y;
      
      // Apply boundary constraints with current scale
      const constrainedPos = constrainPosition(newX, newY, localTransform.scale);
      
      // Update temp transform for smooth dragging
      setTempTransform({
        x: constrainedPos.x,
        y: constrainedPos.y,
      });
    }
  };

  const handleKonvaMouseUp = () => {
    setIsDragging(false);
   
    // Apply the final transform to local state
    if (tempTransform) {
      setLocalTransform(prev => ({
        ...prev,
        ...tempTransform
      }));
      setTempTransform(null);
      setHasChanges(true);
    }
  };

  const handleScaleChange = (delta: number) => {
    const dimensions = getActualImageDimensions();
    
    // If custom border is active, constrain maximum scale to ensure image fits
    let maxScale = 3;
    if (customization.border && customization.borderWidth && customization.borderColor) {
      // Ensure the image can't scale larger than the available container
      maxScale = Math.min(3, Math.max(1, dimensions.width / 100)); // Reasonable maximum
    }
    
    const newScale = Math.max(0.5, Math.min(maxScale, localTransform.scale + delta));
    
    // Calculate current image center position
    const currentImageCenterX = localTransform.x + (dimensions.width * localTransform.scale) / 2;
    const currentImageCenterY = localTransform.y + (dimensions.height * localTransform.scale) / 2;
    
    // Calculate new position to maintain image center
    const newX = currentImageCenterX - (dimensions.width * newScale) / 2;
    const newY = currentImageCenterY - (dimensions.height * newScale) / 2;
    
    // Apply boundary constraints with new scale
    const constrainedPos = constrainPosition(newX, newY, newScale);
    
    setLocalTransform(prev => ({
      ...prev,
      scale: newScale,
      x: constrainedPos.x,
      y: constrainedPos.y
    }));
    setHasChanges(true);
  };

  const handleRotate = () => {
    setLocalTransform(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
    setHasChanges(true);
  };

  const handleReset = () => {
    setLocalTransform({
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0,
    });
    setHasChanges(true);
  };
  
  // Get current transform including temporary state during dragging
  const currentTransform = tempTransform ? { ...localTransform, ...tempTransform } : localTransform;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-2 sm:p-4">
      {/* Hidden print-ready renderer for download */}
      <div style={{ position: 'absolute', left: -9999, top: -9999 }}>
        <KonvaFrameRenderer
          ref={downloadImageRef}
          customization={customization}
          uploadedImage={{...image, transform: currentTransform}}
          isEditable={false}
          downloadOnlyImage={true}
          width={800}
          frameId={activeFrameId ? activeFrameId.toString() : '0'}
        />
      </div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Photo</h2>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {hasChanges && (
              <button
                onClick={handleSave}
                className="bg-pink-600 hover:bg-pink-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
              >
                Save Changes
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 min-h-0">
              {/* Preview Area */}
              <div className="flex-1 flex items-center justify-center">
                <div className="relative shadow-2xl w-full max-w-sm ">
                  <KonvaFrameRenderer
                    ref={konvaRef}
                    customization={customization}
                    uploadedImage={{...image, transform: currentTransform}}
                    isEditable={true}
                    showGrid={showGrid}
                    onMouseDown={handleKonvaMouseDown}
                    onMouseMove={handleKonvaMouseMove}
                    onMouseUp={handleKonvaMouseUp}
                    onMouseLeave={handleKonvaMouseUp}
                    showFrameCounter={false}
                    showEditOverlay={true}
                    addClassicPadding={true}
                    frameId={activeFrameId ? activeFrameId.toString() : '0'}
                    onImageDrag={({ x, y }) => {
                      console.log("X:",x,"Y:",y)
                      setLocalTransform(prev => ({
                        ...prev,
                        x: x,
                        y: y
                      }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="lg:w-80 xl:w-96 space-y-4 lg:space-y-6 flex-shrink-0">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Move size={18} className="mr-2" />
                    Position & Scale
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scale: {Math.round(currentTransform.scale * 100)}%
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleScaleChange(-0.1)}
                          className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ZoomOut size={16} />
                        </button>
                        <input
                          type="range"
                          min="0.5"
                          max={customization.border && customization.borderWidth && customization.borderColor ? "2" : "3"}
                          step="0.1"
                          value={currentTransform.scale}
                          onChange={(e) => {
                            const newScale = parseFloat(e.target.value);
                            const dimensions = getActualImageDimensions();
                            
                            // Calculate current image center position
                            const currentImageCenterX = localTransform.x + (dimensions.width * localTransform.scale) / 2;
                            const currentImageCenterY = localTransform.y + (dimensions.height * localTransform.scale) / 2;
                            
                            // Calculate new position to maintain image center
                            const newX = currentImageCenterX - (dimensions.width * newScale) / 2;
                            const newY = currentImageCenterY - (dimensions.height * newScale) / 2;
                            
                            // Apply boundary constraints with new scale
                            const constrainedPos = constrainPosition(newX, newY, newScale);
                            
                            setLocalTransform(prev => ({
                              ...prev,
                              scale: newScale,
                              x: constrainedPos.x,
                              y: constrainedPos.y
                            }));
                            setHasChanges(true);
                          }}
                          className="flex-1"
                        />
                        <button
                          onClick={() => handleScaleChange(0.1)}
                          className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ZoomIn size={16} />
                        </button>
                      </div>
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rotation: {image.transform.rotation}°
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleRotate}
                          className="flex-1 p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                        >
                          <RotateCw size={16} />
                          <span>Rotate 90°</span>
                        </button>
                      </div>
                    </div> */}
                    <button
                      onClick={handleReset}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                    >
                      Reset Scale
                    </button>
                    
                    {/* Grid Toggle */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Show 9×9 Grid
                      </label>
                      <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          showGrid ? 'bg-pink-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showGrid ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm font-medium text-gray-700"
                    >
                      <RefreshCw size={16} />
                      <span>Replace Image</span>
                    </button>
                    {/* <button
                      onClick={handleDownload}
                      className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
                    >
                      <Download size={16} />
                      <span>Download Image</span>
                    </button> */}
                    {hasChanges && (
                      <button
                        onClick={handleSave}
                        className="w-full p-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
                      >
                        <span>💾</span>
                        <span>Save Changes</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Tips</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Drag image to reposition</li>
                    <li>• Use scale controls to resize</li>
                    <li>• Toggle grid to see composition guides</li>
                    <li className="text-amber-600">• Orange lines show rule of thirds</li>
                    <li className="text-red-600">• Red dot marks the center point</li>
                    {customization.border && customization.borderWidth && customization.borderColor && (
                      <li className="text-orange-600">• Image is constrained within the custom border</li>
                    )}
                    <li>• Changes saved automatically on close</li>
                    <li>• Click "Save Changes" to apply immediately</li>
                    {/* <li>• Use "Download Image" to save your creation</li> */}
                    {hasChanges && (
                      <li className="text-blue-600 font-medium">• You have unsaved changes</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;