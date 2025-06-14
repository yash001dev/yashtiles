import React from 'react';
import { X } from 'lucide-react';
import { FrameColorOption, FrameCustomization } from '../types';

interface FrameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFrame: FrameCustomization['frameColor'];
  onSelect: (frame: FrameCustomization['frameColor']) => void;
}

const FrameModal: React.FC<FrameModalProps> = ({
  isOpen,
  onClose,
  currentFrame,
  onSelect,
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Select Frame</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-pink-500 hover:text-pink-600 font-medium transition-colors duration-200"
            >
              Done
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {frameColors.map((frame) => (
              <button
                key={frame.id}
                onClick={() => handleSelect(frame.id)}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  currentFrame === frame.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg shadow-sm ${frame.color}`} />
                
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-900">{frame.name}</h3>
                  <p className="text-sm text-gray-500">{frame.description}</p>
                </div>

                {currentFrame === frame.id && (
                  <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameModal;