import React from 'react';
import { Grid, Frame, Maximize, Palette, Square, Plus, Sparkles } from 'lucide-react';

interface ToolbarProps {
  onToolClick: (tool: string) => void;
  hasImage?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToolClick, hasImage = false }) => {
  const tools = [
    { id: 'material', icon: Grid, label: 'Material', color: 'text-blue-600' },
    { id: 'frame', icon: Frame, label: 'Frame', color: 'text-green-600' },
    { id: 'size', icon: Maximize, label: 'Size', color: 'text-purple-600' },
    { id: 'effect', icon: Palette, label: 'Effect', color: 'text-orange-600' },
    { id: 'border', icon: Square, label: 'Border', color: 'text-red-600' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8">
            {tools.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => onToolClick(tool.id)}
                className="flex flex-col items-center space-y-1 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group transform hover:scale-110 active:scale-95"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: hasImage ? 'slideUpToolbar 0.5s ease-out forwards' : 'none'
                }}
              >
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:shadow-lg ${
                  tool.id === 'material' ? 'group-hover:bg-blue-50' :
                  tool.id === 'frame' ? 'group-hover:bg-green-50' :
                  tool.id === 'size' ? 'group-hover:bg-purple-50' :
                  tool.id === 'effect' ? 'group-hover:bg-orange-50' :
                  'group-hover:bg-red-50'
                }`}>
                  <tool.icon 
                    size={20} 
                    className={`transition-all duration-300 group-hover:scale-110 ${
                      tool.color
                    } group-hover:drop-shadow-sm`}
                  />
                </div>
                <span className="text-xs text-gray-600 group-hover:text-gray-800 font-medium transition-colors duration-300">
                  {tool.label}
                </span>
              </button>
            ))}
            
            {/* Separator */}
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2" />
            
            {/* Add to Cart Button */}
            <button 
              className="flex flex-col items-center space-y-1 p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl group"
              style={{
                animationDelay: '500ms',
                animation: hasImage ? 'bounceIn 0.6s ease-out forwards' : 'none'
              }}
            >
              <div className="relative">
                <Plus size={24} className="text-white transition-transform duration-300 group-hover:rotate-90" />
                <Sparkles size={12} className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUpToolbar {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Toolbar;