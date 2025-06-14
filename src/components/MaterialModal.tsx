import React from 'react';
import { X, Info } from 'lucide-react';
import { MaterialOption, FrameCustomization } from '../types';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMaterial: FrameCustomization['material'];
  onSelect: (material: FrameCustomization['material']) => void;
}

const MaterialModal: React.FC<MaterialModalProps> = ({
  isOpen,
  onClose,
  currentMaterial,
  onSelect,
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Select Material</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {materials.map((material) => (
              <button
                key={material.id}
                onClick={() => handleSelect(material.id)}
                className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                  currentMaterial === material.id
                    ? 'border-pink-500 ring-2 ring-pink-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-square">
                  <img
                    src={material.image}
                    alt={material.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-medium text-sm mb-1">
                    {material.name}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {material.description}
                  </p>
                </div>

                {currentMaterial === material.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}

                <button className="absolute top-3 left-3 p-1 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Info size={16} className="text-white" />
                </button>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialModal;