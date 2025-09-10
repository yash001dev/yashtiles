"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus, Heart, Share2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Size {
  id: string;
  name: string;
  dimensions: string;
  aspectRatio: number;
  price: number;
}

interface Color {
  id: string;
  name: string;
  color: string;
  description: string;
}

interface Material {
  id: string;
  name: string;
  description: string;
  content: string;
}

interface VariantPricing {
  size: { id: string; name: string; price: number };
  color: { id: string; name: string };
  material: { id: string; name: string };
  priceModifier: number;
  stock: number;
  isAvailable: boolean;
}

interface ProductControlsProps {
  product: {
    id: string;
    name: string;
    basePrice: number;
    images: Array<{
      image: { url: string; alt: string };
      alt: string;
    }>;
    availableSizes?: Size[];
    defaultColors?: Color[];
    additionalColors?: Color[];
    defaultMaterials?: Material[];
    additionalMaterials?: Material[];
    variantPricing?: VariantPricing[];
    stock: number;
  };
}

// Format price function
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};

export default function ProductControls({
  product,
}: ProductControlsProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { addNotification } = useNotifications();
  const router = useRouter();

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      // Set default size (first available size)
      if (product.availableSizes && product.availableSizes.length > 0) {
        setSelectedSize(product.availableSizes[0].name);
      }

      // Set default color (first default color)
      if (product.defaultColors && product.defaultColors.length > 0) {
        setSelectedColor(product.defaultColors[0].id);
      }

      // Set default material (first default material)
      if (product.defaultMaterials && product.defaultMaterials.length > 0) {
        setSelectedMaterial(product.defaultMaterials[0].id);
      }
    }
  }, [product]);

  const getCurrentPrice = () => {
    if (!product || !selectedSize || !selectedColor || !selectedMaterial) {
      return product?.basePrice || 0;
    }

    // Find the size price
    const selectedSizeObj = product.availableSizes?.find(
      (s) => s.name === selectedSize
    );
    const sizePrice = selectedSizeObj?.price || 0;

    // Find variant-specific pricing
    const variantPricing = product.variantPricing?.find(
      (vp) =>
        vp.size.name === selectedSize &&
        vp.color.id === selectedColor &&
        vp.material.id === selectedMaterial
    );

    const priceModifier = variantPricing?.priceModifier || 0;

    return (product.basePrice || 0) + sizePrice + priceModifier;
  };

  const getCurrentStock = () => {
    if (!product || !selectedSize || !selectedColor || !selectedMaterial) {
      return product?.stock || 0;
    }

    // Find variant-specific stock
    const variantPricing = product.variantPricing?.find(
      (vp) =>
        vp.size.id === selectedSize &&
        vp.color.id === selectedColor &&
        vp.material.id === selectedMaterial
    );

    return variantPricing?.stock || product.stock || 0;
  };

  const isVariantAvailable = () => {
    if (!product || !selectedSize || !selectedColor || !selectedMaterial) {
      return false;
    }

    // Check if variant is available
    const variantPricing = product.variantPricing?.find(
      (vp) =>
        vp.size.id === selectedSize &&
        vp.color.id === selectedColor &&
        vp.material.id === selectedMaterial
    );

    return variantPricing?.isAvailable !== false && getCurrentStock() > 0;
  };

  const handleAddToCart = (type?: string) => {
    if (!product || !selectedSize || !selectedColor || !selectedMaterial) {
      toast.error("Please select all options before adding to cart");
      return;
    }

    const selectedColorObj = product?.defaultColors
      ?.concat(product?.additionalColors || [])
      .find((c) => c.id === selectedColor);
    const selectedMaterialObj = product.defaultMaterials
      ?.concat(product.additionalMaterials || [])
      .find((m) => m.id === selectedMaterial);

    const selectedSizeObj = product.availableSizes?.find(
      (s) => s.name === selectedSize
    );

    const cartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}-${selectedMaterial}`,
      name: product.name,
      price: getCurrentPrice(),
      image: product.images[0]?.image.url,
      size: selectedSize,
      color: selectedColorObj?.name || "",
      material: selectedMaterialObj?.name || "",
      quantity: quantity,
      customization: {
        size: selectedSize,
        color: selectedColorObj?.name || "",
        material: selectedMaterialObj?.name || "",
        price: {
          base: product.basePrice || 0,
          size: selectedSizeObj?.price || 0,
          total: getCurrentPrice(),
        },
      },
    };

    addItem(cartItem);
    if (type !== "buy") {
      addNotification({
        type: "success",
        title: "Added to Cart",
        message: "Your frame has been added to cart.",
      });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart("buy");
    router.push("/cart");
  };

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="border-t border-b py-6">
        <div className="flex items-center gap-4">
          <span className="text-2xl md:text-3xl font-bold text-gray-900">
            {formatPrice(getCurrentPrice())}
          </span>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-6">
        {/* Size Selection */}
        {product?.availableSizes && product.availableSizes.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {product.availableSizes.slice(0, 6).map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.name)}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    selectedSize === size.name
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">{size.name}</div>
                  <div className="text-sm text-gray-600">{size.dimensions}</div>
                  <div className="text-sm text-gray-600">
                    {formatPrice(size.price)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {product?.defaultColors && product.defaultColors.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Color:{" "}
              {product.defaultColors
                .concat(product.additionalColors || [])
                .find((c) => c.id === selectedColor)?.name || "Select Color"}
            </h3>
            <div className="space-y-3">
              {/* Default Colors */}
              <div className="flex flex-wrap gap-3">
                {product.defaultColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`relative w-12 h-12 rounded-full border-4 transition-all ${
                      selectedColor === color.id
                        ? "border-pink-500 scale-110"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  ></button>
                ))}
              </div>

              {/* Additional Colors */}
              {product.additionalColors && product.additionalColors.length > 0 && (
                <div>
                  {showAllColors && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {product.additionalColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.id)}
                          className={`relative w-12 h-12 rounded-full border-4 transition-all ${
                            selectedColor === color.id
                              ? "border-pink-500 scale-110"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          style={{ backgroundColor: color.color }}
                          title={color.name}
                        ></button>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setShowAllColors(!showAllColors)}
                    className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    {showAllColors
                      ? "Show Less Colors"
                      : `+${product.additionalColors.length} More Colors`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Material Selection */}
        {product?.defaultMaterials && product.defaultMaterials.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Material:{" "}
              {product.defaultMaterials
                .concat(product.additionalMaterials || [])
                .find((m) => m.id === selectedMaterial)?.name ||
                "Select Material"}
            </h3>
            <div className="space-y-3">
              {/* Default Materials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {product.defaultMaterials.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => setSelectedMaterial(material.id)}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      selectedMaterial === material.id
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {material.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {material.description}
                    </div>
                  </button>
                ))}
              </div>

              {/* Additional Materials */}
              {product.additionalMaterials &&
                product.additionalMaterials.length > 0 && (
                  <div>
                    {showAllMaterials && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        {product.additionalMaterials.map((material) => (
                          <button
                            key={material.id}
                            onClick={() => setSelectedMaterial(material.id)}
                            className={`p-3 border-2 rounded-lg text-left transition-all ${
                              selectedMaterial === material.id
                                ? "border-pink-500 bg-pink-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="font-medium text-gray-900">
                              {material.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {material.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => setShowAllMaterials(!showAllMaterials)}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      {showAllMaterials
                        ? "Show Less Materials"
                        : `+${product.additionalMaterials.length} More Materials`}
                    </button>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(getCurrentStock(), quantity + 1))
                }
                className="p-2 hover:bg-gray-50 transition-colors"
                disabled={quantity >= getCurrentStock()}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-2">
              {isVariantAvailable() ? (
                <span className="text-green-600 flex items-center gap-1">
                  ✓ {getCurrentStock()} in stock
                </span>
              ) : (
                <span className="text-red-600">
                  {selectedSize && selectedColor && selectedMaterial
                    ? "Out of stock"
                    : "Please select all options"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Button
              className="flex-1 h-12 text-lg bg-gray-100 hover:bg-gray-200 text-gray-900"
              onClick={() => handleAddToCart()}
              disabled={!isVariantAvailable() || getCurrentStock() === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              className="flex-1 h-12 text-lg"
              onClick={handleBuyNow}
              disabled={!isVariantAvailable() || getCurrentStock() === 0}
            >
              Buy Now
            </Button>
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
