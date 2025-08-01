'use client';

import React from 'react';
import { ResponsiveBottomSheet } from './ResponsiveBottomSheet';
import { HangOption, FrameCustomization } from '../types';
import TooltipCard from './common/TooltipCard';
import { Image } from '@imagekit/next';

interface HangBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentHangType: FrameCustomization['hangType'];
  onSelect: (hangType: FrameCustomization['hangType']) => void;
}

const hangOptions: HangOption[] = [
  {
    id: 'stickable_tape',
    name: 'Stickable Tape',
    image: 'stickable-hook.webp', // Replace with actual image
    description: '₹0',
    content:
      'Our unique offering. A stackable tape that you just have to peel off the backing and stick on your wall, it just works!',
    price: 0,
  },
  {
    id: 'standard_hook',
    name: 'Standard Hook',
    image: 'standard-hook.webp', // Replace with actual image
    description: '₹0',
    content:
      'A classic trusted option for those looking for a solid solution. Hang them on nails with ease with our hook type frames.',
    price: 0,
  },
];

const HangBottomSheet: React.FC<HangBottomSheetProps> = ({
  isOpen,
  onClose,
  currentHangType,
  onSelect,
}) => {
  const handleSelect = (hangType: FrameCustomization['hangType']) => {
    onSelect(hangType);
    // onClose();
  };
  return (
    <ResponsiveBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      childClassName='!overflow-y-visible'
      title="Select Hang"
      description="Choose how you want to hang your frame"
    >
      <div className="space-y-4 mt-[0.4rem]">
        {hangOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`relative group rounded-xl border-2 transition-all duration-300 transform hover:scale-105 w-full ${
              currentHangType === option.id
                ? 'border-pink-500 ring-2 ring-pink-200 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-4 p-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  urlEndpoint={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}`}
                  src={option.image}
                  width={100}
                  height={100}
                  alt={option.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {option.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {option.description}
                </p>
              </div>
              <TooltipCard
                // title={material.name}
                content={option?.content ?? ""}
                // link={option?.link ?? ""}
                pageName="Hang"
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

export default HangBottomSheet; 