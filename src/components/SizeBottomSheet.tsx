'use client';

import React, { useEffect, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { ResponsiveBottomSheet } from "./ResponsiveBottomSheet";
import { SizeOption, FrameCustomization } from "../types";

interface SizeBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentSize: FrameCustomization["size"];
  onSelect: (size: FrameCustomization["size"]) => void;
}

const SizeBottomSheet: React.FC<SizeBottomSheetProps> = ({
  isOpen,
  onClose,
  currentSize,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sizes, setSizes] = useState<SizeOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/sizes?where[available][equals]=true&sort=sortOrder`);
        if (!res.ok) throw new Error('Failed to fetch sizes');
        const data = await res.json();
        const mapped: SizeOption[] = (data?.docs || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          dimensions: s.dimensions,
          aspectRatio: s.aspectRatio,
          price: s.price,
        }));
        if (isMounted) setSizes(mapped);
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to load sizes');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSizes = sizes.filter(
    (size) =>
      size.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      size.dimensions.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (sizeId: FrameCustomization["size"]) => {
    onSelect(sizeId);
    onClose();
  };

  if (loading) {
    return (
      <ResponsiveBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Select Size"
        description="Loading sizes..."
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
        title="Select Size"
        description="Error loading sizes"
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
      title="Select Size"
      description="Choose the perfect size for your photo"
    >
      <div className="space-y-4 py-2">
        {/* Search */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />{" "}
          <input
            type="text"
            placeholder="Search sizes..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              setSearchTerm(value);
            }}
            className="w-full bg-white pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-200"
          />
        </div>
        {/* Welcome Offer */}{" "}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-pink-700">WELCOME</span>
            <span className="text-sm text-gray-600">8 for ₹2000 (36% OFF)</span>
          </div>
        </div>
        {/* Size Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredSizes.map((size) => (
            <button
              key={size.id}
              onClick={() => handleSelect(size.id)}
              className={`relative group p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                currentSize === size.id
                  ? "border-pink-500 bg-pink-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {/* Size Preview */}
              <div className="flex items-center justify-center mb-3 h-12">
                <div
                  className={`bg-gray-300 rounded-sm shadow-sm transition-colors duration-200 ${
                    currentSize === size.id
                      ? "bg-pink-300"
                      : "group-hover:bg-gray-400"
                  }`}
                  style={{
                    width:
                      size.aspectRatio >= 1
                        ? "32px"
                        : `${32 * size.aspectRatio}px`,
                    height:
                      size.aspectRatio <= 1
                        ? "32px"
                        : `${32 / size.aspectRatio}px`,
                  }}
                />
              </div>
              {/* Size Info */}{" "}
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {size.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{size.dimensions}</p>
                <p className="text-sm font-medium text-pink-600">
                  ₹{size.price} each
                </p>
              </div>
              <ChevronRight
                size={16}
                className={`absolute top-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  currentSize === size.id ? "hidden" : ""
                }`}
              />
            </button>
          ))}
        </div>
        {filteredSizes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No sizes found matching your search.</p>
          </div>
        )}
      </div>
    </ResponsiveBottomSheet>
  );
};

export default SizeBottomSheet;
