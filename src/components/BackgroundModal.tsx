import React, { useState } from 'react';
import { X, Image as ImageIcon, Palette } from 'lucide-react';

interface BackgroundOption {
  id: string;
  name: string;
  image: string;
  preview: string;
}

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBackground: string;
  onBackgroundUpdate: (backgroundImage: string) => void;
  currentWallColor?: string;
  onWallColorUpdate?: (color: string) => void;
}

const BackgroundModal: React.FC<BackgroundModalProps> = ({
  isOpen,
  onClose,
  currentBackground,
  onBackgroundUpdate,
  currentWallColor = "#f3f4f6",
  onWallColorUpdate,
}) => {
  const [selectedType, setSelectedType] = useState<"image" | "color">("image");
  
  if (!isOpen) return null;

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
    onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Background Options</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-pink-500 hover:text-pink-600 font-medium transition-colors duration-200"
            >
              Done
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Preview */}
          <div className="flex justify-center mb-6">
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

          <div className="space-y-3">
            {backgroundOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleBackgroundSelect(option.image)}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  currentBackground === option.image
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div 
                  className={`w-16 h-12 rounded-lg flex items-center justify-center relative overflow-hidden ${option.preview}`}
                  style={{
                    backgroundImage: option.image ? `url(${option.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {option.id === "none" && (
                    <ImageIcon size={16} className="text-gray-400" />
                  )}
                  {/* Mini frame overlay */}
                  <div className="absolute inset-1 bg-white border border-gray-600 rounded-sm">
                    <div className="w-full h-full bg-gray-100"></div>
                  </div>
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-900">{option.name}</h3>
                  <p className="text-sm text-gray-500">
                    {option.id === "none" ? "Clean, minimal look" : "Decorative background"}
                  </p>
                </div>

                {currentBackground === option.image && (
                  <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Upload Option */}
          <div className="mt-6">
            <button
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 flex flex-col items-center space-y-2"
            >
              <ImageIcon size={24} className="text-gray-400" />
              <span className="text-sm text-gray-600">Upload Custom Background</span>
              <span className="text-xs text-gray-500">Coming Soon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundModal;
