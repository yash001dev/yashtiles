"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image, ImageKitProvider } from "@imagekit/next";
import ReusableSwiper, { SwiperSlide } from "@/components/ui/ReusableSwiper";
import { galleryPhotos } from "@/components/common/GalleryPhotos";

const FrameItPhotoGallery = () => {
  // Responsive slides calculation using Swiper's breakpoints
  // No need for manual state/effects for carousel logic
  const [isMounted, setIsMounted] = useState(false);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<any>(null);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Skeleton loader to prevent hydration mismatch
    return (
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal-900 mb-4">
                Photo Gallery
              </h2>
              <p className="text-lg text-charcoal-800/70 max-w-2xl mx-auto">
                Discover the beauty of your memories transformed into stunning
                framed art. Each piece is carefully crafted to bring your photos
                to life.
              </p>
            </div>
            <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal-900 mb-4">
              Photo Gallery
            </h2>
            <p className="text-lg text-charcoal-800/70 max-w-2xl mx-auto">
              Discover the beauty of your memories transformed into stunning
              framed art. Each piece is carefully crafted to bring your photos
              to life.
            </p>
          </div>

          {/* Photo Gallery Swiper Carousel */}
          <div className="relative">
            {/* Custom Navigation Buttons */}
            <Button
              ref={prevRef}
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
              aria-label="Previous photo"
              style={{ pointerEvents: 'auto' }}
              onClick={() => swiperRef.current && swiperRef.current.slidePrev()}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              ref={nextRef}
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
              aria-label="Next photo"
              style={{ pointerEvents: 'auto' }}
              onClick={() => swiperRef.current && swiperRef.current.slideNext()}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            <ReusableSwiper
              swiperProps={{
                effect: "coverflow",
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: "auto",
                loop: true,
                coverflowEffect: {
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                },
                autoplay: { delay: 3000, disableOnInteraction: false },
                pagination: { clickable: true },
              }}
              prevButton={prevRef}
              nextButton={nextRef}
              onSwiperInit={(swiper) => { swiperRef.current = swiper; }}
            >
              {galleryPhotos.map((photo, index) => (
                <SwiperSlide key={photo.id} style={{ width: 300 }}>
                  {/* Frame Container */}
                  <div className="flex-shrink-0 group cursor-pointer" >
                    <div className="relative">
                      {/* Main Frame */}
                      <div
                        style={{ borderColor: 'black' }}
                        className="border-solid border-[15px]  p-4 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform  h-full"
                      >
                        <div className="bg-cream-50 p-1 rounded-lg h-full ">
                          <div className="relative aspect-[4/5] overflow-hidden rounded">
                            <ImageKitProvider urlEndpoint={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}`}>
                              <Image
                                src={photo.image}
                                alt={photo.alt}
                                fill
                                className="object-cover transition-transform duration-300 h-full ease-in-out"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                                quality={80}
                              />
                            </ImageKitProvider>
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            {/* Frame Label */}
                            <div className="absolute bottom-2 left-2 right-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                              <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                                <p className="text-xs font-medium text-charcoal-900 text-center">
                                  {photo.frameColor}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Frame Shadow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-wood-300/20 to-wood-700/20 rounded-xl pointer-events-none" />
                      </div>
                      {/* Floating Elements for some frames */}
                      {index % 3 === 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold-500 rounded-full opacity-80 animate-pulse" />
                      )}
                      {index % 4 === 0 && (
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-wood-300 rounded-full opacity-60" />
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </ReusableSwiper>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="shadow-custom-lg  rounded-2xl p-8 border border-green-500/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-charcoal-900 mb-4">
                Ready to Frame Your Photos?
              </h3>
              <p className="text-charcoal-800/70 mb-6">
                Upload your favorite photos and see them transformed into
                beautiful framed art. Professional quality, handcrafted with
                care.
              </p>
              <Button
                className=" text-white font-semibold px-8 py-3 rounded-xl"
                onClick={() => {
                  if (isMounted && typeof window !== "undefined") {
                    window.location.href = "/contact";
                  }
                }}
              >
                Start Your Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameItPhotoGallery;
