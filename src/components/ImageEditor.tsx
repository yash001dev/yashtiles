import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut, Move, Download, RefreshCw } from 'lucide-react';
import { UploadedImage, ImageTransform, FrameCustomization } from '../types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateActiveFrame } from '@/redux/slices/frameCustomizerSlice';
import KonvaFrameRenderer from './ui/KonvaFrameRenderer';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const activeFrameId = useAppSelector(state => state.frameCustomizer.frameCollection.activeFrameId);
  const konvaRef = useRef<{ getCanvasDataURL: () => string | undefined }>(null);

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

  const handleDownload = () => {
    const dataUrl = konvaRef.current?.getCanvasDataURL();
    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'edited-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Konva-based drag logic
  const handleKonvaMouseDown = (e: any) => {
    setIsDragging(true);
    const pos = e.target.getStage().getPointerPosition();
    setDragStart({
      x: pos.x - image.transform.x,
      y: pos.y - image.transform.y,
    });
  };

  const handleKonvaMouseMove = (e: any) => {
    if (isDragging) {
      const pos = e.target.getStage().getPointerPosition();
      onTransformUpdate({
        x: pos.x - dragStart.x,
        y: pos.y - dragStart.y,
      });
    }
  };

  const handleKonvaMouseUp = () => {
    setIsDragging(false);
    if (activeFrameId) {
      dispatch(updateActiveFrame());
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
    onTransformUpdate({ rotation: (image.transform.rotation + 90) % 360 });
    if (activeFrameId) {
      dispatch(updateActiveFrame());
    }
  };

  const handleReset = () => {
    onTransformUpdate({
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0,
    });
    if (activeFrameId) {
      dispatch(updateActiveFrame());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-2 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Photo</h2>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handleDownload}
              className="bg-pink-500 hover:bg-pink-600 text-white px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-1 sm:space-x-2 text-sm mr-10"
            >
              <Download size={16} className="sm:w-[18px] sm:h-[18px] " />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 min-h-0">
              {/* Preview Area */}
              <div className="flex-1 flex items-center justify-center lg:justify-start">
                <div className="relative shadow-2xl w-full max-w-sm lg:max-w-md xl:max-w-lg">
                  <KonvaFrameRenderer
                    ref={konvaRef}
                    customization={customization}
                    uploadedImage={image}
                    isEditable={true}
                    onMouseDown={handleKonvaMouseDown}
                    onMouseMove={handleKonvaMouseMove}
                    onMouseUp={handleKonvaMouseUp}
                    onMouseLeave={handleKonvaMouseUp}
                    showFrameCounter={false}
                    showEditOverlay={false}
                    addClassicPadding={true}
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
                        Scale: {Math.round(image.transform.scale * 100)}%
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
                          max="3"
                          step="0.1"
                          value={image.transform.scale}
                          onChange={(e) => {
                            onTransformUpdate({ scale: parseFloat(e.target.value) });
                            if (activeFrameId) {
                              dispatch(updateActiveFrame());
                            }
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
                    <div>
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
                    </div>
                    <button
                      onClick={handleReset}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                    >
                      Reset  Scale
                    </button>
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
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Tips</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use scale slider to resize</li>
                    <li>• Rotate in 90° increments</li>
                    <li>• Replace image anytime</li>
                    <li>• Download when satisfied</li>
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