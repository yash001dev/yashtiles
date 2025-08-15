'use client';

import React, { useEffect, useState } from 'react';
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
  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/materials?where[available][equals]=true&sort=sortOrder`);
        if (!res.ok) throw new Error('Failed to fetch materials');
        const data = await res.json();
        const mapped: MaterialOption[] = (data?.docs || []).map((m: any) => ({
          id: m.id,
          name: m.name,
          description: m.description,
          content: m.content || '',
          link: m.link || '',
          image: (m as any).image || '',
        }));
        if (isMounted) setMaterials(mapped);
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to load materials');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = (materialId: FrameCustomization['material']) => {
    onSelect(materialId);
    // onClose();
  };

  if (loading) {
    return (
      <ResponsiveBottomSheet 
        isOpen={isOpen} 
        onClose={onClose} 
        childClassName='!overflow-y-visible'
        title="Select Material"
        description="Loading materials..."    >
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
        title="Select Material"
        description="Error loading materials"    >
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
      title="Select Material"
      description="Choose the perfect material for your frame"    >
      <div className="space-y-4 mt-[0.4rem]">
        {materials.map((material: MaterialOption) => (
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
                {material.image ? (
                  <img
                    src={material.image}
                    alt={material.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {material.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {material.description}
                </p>
              </div>

              <TooltipCard
                content={material?.content ?? ''}
                link={material?.link ?? ''}
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