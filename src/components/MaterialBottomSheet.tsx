import React from 'react';
import { Info } from 'lucide-react';
import { ResponsiveBottomSheet } from './ResponsiveBottomSheet';
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
    <ResponsiveBottomSheet 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Select Material"
      description="Choose the perfect material for your frame"    >
      <div className="space-y-4">
        {materials.map((material) => (
          <button
            key={material.id}
            onClick={() => handleSelect(material.id)}
            className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-300 transform hover:scale-105 w-full ${
              currentMaterial === material.id
                ? 'border-pink-500 ring-2 ring-pink-200 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-4 p-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={material.image}
                  alt={material.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {material.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {material.description}
                </p>
              </div>

              {currentMaterial === material.id && (
                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}

              <button className="p-2 bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Info size={16} className="text-gray-600" />
              </button>
            </div>
          </button>
        ))}
      </div>
    </ResponsiveBottomSheet>
  );
};

export default MaterialBottomSheet;