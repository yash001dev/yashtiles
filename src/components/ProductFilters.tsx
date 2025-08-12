'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const filterCategories = [
  {
    name: 'Material',
    options: [
      { label: 'Classic Frame', value: 'classic' },
      { label: 'Frameless', value: 'frameless' },
      { label: 'Canvas', value: 'canvas' },
    ],
  },
  {
    name: 'Size',
    options: [
      { label: '8" × 8"', value: '8x8' },
      { label: '8" × 11"', value: '8x11' },
      { label: '11" × 8"', value: '11x8' },
      { label: '12" × 12"', value: '12x12' },
      { label: '16" × 20"', value: '16x20' },
    ],
  },
  {
    name: 'Frame Color',
    options: [
      { label: 'Black', value: 'black' },
      { label: 'White', value: 'white' },
      { label: 'Oak', value: 'oak' },
      { label: 'Walnut', value: 'walnut' },
      { label: 'Silver', value: 'silver' },
    ],
  },
  {
    name: 'Price Range',
    options: [
      { label: 'Under $25', value: '0-25' },
      { label: '$25 - $50', value: '25-50' },
      { label: '$50 - $100', value: '50-100' },
      { label: 'Over $100', value: '100+' },
    ],
  },
]

export default function ProductFilters() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Material', 'Size'])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    )
  }

  const toggleFilter = (categoryName: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [categoryName]: prev[categoryName]?.includes(value)
        ? prev[categoryName].filter(v => v !== value)
        : [...(prev[categoryName] || []), value]
    }))
  }

  const clearFilters = () => {
    setSelectedFilters({})
  }

  const hasActiveFilters = Object.values(selectedFilters).some(filters => filters.length > 0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {filterCategories.map((category) => (
          <div key={category.name} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <button
              onClick={() => toggleCategory(category.name)}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="font-medium text-gray-900">{category.name}</h4>
              {expandedCategories.includes(category.name) ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </button>

            {expandedCategories.includes(category.name) && (
              <div className="mt-4 space-y-3">
                {category.options.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFilters[category.name]?.includes(option.value) || false}
                      onChange={() => toggleFilter(category.name, option.value)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}