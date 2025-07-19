import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { Download } from "lucide-react";
import { FrameCustomization, UploadedImage } from "../types";
import KonvaFrameRenderer, {
  KonvaFrameRendererRef,
} from "./ui/KonvaFrameRenderer";

interface FramePreviewProps {
  customization: FrameCustomization;
  uploadedImage?: UploadedImage | null;
  onImageClick?: () => void;
  frameCount?: number;
  currentFrameIndex?: number;
}

export interface FramePreviewRef {
  handleDownload: () => void;
}

const FramePreview = forwardRef<FramePreviewRef, FramePreviewProps>((
  {
    customization,
    uploadedImage,
    onImageClick,
    frameCount = 0,
    currentFrameIndex = 0,
  },
  ref
) => {
  // Calculate exact dimensions based on frame size
  const getFrameDimensions = () => {
    const [widthStr, heightStr] = customization.size.split("x");
    const widthRatio = parseInt(widthStr);
    const heightRatio = parseInt(heightStr);

    // Calculate exact proportions
    const aspectRatio = widthRatio / heightRatio;
    const maxDisplaySize = 400; // Maximum size for display

    let width, height;

    // Scale to fit within max display size while maintaining exact proportions
    if (aspectRatio >= 1) {
      // Width is larger or equal to height
      width = maxDisplaySize;
      height = maxDisplaySize / aspectRatio;
    } else {
      // Height is larger than width
      height = maxDisplaySize;
      width = maxDisplaySize * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
      exactRatio: aspectRatio,
    };
  };

  const { width: frameWidth, height: frameHeight } = getFrameDimensions();
  const frameRendererRef = useRef<KonvaFrameRendererRef>(null);

  const handleDownload = () => {
    if (frameRendererRef.current && uploadedImage) {
      frameRendererRef.current.downloadImage();
    }
  };

  // Expose handleDownload method through ref
  useImperativeHandle(ref, () => ({
    handleDownload,
  }));

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="relative animate-fadeIn">
        {/* Outer frame with 3D shadow effect */}
        <div className="relative">
          <KonvaFrameRenderer
            ref={frameRendererRef}
            customization={customization}
            uploadedImage={uploadedImage}
            onImageClick={onImageClick}
            frameCount={frameCount}
            currentFrameIndex={currentFrameIndex}
            showFrameCounter={true}
            showEditOverlay={true}
            width={frameWidth}
            height={frameHeight}
          />

          {/* Download Button - Top Right Corner */}
          {uploadedImage && (
            <button
              onClick={handleDownload}
              className="absolute -top-2 -right-2 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-10"
              title="Download Frame"
            >
              <Download size={16} />
            </button>
          )}
        </div>

        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 whitespace-nowrap animate-slideUp">
          {customization.size.replace("x", " × ")} • {customization.material} •{" "}
          {customization.frameColor}
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
});

FramePreview.displayName = 'FramePreview';

export default FramePreview;
