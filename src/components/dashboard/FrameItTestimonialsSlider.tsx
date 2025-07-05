"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, NY",
    rating: 5,
    text: "Absolutely stunning quality! The frame perfectly complements our living room, and the photo looks like a piece of art. The whole process was seamless from upload to delivery.",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&q=80",
    photoType: "Family Portrait",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "San Francisco, CA",
    rating: 5,
    text: "I was skeptical about ordering frames online, but FrameIt exceeded all expectations. The craftsmanship is incredible, and my travel photos have never looked better.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&q=80",
    photoType: "Travel Photos",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    location: "Chicago, IL",
    rating: 5,
    text: "The customer service was outstanding! They helped me choose the perfect frame for my wedding photos. Now our hallway looks like a professional gallery.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&q=80",
    photoType: "Wedding Photos",
  },
  {
    id: 4,
    name: "David Thompson",
    location: "Austin, TX",
    rating: 5,
    text: "Fast shipping, perfect packaging, and the frame quality is top-notch. I've already ordered three more frames for different rooms. Highly recommend!",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&q=80",
    photoType: "Art Prints",
  },
  {
    id: 5,
    name: "Lisa Park",
    location: "Seattle, WA",
    rating: 5,
    text: "The preview feature is amazing - I could see exactly how my photo would look before ordering. The final product was even better than expected!",
    image:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face&q=80",
    photoType: "Pet Photos",
  },
];

const FrameItTestimonialsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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

  // Auto-advance slides only when visible
  useEffect(() => {
    if (!isAutoPlaying || !isVisible || !isMounted) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isVisible, isMounted]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <section className="py-20 bg-dark-green text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-white max-w-2xl mx-auto">
                Don&apos;t just take our word for it. Here&apos;s what real customers say
                about their FrameIt experience.
              </p>
            </div>
            <div className="animate-pulse h-96 bg-green-800 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-20 bg-dark-green text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what real customers say
              about their FrameIt experience.
            </p>
          </div>

          {/* Testimonials Slider */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0">
                    <div className="bg-white rounded-2xl p-8 md:p-12 mx-4 shadow-lg">
                      <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8 items-center">
                          {/* Quote and Rating */}
                          <div className="md:col-span-2">
                            <div className="flex items-center gap-1 mb-4">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-5 h-5 fill-primary"
                                  aria-hidden="true"
                                />
                              ))}
                            </div>

                            <Quote className="w-8 h-8 text-primary mb-4" aria-hidden="true" />

                            <blockquote className="text-lg md:text-xl text-charcoal-800 leading-relaxed mb-6">
                              &ldquo;{testimonial.text}&rdquo;
                            </blockquote>

                            <div className="flex items-center gap-4">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                <Image
                                  src={testimonial.image}
                                  alt={testimonial.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                  loading={index === 0 ? "eager" : "lazy"}
                                  quality={80}
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-charcoal-900">
                                  {testimonial.name}
                                </p>
                                <p className="text-sm text-charcoal-800/60">
                                  {testimonial.location}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Photo Type Badge */}
                          <div className="md:col-span-1 flex justify-center">
                            <div className="bg-gowilds-primary-dark text-white rounded-2xl p-6 text-center">
                              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <p className="font-semibold">
                                {testimonial.photoType}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
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
              className="absolute text-dark-green left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 text-dark-green -translate-y-1/2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameItTestimonialsSlider;
