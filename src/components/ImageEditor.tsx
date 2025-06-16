import React, { useState, useRef } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut, Move, Download, RefreshCw } from 'lucide-react';
import { UploadedImage, ImageTransform, FrameCustomization } from '../types';

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

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      onImageReplace(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - image.transform.x,
      y: e.clientY - image.transform.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      onTransformUpdate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(3, image.transform.scale + delta));
    onTransformUpdate({ scale: newScale });
  };

  const handleRotate = () => {
    onTransformUpdate({ rotation: (image.transform.rotation + 90) % 360 });
  };

  const handleReset = () => {
    onTransformUpdate({
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0,
    });
  };

  const getImageStyles = () => {
    let filter = '';
    switch (customization.effect) {
      case 'silver':
        filter = 'grayscale(100%) contrast(110%)';
        break;
      case 'noir':
        filter = 'grayscale(100%) contrast(150%) brightness(90%)';
        break;
      case 'vivid':
        filter = 'saturate(150%) contrast(120%)';
        break;
      case 'dramatic':
        filter = 'contrast(140%) brightness(95%) saturate(130%)';
        break;
      default:
        filter = 'none';
    }

    return {
      transform: `translate(${image.transform.x}px, ${image.transform.y}px) scale(${image.transform.scale}) rotate(${image.transform.rotation}deg)`,
      filter,
    };
  };

  const getFrameColor = () => {
    switch (customization.frameColor) {
      case 'white':
        return 'bg-white border-gray-200';
      case 'oak':
        return 'bg-amber-100 border-amber-200';
      default:
        return 'bg-gray-900 border-gray-800';
    }
  };
  const getAspectRatio = () => {
    switch (customization.size) {
      case '8x8':
      case '12x12':
      case '18x18':
        return 'aspect-square';
      case '8x10':
        return 'aspect-[8/10]';
      case '10x8':
        return 'aspect-[10/8]';
      case '9x12':
        return 'aspect-[9/12]';
      case '12x9':
        return 'aspect-[12/9]';
      case '12x18':
        return 'aspect-[12/18]';
      case '18x12':
        return 'aspect-[18/12]';
      case '18x24':
        return 'aspect-[18/24]';
      case '24x18':
        return 'aspect-[24/18]';
      case '24x32':
        return 'aspect-[24/32]';
      case '32x24':
        return 'aspect-[32/24]';
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-2 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Photo</h2>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-1 sm:space-x-2 text-sm"
            >
              <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Replace</span>
            </button>
            <button
              onClick={onDownload}
              className="bg-pink-500 hover:bg-pink-600 text-white px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-1 sm:space-x-2 text-sm"
            >
              <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
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
                <div className={`relative ${customization.material === 'classic' ? 'p-4 sm:p-6' : ''} ${customization.material === 'classic' ? getFrameColor() : ''} shadow-2xl w-full max-w-sm lg:max-w-md xl:max-w-lg`}>
                  <div 
                    className={`relative overflow-hidden rounded-sm ${getAspectRatio()} cursor-move`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <img
                      src={image.url}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-100 select-none"
                      style={getImageStyles()}
                      draggable={false}
                    />
                    {customization.border && customization.material === 'classic' && (
                      <div className="absolute inset-0 border-2 border-gray-300 pointer-events-none" />
                    )}
                  </div>
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
                          onChange={(e) => onTransformUpdate({ scale: parseFloat(e.target.value) })}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">X: {Math.round(image.transform.x)}</label>
                          <input
                            type="range"
                            min="-200"
                            max="200"
                            value={image.transform.x}
                            onChange={(e) => onTransformUpdate({ x: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Y: {Math.round(image.transform.y)}</label>
                          <input
                            type="range"
                            min="-200"
                            max="200"
                            value={image.transform.y}
                            onChange={(e) => onTransformUpdate({ y: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleReset}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                    >
                      Reset Position & Scale
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
                    <li>• Drag the image to reposition</li>
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