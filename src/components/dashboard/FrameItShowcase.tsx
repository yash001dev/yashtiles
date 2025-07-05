"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const showcaseItems = [
  {
    id: 1,
    title: "Living Room Layout",
    description: "Modern family portrait in elegant wooden frame",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
    frameColor: "Natural Oak",
  },
  {
    id: 2,
    title: "Minimal Frame",
    description: "Clean lines for contemporary spaces",
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop",
    frameColor: "White Ash",
  },
  {
    id: 3,
    title: "Vintage Frame Set",
    description: "Classic collection with warm wood tones",
    image:
      "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=600&h=400&fit=crop",
    frameColor: "Walnut",
  },
  {
    id: 4,
    title: "Gallery Wall",
    description: "Mixed sizes creating stunning focal point",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
    frameColor: "Black Oak",
  },
  {
    id: 5,
    title: "Bedroom Accent",
    description: "Soft tones complementing bedroom decor",
    image:
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&h=400&fit=crop",
    frameColor: "Birch",
  },
];

const FrameItShowcase = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % showcaseItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length,
    );
  };

  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % showcaseItems.length;
      items.push(showcaseItems[index]);
    }
    return items;
  };

  return (
    <section id="work" className="py-20 bg-dark-green text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Our Work in Action
            </h2>
            <p className="text-lg  max-w-2xl mx-auto">
              See how our premium frames transform homes and create stunning
              focal points that bring joy every day.
            </p>
          </div>

          {/* Showcase Slider */}
          <div className="relative">
            {/* Main slider container */}
            <div className="overflow-hidden rounded-2xl">
              <div className="flex gap-6 transition-transform duration-500 ease-in-out">
                {getVisibleItems().map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative flex-shrink-0 w-full md:w-1/3 group cursor-pointer ${
                      index === 1
                        ? "md:scale-105 z-10"
                        : "md:scale-95 opacity-75"
                    } transition-all duration-500`}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="relative bg-white text-black p-4 rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                      <div className="shadow-lg p-3 rounded-lg">
                        <div className="relative aspect-[4/3] overflow-hidden rounded">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                          />

                          {/* Hover overlay */}
                          {hoveredItem === item.id && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                <ZoomIn className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 text-center">
                        <h3 className="text-lg font-bold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm  mb-2">
                          {item.description}
                        </p>
                        <span className="inline-block bg-dark-green text-white px-3 py-1 rounded-full text-xs font-medium">
                          {item.frameColor}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-primary backdrop-blur-sm border-0 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-primary backdrop-blur-sm border-0 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {showcaseItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-primary scale-125"
                      : "bg-green-600 hover:bg-primary"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          {/* <div className="text-center mt-12">
            <Button className=" text-white font-semibold px-8 py-3 rounded-xl">
              View Full Gallery
            </Button>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default FrameItShowcase;
