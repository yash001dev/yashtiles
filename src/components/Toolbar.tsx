import React from 'react';
import { Grid, Frame, Maximize, Square, Plus, Sparkles, Crop, Trash2, Palette } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ToolbarProps {
  onToolClick: (tool: string) => void;
  onAddFrame?: () => void;
  hasImage?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToolClick, onAddFrame }) => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  
  const tools = [
    { id: 'frame', icon: Frame, label: 'Frame' },
    { id: 'material', icon: Grid, label: 'Color' },
    { id: 'size', icon: Maximize, label: 'Size' },
    { id: 'effect', icon: Sparkles, label: 'Finish' },
    { id: 'border', icon: Square, label: 'Hang' },
    { id: 'crop', icon: Crop, label: 'Crop' },
    { id: 'remove', icon: Trash2, label: 'Remove' },
  ];

  if (isLargeScreen) {
    // Desktop layout - clean left sidebar matching the design in image
    return (
      <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-100 z-40 flex flex-col">
        {/* Top section with main tools */}
        <div className="flex-1 flex flex-col pt-20 pb-4">
          <div className="flex flex-col space-y-6 px-3">            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onToolClick(tool.id)}
                className="group flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                title={tool.label}
              >
                <div className="p-2 rounded-lg transition-all duration-200 group-hover:bg-gray-100">
                  <tool.icon 
                    size={20} 
                    className="text-gray-600 group-hover:text-gray-900 transition-colors duration-200"
                  />
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-700 font-medium transition-colors duration-200">
                  {tool.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom section with upload area */}
        <div className="pb-8 px-3">
          {/* Upload button */}
          <button
            onClick={onAddFrame}
            className="group w-full flex flex-col items-center space-y-2 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
            title="Upload"
          >
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center group-hover:bg-purple-700 transition-colors duration-200">
              <Plus size={20} className="text-white" />
            </div>
            <span className="text-xs text-gray-600 group-hover:text-purple-700 font-medium transition-colors duration-200">
              Upload
            </span>
          </button>
        </div>
      </div>
    );
  }  // Mobile/tablet layout - bottom navigation
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl backdrop-blur-lg bg-opacity-95 z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-center py-2 sm:py-4">
          <div className="flex items-center justify-between w-full max-w-sm">
            {tools.slice(0, 5).map((tool) => (
              <button
                key={tool.id}
                onClick={() => onToolClick(tool.id)}
                className="flex flex-col items-center space-y-1 px-1 sm:px-2 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 group transform hover:scale-105 active:scale-95 min-w-0 flex-1"
              >
                <div className="p-1.5 sm:p-2 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:bg-gray-100">
                  <tool.icon 
                    size={18} 
                    className="text-gray-600 group-hover:text-gray-900 transition-all duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="text-xs text-gray-600 group-hover:text-gray-800 font-medium transition-colors duration-300 truncate text-center">
                  {tool.label}
                </span>
              </button>
            ))}
            
            {/* Add to Cart Button */}
            <button
              className="flex flex-col items-center space-y-1 p-2 sm:p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group ml-2 flex-shrink-0"
            >
              <div className="relative">
                <Plus size={20} className="text-white transition-transform duration-300 group-hover:rotate-90" />
                <Sparkles size={10} className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;