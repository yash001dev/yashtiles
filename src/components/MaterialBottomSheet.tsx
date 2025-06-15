import React from 'react';
import BottomSheet from './BottomSheet';
import { MaterialOption, FrameCustomization } from '../types';

interface MaterialBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentMaterial: FrameCustomization['material'];
  onSelect: (material: FrameCustomization['material']) => void;
}

const MaterialBottomSheet: React.FC<MaterialBottomSheetProps> = ({
  isOpen,
  onClose,
  currentMaterial,
  onSelect,
}) => {
  const materials: MaterialOption[] = [
    {
      id: 'classic',
      name: 'Classic Frame',
      image: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Traditional frame with mounting',
    },
    {
      id: 'frameless',
      name: 'Frameless',
      image: 'https://images.pexels.com/photos/1090641/pexels-photo-1090641.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Clean, modern look',
    },
    {
      id: 'canvas',
      name: 'Canvas',
      image: 'https://images.pexels.com/photos/1090644/pexels-photo-1090644.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Textured canvas finish',
    },
  ];

  const handleSelect = (materialId: FrameCustomization['material']) => {
    onSelect(materialId);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Material" height="compact">
      <div className="px-4 pb-4">
        {/* Horizontal Scrolling Material Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-3 min-w-max">
            {materials.map((material, index) => (
              <button
                key={material.id}
                onClick={() => handleSelect(material.id)}
                className={`flex-shrink-0 w-32 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                  currentMaterial === material.id
                    ? 'border-pink-500 ring-2 ring-pink-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="h-20 overflow-hidden">
                  <img
                    src={material.image}
                    alt={material.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                
                <div className="p-3 bg-white">
                  <h3 className="font-medium text-gray-900 text-sm mb-1">
                    {material.name}
                  </h3>
                  <p className="text-gray-600 text-xs">
                    {material.description}
                  </p>
                </div>

                {currentMaterial === material.id && (
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

export default MaterialBottomSheet;