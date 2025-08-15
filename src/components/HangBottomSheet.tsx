'use client';

import React, { useEffect, useState } from 'react';
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

const HangBottomSheet: React.FC<HangBottomSheetProps> = ({
  isOpen,
  onClose,
  currentHangType,
  onSelect,
}) => {
  const [hangOptions, setHangOptions] = useState<HangOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/hang-options?where[available][equals]=true&sort=sortOrder`);
        if (!res.ok) throw new Error('Failed to fetch hang options');
        const data = await res.json();
        const mapped: HangOption[] = (data?.docs || []).map((h: any) => ({
          id: h.id,
          name: h.name,
          description: h.description,
          content: h.content || '',
          price: h.price ?? 0,
          image: (h as any).image || '',
        }));
        if (isMounted) setHangOptions(mapped);
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to load hang options');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = (hangType: FrameCustomization['hangType']) => {
    onSelect(hangType);
    onClose();
  };
  if (loading) {
    return (
      <ResponsiveBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        childClassName='!overflow-y-visible'
        title="Select Hang"
        description="Loading hang options..."
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      </ResponsiveBottomSheet>
    );
  }

  if (error) {
    return (
      <ResponsiveBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        childClassName='!overflow-y-visible'
        title="Select Hang"
        description="Error loading hang options"
      >
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </ResponsiveBottomSheet>
    );
  }
  return (
    <ResponsiveBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      childClassName='!overflow-y-visible'
      title="Select Hang"
      description="Choose how you want to hang your frame"
    >
      <div className="space-y-4 mt-[0.4rem]">
        {hangOptions.map((option: HangOption) => (
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
                {option.image ? (
                  <Image
                    urlEndpoint={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}`}
                    src={option.image}
                    width={100}
                    height={100}
                    alt={option.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
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
                content={option?.content ?? ''}
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