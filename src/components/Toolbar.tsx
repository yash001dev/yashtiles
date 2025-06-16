import React from 'react';
import { Grid, Frame, Maximize, Palette, Square, Plus, Sparkles } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ToolbarProps {
  onToolClick: (tool: string) => void;
  hasImage?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToolClick, hasImage = false }) => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  
  const tools = [
    { id: 'material', icon: Grid, label: 'Material', color: 'text-blue-600' },
    { id: 'frame', icon: Frame, label: 'Frame', color: 'text-green-600' },
    { id: 'size', icon: Maximize, label: 'Size', color: 'text-purple-600' },
    { id: 'effect', icon: Palette, label: 'Effect', color: 'text-orange-600' },
    { id: 'border', icon: Square, label: 'Border', color: 'text-red-600' },
  ];

  if (isLargeScreen) {
    // Desktop layout - floating toolbar positioned in the center-right
    return (
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 backdrop-blur-lg bg-opacity-95">
          <div className="flex flex-col space-y-3">
            {tools.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => onToolClick(tool.id)}
                className="group flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[140px]"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: hasImage ? 'slideInRight 0.5s ease-out forwards' : 'none'
                }}
                title={tool.label}
              >
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:shadow-md ${
                  tool.id === 'material' ? 'group-hover:bg-blue-50' :
                  tool.id === 'frame' ? 'group-hover:bg-green-50' :
                  tool.id === 'size' ? 'group-hover:bg-purple-50' :
                  tool.id === 'effect' ? 'group-hover:bg-orange-50' :
                  'group-hover:bg-red-50'
                }`}>
                  <tool.icon 
                    size={18} 
                    className={`transition-all duration-300 group-hover:scale-110 ${
                      tool.color
                    } group-hover:drop-shadow-sm`}
                  />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium transition-colors duration-300">
                  {tool.label}
                </span>
              </button>
            ))}
            
            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
            
            {/* Add to Cart Button */}
            <button 
              className="group flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-white"
              style={{
                animationDelay: '500ms',
                animation: hasImage ? 'bounceIn 0.6s ease-out forwards' : 'none'
              }}
              title="Add to Cart"
            >
              <div className="relative">
                <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90" />
                <Sparkles size={10} className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
              <span className="text-sm font-medium">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  // Mobile/tablet layout - bottom navigation
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl backdrop-blur-lg bg-opacity-95 z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-center py-2 sm:py-4">
          <div className="flex items-center justify-between w-full max-w-sm">
            {tools.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => onToolClick(tool.id)}
                className="flex flex-col items-center space-y-1 px-1 sm:px-2 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 group transform hover:scale-105 active:scale-95 min-w-0 flex-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: hasImage ? 'slideUpToolbar 0.5s ease-out forwards' : 'none'
                }}
              >
                <div className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 group-hover:shadow-lg ${
                  tool.id === 'material' ? 'group-hover:bg-blue-50' :
                  tool.id === 'frame' ? 'group-hover:bg-green-50' :
                  tool.id === 'size' ? 'group-hover:bg-purple-50' :
                  tool.id === 'effect' ? 'group-hover:bg-orange-50' :
                  'group-hover:bg-red-50'
                }`}>
                  <tool.icon 
                    size={18} 
                    className={`transition-all duration-300 group-hover:scale-110 ${
                      tool.color
                    } group-hover:drop-shadow-sm`}
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
              style={{
                animationDelay: '500ms',
                animation: hasImage ? 'bounceIn 0.6s ease-out forwards' : 'none'
              }}
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