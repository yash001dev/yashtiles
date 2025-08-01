"use client";

import PhotoIcon from "@/assets/PhotoIcon";
import WaveSeparator from "@/assets/WaveSeparator";
import { Button } from "@/components/ui/button";
import { Image } from "@imagekit/next";
import { useState, useEffect } from 'react';


const FrameItHero = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-dark-green overflow-hidden">
      {/* Optimized background pattern using CSS instead of inline SVG */}
      <div className="absolute  opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5F1EA' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 pt-7 pb-12 md:pt-0 md:pb-0  relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-1 md:space-y-4">
                <h1 className="leading-relaxed text-lg md:text-xl max-w-lg mx-auto lg:mx-0 font-semibold">Frame Your Moments</h1>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight py-3 md:py-0">
                  Transform Your
                  <span className="text-primary block">Memories</span>
                  Into Stunning Wall Art
                </h2>
                <p className="text-lg md:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Make every moment special with our online photo frame maker
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className=" text-white font-semibold px-10 py-8 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    if (isMounted && typeof window !== 'undefined') {
                      window.location.href = "/frame";
                    }
                  }}
                >
                  Start Framing
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-pink-800 text-black hover:bg-pink-700 hover:text-cream-50 font-semibold px-10 py-[30px] text-lg rounded-xl transition-all duration-300"
                  onClick={() => {
                    if (isMounted && typeof window !== 'undefined' && typeof document !== 'undefined') {
                      const element = document.querySelector("#work");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  See Our Work
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-wood-400 to-wood-600 border-2 border-cream-50 flex items-center justify-center"
                      >
                        <span className="text-xs text-white">★</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    500+ Happy Customers
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative mx-auto max-w-lg">
                {/* Main frame mockup */}
                <div className="relative bg-wood-300 p-6 rounded-lg shadow-2xl transform rotate-3 hover:rotate-1 transition-transform duration-500">
                  <div className="bg-cream-50 p-4 rounded">
                    <div className="aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-300 rounded flex items-center justify-center">
                      <div className="text-center text-slate-600">
                        <div className="w-16 h-16 mx-auto mb-3 bg-slate-400 rounded-full flex items-center justify-center">
                         <PhotoIcon/>
                        </div>
                        <p className="text-sm font-medium">Your Photo Here</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating smaller frames */}
                <div className="absolute -top-4 -left-4 bg-wood-600 p-3 rounded shadow-lg transform -rotate-12">
                  <div className="w-20 h-20 bg-cream-100 rounded flex items-center justify-center">
                  <Image
                   urlEndpoint={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}`}
                      src={`/happy-family.jpg`}
                      alt="Family Photo"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-2 -right-6 bg-wood-600 p-3 rounded shadow-lg transform rotate-12">
                  <div className="w-24 h-16 bg-cream-100 rounded flex items-center justify-center">
                  <Image
                   urlEndpoint={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}`}
                      src={`/mountains.jpg`}
                      alt="Two Friends Photo"
                      width={80}
                      height={80}

                      className="w-[100px] h-[65px] overflow-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
      </div>

      {/* Bottom wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
       <WaveSeparator/>
      </div>
      
    </section>
  );
};

export default FrameItHero;
