import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { FrameItem, FrameCustomization, UploadedImage } from '../types/index';
import { useAuth } from '../contexts/AuthContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface MultiFrameSliderProps {
  frames: FrameItem[];
  activeFrameId: string | null;
  onFrameSelect: (frameId: string) => void;
  onFrameRemove: (frameId: string) => void;
  onAddFrame: () => void;
  onAuthRequired?: () => void;
  className?: string;
  // Props for showing temporary frame when no frames exist
  uploadedImage?: UploadedImage | null;
  currentCustomization?: FrameCustomization;
  getFrameImageUrl?: (frameId: string) => string | null;
}

const MultiFrameSlider: React.FC<MultiFrameSliderProps> = ({
  frames,
  activeFrameId,
  onFrameSelect,
  onFrameRemove,
  onAddFrame,
  onAuthRequired,
  className = '',
  uploadedImage,
  currentCustomization,
  getFrameImageUrl,
}) => {
  const swiperRef = useRef(null);
  const { isAuthenticated } = useAuth();

  // Calculate effective frame count (including temporary frame)
  const hasTemporaryFrame = frames.length === 0 && uploadedImage && currentCustomization;
  const effectiveFrameCount = hasTemporaryFrame ? 1 : frames.length;

  const handleAddFrame = () => {
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired();
      return;
    }
    
    // First time when there are no frames, don't show file upload dialog
    // Just call onAddFrame directly which will use the current temporary frame
    if (frames.length === 0 && uploadedImage && currentCustomization) {
      onAddFrame();
    } else {
      // For subsequent clicks, trigger the file upload dialog via parent component
      onAddFrame();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Frames</h3>
        <span className="text-sm text-gray-500">{effectiveFrameCount} frame{effectiveFrameCount !== 1 ? 's' : ''}</span>
      </div>

      <div className="relative">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination]}
          spaceBetween={12}
          slidesPerView="auto"
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet-custom',
            bulletActiveClass: 'swiper-pagination-bullet-active-custom',
          }}
          className="multi-frame-swiper"
        >
          {/* Temporary Frame Slide - shown when no frames but has uploaded image */}
          {hasTemporaryFrame && uploadedImage && (
            <SwiperSlide style={{ width: 'auto' }}>
              <div className="relative group">
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-purple-500 ring-2 ring-purple-200">
                  <img
                    src={uploadedImage.url}
                    alt="Current frame"
                    className="w-full h-full object-cover"
                  />
                  {/* Frame overlay to simulate the actual frame */}
                  <div className="absolute inset-0 border-2 border-black opacity-50 pointer-events-none" />
                </div>
              </div>
            </SwiperSlide>
          )}

          {/* Add New Frame Slide */}
          <SwiperSlide style={{ width: 'auto' }}>
            <button
              onClick={handleAddFrame}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-purple-400 hover:bg-purple-50 transition-colors group"
              title={isAuthenticated ? "Add Frame" : "Login to Add Frame"}
            >
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-purple-500" />
            </button>
          </SwiperSlide>

          {/* Frame Slides */}
          {frames.map((frame) => {
            const frameImageUrl = getFrameImageUrl ? getFrameImageUrl(frame.id) : null;
            const displayUrl = frameImageUrl || frame.image.url;
            
            return (
              <SwiperSlide key={frame.id} style={{ width: 'auto' }}>
                <div className="relative group">
                  <button
                    onClick={() => onFrameSelect(frame.id)}
                    className={`w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      activeFrameId === frame.id
                        ? 'border-purple-500 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={displayUrl}
                      alt="Frame preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Frame overlay to simulate the actual frame */}
                    <div className="absolute inset-0 border-2 border-black opacity-50 pointer-events-none" />
                  </button>
                  
                  {/* Remove button */}
                  {frames.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFrameRemove(frame.id);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {effectiveFrameCount > 3 && (
          <>
            <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-10 hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-10 hover:bg-gray-50">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </>
        )}
      </div>      {/* Custom pagination */}
      {effectiveFrameCount > 3 && (
        <div className="flex justify-center mt-4">
          <div className="swiper-pagination-custom flex gap-1"></div>
        </div>
      )}
    </div>
  );
};

export default MultiFrameSlider;
