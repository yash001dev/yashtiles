import React from 'react';
import { FrameCustomization, UploadedImage } from '../../types';

interface FrameRendererProps {
  customization: FrameCustomization;
  uploadedImage?: UploadedImage | null;
  onImageClick?: () => void;
  frameCount?: number;
  currentFrameIndex?: number;
  isEditable?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  showFrameCounter?: boolean;
  showEditOverlay?: boolean;
  addClassicPadding?: boolean;
}

const FrameRenderer: React.FC<FrameRendererProps> = ({
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
}) => {
  const sampleImage = "https://picsum.photos/id/237/200/300";
  const imageToShow = uploadedImage?.url || sampleImage;

  const getFrameStyles = () => {
    const baseStyles = "relative transition-all duration-300 ";
    
    switch (customization.material) {
      case 'classic':
        return `${baseStyles} bg-white shadow-2xl border-solid
  border-[15px]
  border-t-[#333]
  border-b-[#333]
  border-r-[#000]
  border-l-[#000]
  shadow-[2px_2px_4px_rgba(0,0,0,0.6)] before:content-[''] before:absolute before:inset-0 before:bg-black before:opacity-50`;
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

  const getFrameColor = () => {
    switch (customization.frameColor) {
      case 'white':
        return 'bg-white border-gray-200';
      case 'brown':
        return '#a97442'; // distinct brown
      // case 'oak':
      //   return '#fef3c7';
      default:
        return 'bg-gray-900 border-gray-800';
    }
  };

  return (
    <div className={`${className} ${addClassicPadding && customization.material === 'classic' ? 'p-4 sm:p-6' : ''} ${addClassicPadding && customization.material === 'classic' ? getFrameColor() : ''}`}>
      {/* Main frame */}
      <div className={`${getFrameStyles()} max-w-sm w-full relative bg-black rounded-sm`}>
        {/* White matting/inner border */}
        <div className="bg-white rounded-sm shadow-inner">
          <div 
            className={`relative overflow-hidden ${uploadedImage && onImageClick ? 'cursor-pointer' : ''} ${isEditable ? 'cursor-move' : ''} group ${getAspectRatio()}`}
            onClick={uploadedImage && onImageClick ? onImageClick : undefined}
            onMouseDown={isEditable ? onMouseDown : undefined}
            onMouseMove={isEditable ? onMouseMove : undefined}
            onMouseUp={isEditable ? onMouseUp : undefined}
            onMouseLeave={isEditable ? onMouseLeave : undefined}
          >
            <img
              src={imageToShow}
              alt="Preview"
              className={`w-full h-full object-cover transition-all duration-500 ${!isEditable ? 'group-hover:scale-110' : ''} ${isEditable ? 'absolute inset-0 select-none' : ''}`}
              style={getImageStyles()}
              draggable={false}
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
            
            {/* Edit overlay */}
            {uploadedImage && showEditOverlay && onImageClick && (
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white bg-opacity-95 rounded-full px-4 py-2 transform scale-90 group-hover:scale-100">
                  <span className="text-sm font-medium text-gray-800">Click to edit</span>
                </div>
              </div>
            )}
            
            {/* Frame counter */}
            {frameCount > 1 && showFrameCounter && (
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                <span className="text-xs font-semibold text-gray-700">
                  {currentFrameIndex + 1} of {frameCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
