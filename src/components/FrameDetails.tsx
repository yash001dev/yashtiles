import React from "react";
import { FrameCustomization, FrameItem } from "../types";
import { Button } from "./ui/button";
import {
  ShoppingCart,
  Hash,
  Palette,
  Square,
  Sparkles,
  Image,
} from "lucide-react";

interface FrameDetailsProps {
  frames: FrameItem[];
  customization?: FrameCustomization; // Fallback customization when no frames exist
  onAddToCart?: () => void;
  className?: string;
}

const FrameDetails: React.FC<FrameDetailsProps> = ({
  frames,
  customization,
  onAddToCart,
  className = "",
}) => {
  const getSizePrice = (size: string) => {
    const prices: Record<string, number> = {
      "8x8": 299,
      "8x10": 404,
      "10x8": 404,
      "9x12": 582,
      "12x9": 582,
      "12x12": 797,
      "12x18": 1218,
      "18x12": 1218,
      "18x18": 1900,
      "18x24": 2400,
      "24x18": 2400,
      "24x32": 4200,
      "32x24": 4200,
    };
    return prices[size] || 399;
  };

  const getMaterialName = (material: string) => {
    const names: Record<string, string> = {
      classic: "Classic",
      frameless: "Frameless",
      canvas: "Canvas",
    };
    return names[material] || "Classic";
  };

  const getColorName = (color: string) => {
    const names: Record<string, string> = {
      black: "Black",
      white: "White",
      oak: "Oak",
    };
    return names[color] || "Black";
  };

  const getFinishName = (material: string) => {
    const finishes: Record<string, string> = {
      classic: "Normal",
      frameless: "Modern",
      canvas: "Textured",
    };
    return finishes[material] || "Normal";
  };

  const getHangType = (material: string) => {
    const hangTypes: Record<string, string> = {
      stickable_tape: "Stickable Tape",
      standard_hook: "Standard Hook",
    };
    return hangTypes[material] || "Stickable Tape";
  };

  // Calculate total price for all frames
  const calculateTotalPrice = () => {
    return frames.reduce((total, frame) => {
      return total + getSizePrice(frame.customization.size);
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  // Don't render if there are no frames and no fallback customization
  if (frames.length === 0 && !customization) {
    return null;
  }

  // If no frames but we have customization, show single frame details
  if (frames.length === 0 && customization) {
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
              <p className="font-semibold text-gray-900">
                {getMaterialName(customization.material)}
              </p>
            </div>
          </div>

          {/* Color */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Palette className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Color</p>
              <p className="font-semibold text-gray-900">
                {getColorName(customization.frameColor)}
              </p>
            </div>
          </div>

          {/* Size */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Square className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Size</p>
              <p className="font-semibold text-gray-900">
                {customization.size.replace("x", '" X ')}"
              </p>
            </div>
          </div>

          {/* Finish */}
          {/* <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Finish</p>
              <p className="font-semibold text-gray-900">{getFinishName(customization.material)}</p>
            </div>
          </div> */}

          {/* Hang Type */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Image className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Hang</p>
              <p className="font-semibold text-gray-900">
                {getHangType(customization.hangType)}
              </p>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Items (1)</span>
              <span className="text-sm font-medium text-gray-900">
                ₹{price}
              </span>
            </div>

            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-gray-900">Grand Total</span>
              <span className="text-pink-600">₹{price}</span>
            </div>
          </div>

          <Button
            onClick={onAddToCart}
            className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart (1 item)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="space-y-6">
        {/* Individual Frame Details */}
        {frames.map((frame, index) => {
          const framePrice = getSizePrice(frame.customization.size);

          return (
            <div
              key={frame.id}
              className="border-b border-gray-100 pb-4 last:border-b-0"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Frame {index + 1}
              </h3>

              <div className="space-y-3">
                {/* Frame Type */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Hash className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Frame</p>
                    <p className="text-sm font-medium text-gray-900">
                      {getMaterialName(frame.customization.material)}
                    </p>
                  </div>
                </div>

                {/* Color */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Palette className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Color</p>
                    <p className="text-sm font-medium text-gray-900">
                      {getColorName(frame.customization.frameColor)}
                    </p>
                  </div>
                </div>

                {/* Size */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Square className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Size</p>
                    <p className="text-sm font-medium text-gray-900">
                      {frame.customization.size.replace("x", '" X ')}"
                    </p>
                  </div>
                </div>

                {/* Finish */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Finish</p>
                    <p className="text-sm font-medium text-gray-900">
                      {getFinishName(frame.customization.material)}
                    </p>
                  </div>
                </div>

                {/* Hang Type */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Hang</p>
                    <p className="text-sm font-medium text-gray-900">
                      {getHangType(frame.customization.material)}
                    </p>
                  </div>
                </div>

                {/* Frame Price */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-medium text-gray-700">
                    Frame {index + 1} Price
                  </span>
                  <span className="text-lg font-bold text-pink-600">
                    ₹{framePrice}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Summary Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Items ({frames.length})
            </span>
            <span className="text-sm font-medium text-gray-900">
              ₹{totalPrice}
            </span>
          </div>

          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-gray-900">Grand Total</span>
            <span className="text-pink-600">₹{totalPrice}</span>
          </div>
        </div>

        <Button
          onClick={onAddToCart}
          className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart ({frames.length} {frames.length === 1 ? "item" : "items"})
        </Button>
      </div>
    </div>
  );
};

export default FrameDetails;
