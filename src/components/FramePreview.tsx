import React from 'react';
import { FrameCustomization, UploadedImage } from '../types';

interface FramePreviewProps {
  customization: FrameCustomization;
  uploadedImage?: UploadedImage | null;
  onImageClick?: () => void;
}

const FramePreview: React.FC<FramePreviewProps> = ({ 
  customization, 
  uploadedImage, 
  onImageClick 
}) => {
  const sampleImage = "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800";

  const getFrameStyles = () => {
    const baseStyles = "relative transition-all duration-300 ease-in-out";
    
    switch (customization.material) {
      case 'classic':
        return `${baseStyles} p-6 bg-white shadow-2xl`;
      case 'frameless':
        return `${baseStyles} shadow-lg`;
      case 'canvas':
        return `${baseStyles} border-8 border-gray-100 shadow-xl`;
      default:
        return baseStyles;
    }
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

    const baseStyle = {
      filter,
      aspectRatio: customization.size === '8x11' ? '8/11' : 
                  customization.size === '11x8' ? '11/8' : '1',
    };

    if (uploadedImage) {
      return {
        ...baseStyle,
        transform: `translate(${uploadedImage.transform.x}px, ${uploadedImage.transform.y}px) scale(${uploadedImage.transform.scale}) rotate(${uploadedImage.transform.rotation}deg)`,
      };
    }

    return baseStyle;
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

  const imageToShow = uploadedImage?.url || sampleImage;

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="relative">
        <div className={`${getFrameStyles()} ${customization.material === 'classic' ? getFrameColor() : ''} max-w-sm w-full`}>
          <div 
            className={`relative overflow-hidden rounded-sm ${uploadedImage ? 'cursor-pointer' : ''}`}
            onClick={uploadedImage ? onImageClick : undefined}
          >
            <img
              src={imageToShow}
              alt="Preview"
              className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
              style={getImageStyles()}
            />
            {customization.border && customization.material === 'classic' && (
              <div className="absolute inset-0 border-2 border-gray-300 pointer-events-none" />
            )}
            
            {uploadedImage && (
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-90 rounded-full p-2">
                  <span className="text-sm font-medium text-gray-800">Click to edit</span>
                </div>
              </div>
            )}
          </div>
          
          {customization.material === 'classic' && (
            <div className="absolute top-2 right-2 w-4 h-4 bg-gray-400 rounded-full opacity-30" />
          )}
        </div>
        
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 whitespace-nowrap">
          {customization.size.replace('x', ' × ')} • {customization.material} • {customization.frameColor}
        </div>
      </div>
    </div>
  );
};

export default FramePreview;