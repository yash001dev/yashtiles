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
  currentWallColor?: string;
  onWallColorUpdate?: (color: string) => void;
}

const BackgroundBottomSheet: React.FC<BackgroundBottomSheetProps> = ({
  isOpen,
  onClose,
  currentBackground,
  onBackgroundUpdate,
  currentWallColor = "#f3f4f6",
  onWallColorUpdate,
}) => {
  const [selectedType, setSelectedType] = useState<"image" | "color">("image");
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
      id: "framedecor3",
      name: "Office Gallery",
      image: "/framedecor3.png",
      preview: "bg-gradient-to-br from-gray-100 to-slate-200",
    },
    {
      id: "none",
      name: "No Background",
      image: "",
      preview: "bg-white border-2 border-gray-200",
    },
  ];

  const wallColors = [
    { id: "white", name: "White", color: "#ffffff" },
    { id: "lightGray", name: "Light Gray", color: "#f3f4f6" },
    { id: "gray", name: "Gray", color: "#9ca3af" },
    { id: "beige", name: "Beige", color: "#f5f5dc" },
    { id: "cream", name: "Cream", color: "#fefcf3" },
    { id: "lightBlue", name: "Light Blue", color: "#dbeafe" },
    { id: "lightGreen", name: "Light Green", color: "#dcfce7" },
    { id: "lightPink", name: "Light Pink", color: "#fce7f3" },
    { id: "lavender", name: "Lavender", color: "#e9d5ff" },
    { id: "peach", name: "Peach", color: "#fed7aa" },
    { id: "mint", name: "Mint", color: "#a7f3d0" },
    { id: "sage", name: "Sage", color: "#d1fae5" },
  ];

  const handleBackgroundSelect = (backgroundImage: string) => {
    onBackgroundUpdate(backgroundImage);
    setSelectedType("image");
  };

  const handleWallColorSelect = (color: string) => {
    if (onWallColorUpdate) {
      onWallColorUpdate(color);
      // Clear image background when color is selected
      onBackgroundUpdate("");
      setSelectedType("color");
    }
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
                backgroundColor: selectedType === "color" ? currentWallColor : "transparent",
                backgroundImage: selectedType === "image" && currentBackground ? `url(${currentBackground})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {!currentBackground && selectedType !== "color" && (
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

        {/* Background Type Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Background Type</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedType("image")}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                selectedType === "image"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <ImageIcon size={16} className="text-gray-600" />
                <span className="text-sm font-medium">Image</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedType("color")}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                selectedType === "color"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Palette size={16} className="text-gray-600" />
                <span className="text-sm font-medium">Color</span>
              </div>
            </button>
          </div>
        </div>

        {/* Background Options */}
        {selectedType === "image" && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <ImageIcon size={18} className="mr-2" />
              Background Images
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {backgroundOptions.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleBackgroundSelect(option.image)}
                  className={`relative group p-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    currentBackground === option.image && selectedType === "image"
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
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-700">
                        {option.name}
                      </p>
                    </div>
                  </div>
                    
                  {/* Checkmark for selected background we do for second version */}
                  {/* {currentBackground === option.image && selectedType === "image" && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )} */}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wall Color Options */}
        {selectedType === "color" && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Palette size={18} className="mr-2" />
              Wall Colors
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {wallColors.map((color, index) => (
                <button
                  key={color.id}
                  onClick={() => handleWallColorSelect(color.color)}
                  className={`relative group p-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    currentWallColor === color.color && selectedType === "color"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    animationDelay: `${index * 30}ms`,
                    animation: "fadeInScale 0.5s ease-out forwards",
                  }}
                >
                  <div className="space-y-2">
                    {/* Color Preview */}
                    <div 
                      className="w-full h-12 rounded-lg shadow-sm border border-gray-200"
                      style={{ backgroundColor: color.color }}
                    >
                      {/* Mini frame overlay */}
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-6 h-4 bg-white border border-gray-600 rounded-sm shadow-sm"></div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-700">
                        {color.name}
                      </p>
                    </div>
                  </div>
                    {/* Checkmark for selected background we do for second version */}
                  {/* {currentWallColor === color.color && selectedType === "color" && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )} */}
                </button>
              ))}
            </div>

            {/* Custom Color Picker */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={currentWallColor}
                  onChange={(e) => handleWallColorSelect(e.target.value)}
                  className="w-12 h-10 rounded-lg border-2 border-gray-300 cursor-pointer appearance-none focus:outline-none focus:ring-0 focus:border-gray-300"
                  style={{
                    background: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                  }}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={currentWallColor}
                    onChange={(e) => handleWallColorSelect(e.target.value)}
                    placeholder="#ffffff"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Upload Option */}
        {selectedType === "image" && (
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
        )}
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
