'use client'

import { useState } from 'react'
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react'

interface ProductDetailsProps {
  product: any // Replace with proper type from payload-types
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedMaterial, setSelectedMaterial] = useState(product.materials[0]?.material || '')
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.size || '')
  const [selectedColor, setSelectedColor] = useState(product.frameColors[0]?.color || '')
  const [quantity, setQuantity] = useState(1)

  const calculatePrice = () => {
    let price = product.basePrice

    // Add material modifier
    const materialOption = product.materials.find((m: any) => m.material === selectedMaterial)
    if (materialOption) price += materialOption.priceModifier

    // Add size modifier
    const sizeOption = product.sizes.find((s: any) => s.size === selectedSize)
    if (sizeOption) price += sizeOption.priceModifier

    // Add color modifier
    const colorOption = product.frameColors.find((c: any) => c.color === selectedColor)
    if (colorOption) price += colorOption.priceModifier

    return price
  }

  const formatSizeLabel = (size: string) => {
    return size.replace('x', '" × ') + '"'
  }

  const formatMaterialLabel = (material: string) => {
    const labels: Record<string, string> = {
      classic: 'Classic Frame',
      frameless: 'Frameless',
      canvas: 'Canvas',
    }
    return labels[material] || material
  }

  const formatColorLabel = (color: string) => {
    return color.charAt(0).toUpperCase() + color.slice(1)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          {product.images && product.images.length > 0 && typeof product.images[selectedImage]?.image === 'object' && (
            <img
              src={product.images[selectedImage].image.url!}
              alt={product.images[selectedImage].alt}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {product.images && product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((imageItem: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                  selectedImage === index ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {typeof imageItem.image === 'object' && (
                  <img
                    src={imageItem.image.url!}
                    alt={imageItem.alt}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-current" />
              ))}
              <span className="text-gray-600 ml-2">(4.9) • 127 reviews</span>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
        </div>

        <div className="text-3xl font-bold text-gray-900">
          ${calculatePrice()}
        </div>

        {/* Material Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Material</h3>
          <div className="grid grid-cols-3 gap-3">
            {product.materials.map((materialOption: any) => (
              <button
                key={materialOption.material}
                onClick={() => setSelectedMaterial(materialOption.material)}
                className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMaterial === materialOption.material
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {formatMaterialLabel(materialOption.material)}
                {materialOption.priceModifier !== 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {materialOption.priceModifier > 0 ? '+' : ''}${materialOption.priceModifier}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Size</h3>
          <div className="grid grid-cols-3 gap-3">
            {product.sizes.map((sizeOption: any) => (
              <button
                key={sizeOption.size}
                onClick={() => setSelectedSize(sizeOption.size)}
                className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSize === sizeOption.size
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {formatSizeLabel(sizeOption.size)}
                {sizeOption.priceModifier !== 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {sizeOption.priceModifier > 0 ? '+' : ''}${sizeOption.priceModifier}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Frame Color</h3>
          <div className="flex flex-wrap gap-3">
            {product.frameColors.map((colorOption: any) => (
              <button
                key={colorOption.color}
                onClick={() => setSelectedColor(colorOption.color)}
                className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedColor === colorOption.color
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {formatColorLabel(colorOption.color)}
                {colorOption.priceModifier !== 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({colorOption.priceModifier > 0 ? '+' : ''}${colorOption.priceModifier})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
            >
              -
            </button>
            <span className="text-lg font-medium w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button className="w-full btn-primary flex items-center justify-center">
            <ShoppingCart size={20} className="mr-2" />
            Add to Cart - ${(calculatePrice() * quantity).toFixed(2)}
          </button>
          
          <div className="flex space-x-4">
            <button className="flex-1 btn-secondary flex items-center justify-center">
              <Heart size={20} className="mr-2" />
              Save
            </button>
            <button className="flex-1 btn-secondary flex items-center justify-center">
              <Share2 size={20} className="mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center text-gray-600">
              <Truck size={20} className="mr-3 text-primary-600" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Shield size={20} className="mr-3 text-primary-600" />
              <span>Lifetime quality guarantee</span>
            </div>
            <div className="flex items-center text-gray-600">
              <RotateCcw size={20} className="mr-3 text-primary-600" />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}