'use client';

import React, { useState } from "react";
import { Image as ImageIcon, Palette } from "lucide-react";
import { ResponsiveBottomSheet } from "./ResponsiveBottomSheet";

interface BackgroundOption {
  id: string;
  name: string;
  image: string;
  preview: string;
}

interface BackgroundBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentBackground: string;
  onBackgroundUpdate: (backgroundImage: string) => void;
}

const BackgroundBottomSheet: React.FC<BackgroundBottomSheetProps> = ({
  isOpen,
  onClose,
  currentBackground,
  onBackgroundUpdate,
}) => {
  const backgroundOptions: BackgroundOption[] = [
    {
      id: "framedecor1",
      name: "Frame Workshop",
      image: "/framedecor1.png",
      preview: "bg-gradient-to-br from-amber-100 to-orange-200",
    },
    {
      id: "framedecor2", 
      name: "Artist Studio",
      image: "/framedecor2.png",
      preview: "bg-gradient-to-br from-blue-100 to-indigo-200",
    },
    {
      id: "framedecor",
      name: "Classic Gallery",
      image: "/framedecor.png",
      preview: "bg-gradient-to-br from-gray-100 to-slate-200",
    },
    {
      id: "none",
      name: "No Background",
      image: "",
      preview: "bg-white border-2 border-gray-200",
    },
  ];

  const handleBackgroundSelect = (backgroundImage: string) => {
    onBackgroundUpdate(backgroundImage);
  };

  return (
    <ResponsiveBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Select Background"
      description="Choose a background to enhance your frame preview"
    >
      <div className="space-y-6">
        {/* Preview */}
        <div className="flex justify-center">
          <div className="relative">
            <div 
              className="w-32 h-32 rounded-lg shadow-lg overflow-hidden border-2 border-gray-200"
              style={{
                backgroundImage: currentBackground ? `url(${currentBackground})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {!currentBackground && (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon size={24} className="text-gray-400" />
                </div>
              )}
              {/* Sample frame overlay */}
              <div className="absolute inset-4 bg-white border-4 border-gray-800 rounded shadow-lg">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Frame</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Options */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Palette size={18} className="mr-2" />
            Background Images
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {backgroundOptions.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleBackgroundSelect(option.image)}
                className={`relative group p-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                  currentBackground === option.image
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: "fadeInScale 0.5s ease-out forwards",
                }}
              >
                <div className="space-y-2">
                  {/* Background Preview */}
                  <div 
                    className={`w-full h-16 rounded-lg shadow-sm relative overflow-hidden ${option.preview}`}
                    style={{
                      backgroundImage: option.image ? `url(${option.image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {option.id === "none" && (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={16} className="text-gray-400" />
                      </div>
                    )}
                    {/* Mini frame overlay */}
                    {/* <div className="absolute inset-2 bg-white border border-gray-600 rounded-sm">
                      <div className="w-full h-full bg-gray-100"></div>
                    </div> */}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-700">
                      {option.name}
                    </p>
                  </div>
                </div>

                {currentBackground === option.image && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Upload Option */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Custom Background</h3>
          <button
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 flex flex-col items-center space-y-2"
          >
            <ImageIcon size={24} className="text-gray-400" />
            <span className="text-sm text-gray-600">Upload Custom Background</span>
            <span className="text-xs text-gray-500">Coming Soon</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </ResponsiveBottomSheet>
  );
};

export default BackgroundBottomSheet;
