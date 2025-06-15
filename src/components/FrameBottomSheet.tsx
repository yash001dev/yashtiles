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
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Frame" height="compact">
      <div className="px-4 pb-4">
        {/* Horizontal Scrolling Frame Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-3 min-w-max">
            {frameColors.map((frame, index) => (
              <button
                key={frame.id}
                onClick={() => handleSelect(frame.id)}
                className={`flex-shrink-0 w-28 p-3 rounded-lg border-2 transition-all duration-200 ${
                  currentFrame === frame.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg shadow-sm mx-auto mb-2 ${frame.color}`} />
                
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{frame.name}</h3>
                  <p className="text-xs text-gray-500">{frame.description}</p>
                </div>

                {currentFrame === frame.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default FrameBottomSheet;