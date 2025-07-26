'use client';

import React from 'react';
import { ResponsiveBottomSheet } from './ResponsiveBottomSheet';
import { MaterialOption, FrameCustomization } from '../types';
import TooltipCard from './common/TooltipCard';

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
      content: 'Timeless, premium look, printed on superios paper. Available in regular and wide frame options. ',
      link: 'https://www.freepik.com/search?format=search&last_filter=query&last_value=Classic+Frames&query=Classic+Frames',
    },
    {
      id: 'frameless',
      name: 'Frameless',
      image: 'https://images.pexels.com/photos/1090641/pexels-photo-1090641.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Clean, modern look',
      content: 'Clean, modern look, printed on superios paper. with easy magenetic mounting. ',
      link: 'https://www.freepik.com/search?format=search&last_filter=query&last_value=Frameless+Frames&query=Frameless+Frames',
    },
    {
      id: 'canvas',
      name: 'Canvas',
      image: 'https://images.pexels.com/photos/1090644/pexels-photo-1090644.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Textured canvas finish',
      content:"wooden structure used to stretch and hold a canvas taut, providing a sturdy surface for painting and a way to display your artwork.",
      link: 'https://www.freepik.com/search?format=search&last_filter=query&last_value=Canvas+Frames&query=Canvas+Frames',
    },
  ];

  const handleSelect = (materialId: FrameCustomization['material']) => {
    onSelect(materialId);
    // onClose();
  };
  return (
    <ResponsiveBottomSheet 
      isOpen={isOpen} 
      onClose={onClose} 
      childClassName='!overflow-y-visible'
      title="Select Material"
      description="Choose the perfect material for your frame"    >
      <div className="space-y-4 mt-[0.4rem]">
        {materials.map((material) => (
          <button
            key={material.id}
            onClick={() => handleSelect(material.id)}
            className={`relative group rounded-xl border-2 transition-all duration-300 transform hover:scale-105 w-full ${
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

              {/* {currentMaterial === material.id && (
                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )} */}

              {/* <button className="p-2 bg-gray-100 rounded-full ">
                <Info size={16} className="text-gray-600" />
              </button> */}
              <TooltipCard
                // title={material.name}
                content={material?.content ?? ""}
                link={material?.link ?? ""}
                pageName="Material"
                className="z-[9999] w-full"
                iconClassName="text-pink-600"
                iconSize={24}
              />
            </div>
          </button>
        ))}
      </div>
    </ResponsiveBottomSheet>
  );
};

export default MaterialBottomSheet;