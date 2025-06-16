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
    const baseStyles = "relative transition-all duration-500 ease-in-out transform hover:scale-105";
    
    switch (customization.material) {
      case 'classic':
        return `${baseStyles} shadow-2xl`;
      case 'frameless':
        return `${baseStyles} shadow-lg`;
      case 'canvas':
        return `${baseStyles} shadow-xl`;
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

    const aspectRatioMap: Record<string, string> = {
      '8x8': '1',
      '8x10': '8/10',
      '10x8': '10/8',
      '9x12': '9/12',
      '12x9': '12/9',
      '12x12': '1',
      '12x18': '12/18',
      '18x12': '18/12',
      '18x18': '1',
      '18x24': '18/24',
      '24x18': '24/18',
      '24x32': '24/32',
      '32x24': '32/24',
    };

    const baseStyle = {
      filter,
      aspectRatio: aspectRatioMap[customization.size] || '1',
      transition: 'all 0.3s ease-in-out',
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
        return '#ffffff';
      case 'oak':
        return '#d4a574';
      default:
        return '#1a1a1a';
    }
  };

  const imageToShow = uploadedImage?.url || sampleImage;

  // Realistic frame rendering
  const renderFrame = () => {
    if (customization.material === 'classic') {
      const frameColor = getFrameColor();
      const frameWidth = 40; // Frame width in pixels
      const matWidth = 20; // Mat width in pixels
      
      return (
        <div className="relative max-w-sm w-full">
          {/* Outer frame shadow */}
          <div 
            className="absolute inset-0 rounded-sm"
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2)',
              transform: 'translateY(4px)',
            }}
          />
          
          {/* Main frame */}
          <div 
            className="relative rounded-sm"
            style={{
              backgroundColor: frameColor,
              padding: `${frameWidth}px`,
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2), inset 0 0 5px rgba(255,255,255,0.1)',
            }}
          >
            {/* Frame bevel effect */}
            <div 
              className="absolute inset-0 rounded-sm"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255,255,255,0.3) 0%, 
                  transparent 30%, 
                  transparent 70%, 
                  rgba(0,0,0,0.2) 100%)`,
              }}
            />
            
            {/* Mat */}
            <div 
              className="relative bg-white rounded-sm"
              style={{
                padding: `${matWidth}px`,
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
              }}
            >
              {/* Image container */}
              <div 
                className={`relative overflow-hidden rounded-sm ${uploadedImage ? 'cursor-pointer' : ''} group`}
                onClick={uploadedImage ? onImageClick : undefined}
              >
                <img
                  src={imageToShow}
                  alt="Preview"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  style={getImageStyles()}
                />
                
                {/* Custom Border */}
                {customization.border && (
                  <div 
                    className="absolute inset-0 pointer-events-none transition-all duration-300"
                    style={{
                      border: `${customization.borderWidth}px solid ${customization.borderColor}`,
                    }}
                  />
                )}
                
                {uploadedImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white bg-opacity-95 rounded-full px-4 py-2 transform scale-90 group-hover:scale-100">
                      <span className="text-sm font-medium text-gray-800">Click to edit</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (customization.material === 'frameless') {
      return (
        <div className="relative max-w-sm w-full">
          <div 
            className={`relative overflow-hidden rounded-sm ${uploadedImage ? 'cursor-pointer' : ''} group shadow-2xl`}
            onClick={uploadedImage ? onImageClick : undefined}
          >
            <img
              src={imageToShow}
              alt="Preview"
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              style={getImageStyles()}
            />
            
            {/* Custom Border */}
            {customization.border && (
              <div 
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  border: `${customization.borderWidth}px solid ${customization.borderColor}`,
                }}
              />
            )}
            
            {uploadedImage && (
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white bg-opacity-95 rounded-full px-4 py-2 transform scale-90 group-hover:scale-100">
                  <span className="text-sm font-medium text-gray-800">Click to edit</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Canvas
      return (
        <div className="relative max-w-sm w-full">
          <div 
            className={`relative overflow-hidden rounded-sm ${uploadedImage ? 'cursor-pointer' : ''} group shadow-2xl`}
            onClick={uploadedImage ? onImageClick : undefined}
            style={{
              background: 'linear-gradient(45deg, #f8f8f8 25%, transparent 25%), linear-gradient(-45deg, #f8f8f8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f8f8 75%), linear-gradient(-45deg, transparent 75%, #f8f8f8 75%)',
              backgroundSize: '4px 4px',
              backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px',
              padding: '8px',
            }}
          >
            <img
              src={imageToShow}
              alt="Preview"
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 rounded-sm"
              style={getImageStyles()}
            />
            
            {/* Custom Border */}
            {customization.border && (
              <div 
                className="absolute inset-2 pointer-events-none transition-all duration-300 rounded-sm"
                style={{
                  border: `${customization.borderWidth}px solid ${customization.borderColor}`,
                }}
              />
            )}
            
            {uploadedImage && (
              <div className="absolute inset-2 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center rounded-sm">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white bg-opacity-95 rounded-full px-4 py-2 transform scale-90 group-hover:scale-100">
                  <span className="text-sm font-medium text-gray-800">Click to edit</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="relative animate-fadeIn">
        {renderFrame()}
        
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 whitespace-nowrap animate-slideUp">
          {customization.size.replace('x', ' × ')} • {customization.material} • {customization.frameColor}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};

export default FramePreview;