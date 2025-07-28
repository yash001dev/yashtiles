'use client';

import React from 'react';
import { Camera, Sparkles, Palette, Frame } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = "Processing your image..." 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 animate-fadeInUp">
        {/* Animated background gradient */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 opacity-50" />
        
        {/* Main content */}
        <div className="relative z-10 text-center">
          {/* Animated icon container */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center animate-pulse">
              <Camera className="w-10 h-10 text-white animate-bounce" />
            </div>
            
            {/* Floating sparkles */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-ping" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Palette className="w-5 h-5 text-pink-400 animate-pulse" />
            </div>
            <div className="absolute top-1/2 -right-6">
              <Frame className="w-4 h-4 text-purple-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Loading text */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Creating Your Frame
          </h3>
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full animate-progress" />
          </div>

          {/* Loading dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>

          {/* Subtle features list */}
          <div className="mt-6 text-xs text-gray-500 space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-1 h-1 bg-green-400 rounded-full" />
              <span>Optimizing image quality</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full" />
              <span>Preparing frame preview</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-1 h-1 bg-purple-400 rounded-full" />
              <span>Setting up customization tools</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <div className="w-8 h-8 border-2 border-pink-300 rounded-full animate-spin" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <div className="w-6 h-6 border-2 border-purple-300 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay; 