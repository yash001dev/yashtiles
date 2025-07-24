'use client';

import React from "react";
import { Plus } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useAuth } from "../contexts/AuthContext";

interface FloatingAddButtonProps {
  onAddFrame: () => void;
  hasFrames: boolean;
  hasImage: boolean;
  onAuthRequired?: () => void;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  onAddFrame,
  hasFrames,
  hasImage,
  onAuthRequired,
}) => {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired();
      return;
    }
    onAddFrame();
  };
  // Show on mobile when user has an image
  if (!isMobile || !hasImage) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-50 flex items-center justify-center group ${
        hasFrames ? "opacity-80 hover:opacity-100" : "opacity-100"
      }`}
      aria-label="Add Frame"
    >
      {" "}
      <Plus className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
      {/* Pulse animation - only show when no frames exist */}
      {!hasFrames && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-ping opacity-20"></div>
      )}
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {isAuthenticated ? "Add Frame" : "Login to Add Frame"}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </button>
  );
};

export default FloatingAddButton;
