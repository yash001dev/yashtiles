"use client";

import React, { useState } from "react";
import {
  Grid,
  Frame,
  Maximize,
  Square,
  Plus,
  Sparkles,
  Palette,
  Image as ImageIcon,
  Info,
  GalleryHorizontal,
  Images,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "../contexts/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";

interface ToolbarProps {
  onToolClick: (tool: string) => void;
  onAddFrame?: () => void;
  onAuthRequired?: () => void;
  hasImage?: boolean;
  onMoreToggle?: (isOpen: boolean) => void; // New prop to communicate more state
}

const Toolbar: React.FC<ToolbarProps> = ({
  onToolClick,
  onAddFrame,
  onAuthRequired,
  hasImage,
  onMoreToggle,
}) => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const { isAuthenticated } = useAuth();
  const { trackEvent } = useAnalytics();
  const [showMore, setShowMore] = useState(false);

  const handleAddFrame = () => {
    // Track the add frame event
    trackEvent('Engagement', 'Button Click', 'Add Frame');
    
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired();
      return;
    }
    onAddFrame?.();
  };

  // Notify parent when more state changes
  React.useEffect(() => {
    onMoreToggle?.(showMore);
  }, [showMore, onMoreToggle]);

  const mainTools = [
    { id: "material", icon: Grid, label: "Material", color: "text-blue-600" },
    { id: "frame", icon: Frame, label: "Frame", color: "text-green-600" },
    { id: "size", icon: Maximize, label: "Size", color: "text-pink-600" },
    { id: "border", icon: Square, label: "Border", color: "text-red-600" },
  ];

  const moreTools = [
    { id: "background", icon: ImageIcon, label: "Background", color: "text-purple-600" },
    { id: "hang", icon: Images, label: "Hang", color: "text-pink-600" },
  ];
  if (isLargeScreen) {
    // Desktop layout - clean left sidebar starting after header
    return (
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-20 bg-white border-r border-gray-100 z-30 flex flex-col shadow-sm">
        {/* Top section with main tools */}
        <div className="flex-1 flex flex-col pt-4 pb-4">
          <div className="flex flex-col px-3">
            {/* Main Tools */}
            {mainTools.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => {
                trackEvent('Tool Usage', 'Tool Click', tool.id);
                onToolClick(tool.id);
              }}
                className="group flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95 relative"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: hasImage
                    ? "slideInLeft 0.5s ease-out forwards"
                    : "none",
                }}
              >
                {/* Custom tooltip positioned to the right */}
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {tool.label}
                </div>
                <div
                  className={`p-2 rounded-lg transition-all duration-300 group-hover:shadow-md ${
                    tool.id === "material"
                      ? "group-hover:bg-blue-50"
                      : tool.id === "frame"
                      ? "group-hover:bg-green-50"
                      : tool.id === "size"
                      ? "group-hover:bg-pink-50"
                      : tool.id === "border"
                      ? "group-hover:bg-red-50"
                      : "group-hover:bg-gray-50"
                  }`}
                >
                  <tool.icon
                    size={20}
                    className={`transition-all duration-300 group-hover:scale-110 ${tool.color} group-hover:drop-shadow-sm`}
                  />
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-700 font-medium transition-colors duration-300">
                  {tool.label}
                </span>
              </button>
            ))}

            {/* More Tools Section */}
            <div className="mt-2">
              {/* More Button */}
              <button
                onClick={() => setShowMore(!showMore)}
                className="group w-full flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95 relative"
              >
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {showMore ? "Less" : "More"}
                </div>
                <div className="p-2 rounded-lg transition-all duration-300 group-hover:shadow-md group-hover:bg-gray-50">
                  {showMore ? (
                    <ChevronUp size={20} className="text-gray-600 transition-all duration-300 group-hover:scale-110" />
                  ) : (
                    <MoreHorizontal size={20} className="text-gray-600 transition-all duration-300 group-hover:scale-110" />
                  )}
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-700 font-medium transition-colors duration-300">
                  {showMore ? "Less" : "More"}
                </span>
              </button>

              {/* Expandable More Tools */}
              {showMore && (
                <div className="mt-2 space-y-1">
                  {moreTools.map((tool, index) => (
                    <button
                      key={tool.id}
                      onClick={() => onToolClick(tool.id)}
                      className="group w-full flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95 relative"
                      style={{
                        animationDelay: `${(index + 4) * 100}ms`,
                        animation: "slideInLeft 0.3s ease-out forwards",
                      }}
                    >
                      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {tool.label}
                      </div>
                      <div
                        className={`p-2 rounded-lg transition-all duration-300 group-hover:shadow-md ${
                          tool.id === "background"
                            ? "group-hover:bg-purple-50"
                            : "group-hover:bg-pink-50"
                        }`}
                      >
                        <tool.icon
                          size={20}
                          className={`transition-all duration-300 group-hover:scale-110 ${tool.color} group-hover:drop-shadow-sm`}
                        />
                      </div>
                      <span className="text-xs text-gray-500 group-hover:text-gray-700 font-medium transition-colors duration-300">
                        {tool.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>{" "}
        {/* Bottom section with add frame button */}
        <div className="pb-8 px-3">
          {/* Add Frame button - smaller and correctly labeled */}
          <button
            onClick={handleAddFrame}
            className="group w-full flex flex-col items-center space-y-2 p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg relative"
            style={{
              animationDelay: "500ms",
              animation: hasImage ? "bounceIn 0.6s ease-out forwards" : "none",
            }}
          >
            {/* Tooltip positioned above the button */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {isAuthenticated ? "Add Frame" : "Login to Add Frame"}
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center group-hover:from-pink-600 group-hover:to-pink-700 transition-all duration-300 shadow-md group-hover:shadow-lg">
              <Plus
                size={16}
                className="text-white transition-transform duration-300 group-hover:rotate-90"
              />
            </div>
            <span className="text-xs text-gray-600 group-hover:text-pink-700 font-medium transition-colors duration-300">
              Add Frame
            </span>
          </button>
        </div>
      </div>
    );
  } // Mobile/tablet layout - bottom navigation with colors and animations
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl backdrop-blur-lg bg-opacity-95 z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-center py-2 sm:py-4">
          <div className="flex items-center justify-between w-full max-w-sm">
            {/* Main Tools */}
            {mainTools.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => onToolClick(tool.id)}
                className="flex flex-col items-center space-y-1 px-1 sm:px-2 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 group transform hover:scale-105 active:scale-95 min-w-0 flex-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: hasImage
                    ? "slideUpToolbar 0.5s ease-out forwards"
                    : "none",
                }}
              >
                <div
                  className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 group-hover:shadow-lg ${
                    tool.id === "material"
                      ? "group-hover:bg-blue-50"
                      : tool.id === "frame"
                      ? "group-hover:bg-green-50"
                      : tool.id === "size"
                      ? "group-hover:bg-pink-50"
                      : tool.id === "border"
                      ? "group-hover:bg-red-50"
                      : "group-hover:bg-gray-50"
                  }`}
                >
                  <tool.icon
                    size={18}
                    className={`transition-all duration-300 group-hover:scale-110 ${tool.color} group-hover:drop-shadow-sm`}
                  />
                </div>
                <span className="text-xs text-gray-600 group-hover:text-gray-800 font-medium transition-colors duration-300 truncate text-center">
                  {tool.label}
                </span>
              </button>
            ))}

            {/* More Button for Mobile */}
            <button
              onClick={() => setShowMore(!showMore)}
              className="flex flex-col items-center space-y-1 px-1 sm:px-2 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 group transform hover:scale-105 active:scale-95 min-w-0 flex-1"
            >
              <div className="p-1.5 sm:p-2 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:bg-gray-50">
                {showMore ? (
                  <ChevronUp size={18} className="text-gray-600 transition-all duration-300 group-hover:scale-110" />
                ) : (
                  <MoreHorizontal size={18} className="text-gray-600 transition-all duration-300 group-hover:scale-110" />
                )}
              </div>
              <span className="text-xs text-gray-600 group-hover:text-gray-800 font-medium transition-colors duration-300 truncate text-center">
                {showMore ? "Less" : "More"}
              </span>
            </button>

            {/* Add to Cart Button with enhanced animations */}
            <button
              className="hidden md:flex  flex-col items-center space-y-1 p-2 sm:p-3 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group ml-2 flex-shrink-0"
              style={{
                animationDelay: "600ms",
                animation: hasImage
                  ? "bounceIn 0.6s ease-out forwards"
                  : "none",
              }}
            >
              <div className="relative">
                <Plus
                  size={20}
                  className="text-white transition-transform duration-300 group-hover:rotate-90"
                />
                <Sparkles
                  size={10}
                  className="absolute -top-1 -right-1 text-yellow-300 animate-pulse"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Expandable More Tools for Mobile */}
        {showMore && (
          <div className="pb-4 px-2">
            <div className="flex items-center justify-center gap-4">
              {moreTools.map((tool, index) => (
                <button
                  key={tool.id}
                  onClick={() => onToolClick(tool.id)}
                  className="flex flex-col items-center space-y-1 px-2 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 group transform hover:scale-105 active:scale-95"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "slideUpToolbar 0.3s ease-out forwards",
                  }}
                >
                  <div
                    className={`p-2 rounded-lg transition-all duration-300 group-hover:shadow-lg ${
                      tool.id === "background"
                        ? "group-hover:bg-purple-50"
                        : "group-hover:bg-pink-50"
                    }`}
                  >
                    <tool.icon
                      size={18}
                      className={`transition-all duration-300 group-hover:scale-110 ${tool.color} group-hover:drop-shadow-sm`}
                    />
                  </div>
                  <span className="text-xs text-gray-600 group-hover:text-gray-800 font-medium transition-colors duration-300 text-center">
                    {tool.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
