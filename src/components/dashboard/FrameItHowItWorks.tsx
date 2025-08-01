"use client";

import {
  FrameIcon,
  ImageUpIcon,
  PackageCheckIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Image } from "@imagekit/next";

interface FrameItHowItWorksProps {
  onDesignClick?: () => void;
}

const FrameItHowItWorks: React.FC<FrameItHowItWorksProps> = ({
  onDesignClick,
}) => {
  const handleDesignClick = () => {
    if (onDesignClick) {
      onDesignClick();
    } else {
      // Default behavior - scroll to photo upload area if available
      document
        .querySelector(".photo-upload-area")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 md:py-20 bg-dark-green ">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal-900 mb-4 text-center">
              How It Works
            </h2>
          </div>
          {/* Two-column layout with text on left, image on right */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Left column - Text content */}
            <div className="w-full md:w-1/2 space-y-8">
              {/* Header */}

              {/* Process Steps */}
              <div className="grid gap-6">
                {/* Step 1 */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mb-4">
                    <ImageUpIcon className="text-white" />
                  </div>
                  <div className="ml-10">
                    <h3 className="text-xl font-bold text-charcoal-900 mb-2">
                      Upload Your Photo
                    </h3>
                    <p className="text-charcoal-800/70">
                      Upload a picture from phone, computer or laptop
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mb-4">
                    <FrameIcon className="text-white" />
                  </div>
                  <div className="ml-10">
                    <h3 className="text-xl font-bold text-charcoal-900 mb-2">
                      Choose a Frame
                    </h3>
                    <p className="text-charcoal-800/70">
                      Choose a Frame that best Complements Your Picture
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mb-4">
                    <PackageCheckIcon className="text-white" />
                  </div>
                  <div className="ml-10">
                    <h3 className="text-xl font-bold text-charcoal-900 mb-2">
                      Finally, Your Frame is Ready to Hang
                    </h3>
                    <p className="text-charcoal-800/70">
                      We Handmade Your frame and deliver it ready to hang
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8">
                <Button
                  size="lg"
                  className=" text-white font-semibold px-10 py-8 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.location.href = "/frame";
                    }
                  }}
                >
                  Start Framing Your Photo
                </Button>
              </div>
            </div>

            {/* Right column - Image */}
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <div className="relative">
                <Image
                  urlEndpoint={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}`}
                  src="/how-it-works.jpg"
                  alt="How it works"
                  width={500}
                  height={500}
                  // fill
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameItHowItWorks;
