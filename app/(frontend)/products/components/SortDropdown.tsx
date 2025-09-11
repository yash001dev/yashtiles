"use client";
import { SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface SortDropdownProps {
  currentSort: string;
  currentCategory: string;
  currentSearch: string;
  currentView: 'grid' | 'list';
}

const buildUrl = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== 'all' && value !== '') {
      searchParams.set(key, value);
    }
  });
  const query = searchParams.toString();
  return `/products${query ? `?${query}` : ''}`;
};

export default function SortDropdown({
  currentSort,
  currentCategory,
  currentSearch,
  currentView,
}: SortDropdownProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    router.push(
      buildUrl({
        category: currentCategory,
        search: currentSearch,
        sort,
        view: currentView,
      })
    );
  };

  return (
    <div className="flex items-center gap-2">
      {/* <SlidersHorizontal className="w-4 h-4 text-gray-500" /> */}
      <select
        name="sort"
        value={currentSort}
        onChange={handleChange}
        className="border bg-transparent focus-visible:outline-none border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
      >
        <option value="name">Name A-Z</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
  );
}
