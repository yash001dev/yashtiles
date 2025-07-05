"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const galleryPhotos = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=400&h=500&fit=crop&q=80",
    frameColor: "Natural Wood",
    alt: "Beautiful landscape in natural wood frame",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=500&fit=crop&q=80",
    frameColor: "Autumn Leaves",
    alt: "Autumn leaves in warm wood frame",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&q=80",
    frameColor: "Portrait Frame",
    alt: "Portrait in elegant wood frame",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop&q=80",
    frameColor: "Mountain View",
    alt: "Mountain landscape in premium frame",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=500&fit=crop&q=80",
    frameColor: "Pet Portrait",
    alt: "Cute pet portrait in custom frame",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1502780402662-acc01917174e?w=400&h=500&fit=crop&q=80",
    frameColor: "Beach Memories",
    alt: "Beach scene in coastal frame",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=500&fit=crop&q=80",
    frameColor: "City Lights",
    alt: "City skyline in modern frame",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=400&h=500&fit=crop&q=80",
    frameColor: "Forest Frame",
    alt: "Forest path in rustic frame",
  },
];

const FrameItPhotoGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slidesToShow, setSlidesToShow] = useState(5);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Prevent hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Intersection Observer for performance
  useEffect(() => {
    if (!isMounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isMounted]);

  // Responsive slides calculation
  useEffect(() => {
    if (!isMounted) return;

    const updateSlidesToShow = () => {
      if (typeof window === 'undefined') return;
      
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 768) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(3);
      } else if (window.innerWidth < 1280) {
        setSlidesToShow(4);
      } else {
        setSlidesToShow(5);
      }
    };

    updateSlidesToShow();
    const handleResize = () => updateSlidesToShow();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMounted]);

  // Auto-advance slides only when visible
  useEffect(() => {
    if (!isAutoPlaying || !isVisible || !isMounted) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = galleryPhotos.length - slidesToShow;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slidesToShow, isVisible, isMounted]);

  const nextSlide = () => {
    const maxIndex = galleryPhotos.length - slidesToShow;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    const maxIndex = galleryPhotos.length - slidesToShow;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const getVisiblePhotos = () => {
    const photos = [];
    for (let i = 0; i < slidesToShow; i++) {
      const index = (currentIndex + i) % galleryPhotos.length;
      photos.push(galleryPhotos[index]);
    }
    return photos;
  };

  const maxDots = Math.ceil(galleryPhotos.length - slidesToShow + 1);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
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
    <section ref={sectionRef} className="py-20 bg-white overflow-hidden">
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

          {/* Photo Gallery Slider */}
          <div className="relative">
            <div className="rounded-2xl">
              <div
                className="flex transition-transform duration-700 ease-in-out gap-6"
                style={{
                  transform: `translateX(-${currentIndex * (100 / slidesToShow) + currentIndex * (1 / slidesToShow)}%)`,
                  width: `${(galleryPhotos.length / slidesToShow) * 100}%`,
                }}
              >
                {galleryPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="flex-shrink-0 group cursor-pointer"
                    style={{ width: `${100 / galleryPhotos.length}%` }}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                  >
                    {/* Frame Container */}
                    <div className="relative">
                      {/* Main Frame */}
                      <div className="bg-wood-500 p-4 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                        <div className="bg-cream-50 p-3 rounded-lg">
                          <div className="relative aspect-[4/5] overflow-hidden rounded">
                            <Image
                              src={photo.image}
                              alt={photo.alt}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                              priority={index < 3} // Priority load first 3 images
                              loading={index < 3 ? "eager" : "lazy"}
                              quality={80}
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Frame Label */}
                            <div className="absolute bottom-2 left-2 right-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
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
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(maxDots)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
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
                  if (isMounted && typeof window !== 'undefined') {
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
