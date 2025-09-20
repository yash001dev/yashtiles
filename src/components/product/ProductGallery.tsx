/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Thumbs,
  Zoom,
  EffectFade,
} from "swiper/modules";
import { ChevronLeft, ChevronRight, ImageIcon, Eye } from "lucide-react";
import PDPPreviewCanvas from "@/components/PDPPreviewCanvas";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import "swiper/css/effect-fade";

interface ProductImage {
  image: {
    url: string;
    alt: string;
  };
  alt: string;
  caption?: string;
}

interface LiveViewImage {
  id: number;
  url: string;
  alt: string;
  caption?: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
}

import { useProduct } from "@/contexts/ProductContext";

interface ProductGalleryProps {
  images: ProductImage[];
  liveViewImage?: LiveViewImage;
  productName: string;
  selectedColor?: string;
  selectedMaterial?: string;
}

export default function ProductGallery({
  images,
  liveViewImage,
  productName,
}: ProductGalleryProps) {
  const { selectedSize, selectedColor, selectedMaterial } = useProduct();
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"frame" | "live">("frame");
  const [isLiveViewLoading, setIsLiveViewLoading] = useState(false);
  const [wallImage, setWallImage] = useState("/framedecor1.png");

  // Handle view mode change with loading simulation
  const handleViewModeChange = async (mode: "frame" | "live") => {
    if (mode === "live" && viewMode === "frame") {
      setIsLiveViewLoading(true);
      // Simulate loading time for dynamic content
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLiveViewLoading(false);
    }
    setViewMode(mode);
  };

  const getSizeData = () => {
    return { id: selectedSize || "12x12" };
  };

  const getSelectedVariants = () => {
    return {
      color: { color: selectedColor || "#8B4513" },
      material: { name: selectedMaterial || "classic" },
    };
  };

  return (
    <div className="w-full lg:w-1/2 lg:sticky lg:top-6 lg:self-start">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        {/* View Mode Toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => handleViewModeChange("frame")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                viewMode === "frame"
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Frame View
            </button>
            <button
              onClick={() => handleViewModeChange("live")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                viewMode === "live"
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              disabled={isLiveViewLoading}
            >
              <Eye className="w-4 h-4" />
              Live View
              {isLiveViewLoading && (
                <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Content Area with Animation */}
        <AnimatePresence mode="wait">
          {viewMode === "frame" && (
            <motion.div
              key="frame-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Main Image Swiper */}
              <div className="relative">
                <Swiper
                  modules={[Navigation, Pagination, Thumbs, Zoom, EffectFade]}
                  spaceBetween={10}
                  navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom",
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null,
                  }}
                  zoom={{ maxRatio: 3 }}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  onSlideChange={(swiper) =>
                    setActiveImageIndex(swiper.activeIndex)
                  }
                  className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-gray-100 max-w-[500px] max-h-[500px]"
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="swiper-zoom-container">
                        <img
                          src={'https://d3eklbyrx2lntp.cloudfront.net'+ img.image.url.replace('/api/media/file','') +'?format=webp' || '/placeholder.png'}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Enhanced Custom Navigation Buttons */}
                <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group">
                  <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>

                <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group">
                  <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
              </div>

              {/* Thumbnail Swiper */}
              {images.length > 1 && (
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={10}
                  slidesPerView={4}
                  breakpoints={{
                    640: { slidesPerView: 5 },
                    768: { slidesPerView: 6 },
                  }}
                  watchSlidesProgress
                  onSwiper={setThumbsSwiper}
                  className="thumbs-swiper"
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          index === activeImageIndex
                            ? "border-pink-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={'https://d3eklbyrx2lntp.cloudfront.net'+ img.image.url.replace('/api/media/file','') +'?format=webp' || '/placeholder.png'}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </motion.div>
          )}

          {viewMode === "live" && (
            <motion.div
              key="live-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Live View Canvas */}
              <div className="space-y-3">
                {/* Live View Image Indicator */}
                {liveViewImage?.url && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <Eye className="w-4 h-4" />
                      Live View Image
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <PDPPreviewCanvas
                    selectedImage={
                      liveViewImage?.url || images[0]?.image.url
                    }
                    selectedSize={getSizeData()?.id || "12x12"}
                    selectedColor={
                      getSelectedVariants().color?.color || "#8B4513"
                    }
                    selectedMaterial={
                      getSelectedVariants()
                        .material?.name?.split(" ")[0]
                        .toLowerCase() || "classic"
                    }
                    wallImage={wallImage}
                    onWallImageChange={setWallImage}
                    className="w-full max-w-md"
                  />
                </div>
              </div>

              {/* Product Image Selection for Live View */}
              {images.length > 1 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Select Product Image
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          index === activeImageIndex
                            ? "border-pink-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={'https://d3eklbyrx2lntp.cloudfront.net'+ img.image.url.replace('/api/media/file','') +'?format=webp' || '/placeholder.png'}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
