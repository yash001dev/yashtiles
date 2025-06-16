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
        return `${baseStyles} p-3 bg-black shadow-2xl`;
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
  const imageToShow = uploadedImage?.url || sampleImage;
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="relative animate-fadeIn">
        {/* Outer frame with 3D shadow effect */}
        <div className="relative">
          {/* Shadow layers for 3D effect */}
          <div className="absolute top-2 left-2 w-full h-full bg-gray-400 rounded-sm"></div>
          <div className="absolute top-1 left-1 w-full h-full bg-gray-500 rounded-sm"></div>
          
          {/* Main frame */}
          <div className={`${getFrameStyles()} max-w-sm w-full relative bg-black rounded-sm`}>
            {/* White matting/inner border */}
            <div className="bg-white rounded-sm   shadow-inner">
              <div 
                className={`relative overflow-hidden ${uploadedImage ? 'cursor-pointer' : ''} group`}
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
        
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 whitespace-nowrap animate-slideUp">
          {customization.size.replace('x', ' × ')} • {customization.material} • {customization.frameColor}
        </div>
      </div>

      <style>{`
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