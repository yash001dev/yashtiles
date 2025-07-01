import React from 'react';
import { X, Lightbulb } from 'lucide-react';

interface TutorialTooltipProps {
  show: boolean;
  onClose: () => void;
}

const TutorialTooltip: React.FC<TutorialTooltipProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-bounceIn">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold">New Features!</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-purple-600 font-semibold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Multiple Frames</h4>
              <p className="text-gray-600 text-sm">Create multiple frames with different settings and switch between them easily.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-purple-600 font-semibold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Quick Add</h4>
              <p className="text-gray-600 text-sm">Use <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+D</kbd> to quickly duplicate your current frame.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-purple-600 font-semibold text-sm">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Frame Details</h4>
              <p className="text-gray-600 text-sm">View detailed frame information and pricing in the sidebar (desktop) or cards (mobile).</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Got it!
            </button>          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialTooltip;
