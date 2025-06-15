import React from 'react';
import BottomSheet from './BottomSheet';
import { FrameColorOption, FrameCustomization } from '../types';

interface FrameBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentFrame: FrameCustomization['frameColor'];
  onSelect: (frame: FrameCustomization['frameColor']) => void;
}

const FrameBottomSheet: React.FC<FrameBottomSheetProps> = ({
  isOpen,
  onClose,
  currentFrame,
  onSelect,
}) => {
  const frameColors: FrameColorOption[] = [
    {
      id: 'black',
      name: 'Black',
      color: 'bg-gray-900',
      description: 'Classic black finish',
    },
    {
      id: 'white',
      name: 'White',
      color: 'bg-white border border-gray-200',
      description: 'Clean white finish',
    },
    {
      id: 'oak',
      name: 'Oak',
      color: 'bg-gradient-to-br from-amber-100 to-amber-200',
      description: 'Natural wood grain',
    },
  ];

  const handleSelect = (frameId: FrameCustomization['frameColor']) => {
    onSelect(frameId);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Frame">
      <div className="p-6">
        <div className="space-y-3">
          {frameColors.map((frame, index) => (
            <button
              key={frame.id}
              onClick={() => handleSelect(frame.id)}
              className={`w-full flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                currentFrame === frame.id
                  ? 'border-pink-500 bg-pink-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isOpen ? 'bounceIn 0.5s ease-out forwards' : 'none'
              }}
            >
              <div className={`w-12 h-12 rounded-lg shadow-sm ${frame.color}`} />
              
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900">{frame.name}</h3>
                <p className="text-sm text-gray-500">{frame.description}</p>
              </div>

              {currentFrame === frame.id && (
                <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
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
    </BottomSheet>
  );
};

export default FrameBottomSheet;