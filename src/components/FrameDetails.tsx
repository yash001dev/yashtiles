import React from 'react';
import { FrameCustomization } from '../types';
import { Button } from './ui/button';
import { ShoppingCart, Hash, Palette, Square, Sparkles, Image } from 'lucide-react';

interface FrameDetailsProps {
  customization: FrameCustomization;
  onAddToCart?: () => void;
  className?: string;
}

const FrameDetails: React.FC<FrameDetailsProps> = ({ 
  customization, 
  onAddToCart,
  className = '' 
}) => {
  const getSizePrice = (size: string) => {
    const prices: Record<string, number> = {
      '8x8': 299,
      '8x10': 329,
      '10x8': 329,
      '9x12': 399,
      '12x9': 399,
      '12x12': 499,
      '12x18': 599,
      '18x12': 599,
      '18x18': 799,
      '18x24': 899,
      '24x18': 899,
      '24x32': 1299,
      '32x24': 1299,
    };
    return prices[size] || 399;
  };

  const getMaterialName = (material: string) => {
    const names: Record<string, string> = {
      classic: 'Classic',
      frameless: 'Frameless',
      canvas: 'Canvas'
    };
    return names[material] || 'Classic';
  };

  const getColorName = (color: string) => {
    const names: Record<string, string> = {
      black: 'Black',
      white: 'White',
      oak: 'Oak'
    };
    return names[color] || 'Black';
  };

  const getFinishName = (material: string) => {
    const finishes: Record<string, string> = {
      classic: 'Normal',
      frameless: 'Modern',
      canvas: 'Textured'
    };
    return finishes[material] || 'Normal';
  };

  const getHangType = (material: string) => {
    const hangTypes: Record<string, string> = {
      classic: 'Stickable Tape',
      frameless: 'Wall Mount',
      canvas: 'Hook Ready'
    };
    return hangTypes[material] || 'Stickable Tape';
  };

  const price = getSizePrice(customization.size);

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Frame Details</h2>
      
      <div className="space-y-4">
        {/* Frame Type */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Hash className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Frame</p>
            <p className="font-semibold text-gray-900">{getMaterialName(customization.material)}</p>
          </div>
        </div>

        {/* Color */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Color</p>
            <p className="font-semibold text-gray-900">{getColorName(customization.frameColor)}</p>
          </div>
        </div>        {/* Size */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Square className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Size</p>
            <p className="font-semibold text-gray-900">{customization.size.replace('x', '" X ')}"</p>
          </div>
        </div>

        {/* Finish */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Finish</p>
            <p className="font-semibold text-gray-900">{getFinishName(customization.material)}</p>
          </div>
        </div>

        {/* Hang Type */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Image className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Hang</p>
            <p className="font-semibold text-gray-900">{getHangType(customization.material)}</p>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-900">Item Price</span>
          <span className="text-2xl font-bold text-purple-600">₹{price}</span>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          <div className="flex justify-between">
            <span>Grand Total</span>
            <span className="font-semibold text-gray-900">₹{price}</span>
          </div>
        </div>
        
        <Button 
          onClick={onAddToCart}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default FrameDetails;
