import React from 'react';
import { Grid, Frame, Maximize, Palette, Square, Plus } from 'lucide-react';

interface ToolbarProps {
  onToolClick: (tool: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToolClick }) => {
  const tools = [
    { id: 'material', icon: Grid, label: 'Material' },
    { id: 'frame', icon: Frame, label: 'Frame' },
    { id: 'size', icon: Maximize, label: 'Size' },
    { id: 'effect', icon: Palette, label: 'Effect' },
    { id: 'border', icon: Square, label: 'Border' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-6 sm:space-x-8">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onToolClick(tool.id)}
                className="flex flex-col items-center space-y-1 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                <tool.icon 
                  size={24} 
                  className="text-gray-600 group-hover:text-gray-800 transition-colors duration-200"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-800 font-medium">
                  {tool.label}
                </span>
              </button>
            ))}
            
            <div className="w-px h-10 bg-gray-200 mx-2" />
            
            <button className="flex flex-col items-center space-y-1 p-2 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors duration-200">
              <Plus size={24} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;