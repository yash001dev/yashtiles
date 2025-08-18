'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  Info,
  Plus,
  Minus,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FrameItHeader from '@/components/dashboard/FrameItHeader';
import FrameItFooter from '@/components/dashboard/FrameItFooter';
import { ProductGallery } from '@/components/ecommerce/ProductGallery';
import { VariantSelector } from '@/components/ecommerce/VariantSelector';
import { PDPPreviewCanvas } from '@/components/PDPPreviewCanvas';
import { CMSBlockRenderer } from '@/components/cms/CMSBlockRenderer';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: any;
  shortDescription: string;
  price: number;
  basePrice: number;
  compareAtPrice?: number;
  template?: {
    id: string;
    name: string;
    slug: string;
    blocks: Array<{
      blockType: string;
      [key: string]: any;
    }>;
  };
  images: Array<{
    image: {
      url: string;
      alt: string;
    };
    alt: string;
    caption?: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  availableSizes: Array<{
    id: string;
    name: string;
    dimensions: string;
    aspectRatio: number;
    price: number;
  }>;
  defaultColors: Array<{
    id: string;
    name: string;
    color: string;
    description: string;
  }>;
  defaultMaterials: Array<{
    id: string;
    name: string;
    description: string;
    content: string;
  }>;
  features: Array<{
    feature: string;
  }>;
  specifications: {
    weight?: string;
    dimensions?: string;
    mounting: string;
  };
  stock: number;
  sku: string;
  featured?: boolean;
  status: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wallImage, setWallImage] = useState('/framedecor1.png');

  // Initialize selections when product loads
  useEffect(() => {
    if (product) {
      // Set default size
      if (product.availableSizes && product.availableSizes.length > 0) {
        setSelectedSize(product.availableSizes[0]);
      }
      
      // Set default color
      if (product.defaultColors && product.defaultColors.length > 0) {
        setSelectedColor(product.defaultColors[0]);
      }
      
      // Set default material
      if (product.defaultMaterials && product.defaultMaterials.length > 0) {
        setSelectedMaterial(product.defaultMaterials[0]);
      }
      
      // Set default image
      if (product.images && product.images.length > 0) {
        setSelectedImage(product.images[0].image.url);
      }
    }
  }, [product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const calculateDiscount = (price: number, comparePrice?: number) => {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  const getTotalPrice = () => {
    if (!selectedSize) return product?.basePrice || 0;
    return (product?.basePrice || 0) + (selectedSize?.price || 0);
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Adding to cart:', {
      product: product?.id,
      size: selectedSize,
      color: selectedColor,
      material: selectedMaterial,
      quantity,
    });
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <>
        <FrameItHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </>
    );
  }

  if (isError || !product) {
    return (
      <>
        <FrameItHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <Link href="/products">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const discount = calculateDiscount(product.basePrice, product.compareAtPrice);

  return (
    <>
      <FrameItHeader />
      
      {/* Breadcrumb */}
      <nav className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-pink-600">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-pink-600">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </nav>

      {/* Product Detail */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ProductGallery 
                  images={product.images} 
                  productName={product.name}
                />
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {product.categories.map((category) => (
                      <span
                        key={category.id}
                        className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                    {product.featured && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>
                  
                  <p className="text-lg text-gray-600 mb-6">
                    {product.shortDescription}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(getTotalPrice())}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                          {discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2 mb-6">
                    {product.stock > 0 ? (
                      <>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-700 font-medium">In Stock ({product.stock} available)</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-red-700 font-medium">Out of Stock</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Variant Selection */}
                <div className="space-y-6">
                  {/* Size Selection */}
                  {product.availableSizes && product.availableSizes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {product.availableSizes.map((size) => (
                          <button
                            key={size.id}
                            onClick={() => setSelectedSize(size)}
                            className={`p-3 border-2 rounded-lg text-center transition-all ${
                              selectedSize?.id === size.id
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium">{size.name}</div>
                            <div className="text-sm text-gray-600">{size.dimensions}</div>
                            <div className="text-sm font-medium text-pink-600">
                              +{formatPrice(size.price)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  {product.defaultColors && product.defaultColors.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Color: {selectedColor?.name || 'Select a color'}
                      </h3>
                      <div className="flex gap-3">
                        {product.defaultColors.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => setSelectedColor(color)}
                            className={`w-12 h-12 rounded-full border-4 transition-all ${
                              selectedColor?.id === color.id
                                ? 'border-pink-500 scale-110'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={{ backgroundColor: color.color }}
                            title={color.name}
                          >
                            {selectedColor?.id === color.id && (
                              <Check className="w-4 h-4 text-white mx-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Material Selection */}
                  {product.defaultMaterials && product.defaultMaterials.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Material</h3>
                      <div className="space-y-2">
                        {product.defaultMaterials.map((material) => (
                          <button
                            key={material.id}
                            onClick={() => setSelectedMaterial(material)}
                            className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                              selectedMaterial?.id === material.id
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium">{material.name}</div>
                            <div className="text-sm text-gray-600">{material.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3"
                      size="lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart - {formatPrice(getTotalPrice() * quantity)}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-3 ${isWishlisted ? 'text-red-600 border-red-600' : ''}`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button variant="outline" onClick={handleShare} className="p-3">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <Truck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-xs text-gray-600">Free Shipping</div>
                    </div>
                    <div className="text-center">
                      <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-xs text-gray-600">Quality Guarantee</div>
                    </div>
                    <div className="text-center">
                      <RotateCcw className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-xs text-gray-600">Easy Returns</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8 overflow-x-auto">
              <div className="flex bg-white rounded-lg p-1 shadow-sm min-w-max">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'specifications', label: 'Specifications' },
                  { id: 'preview', label: 'Wall Preview' },
                  { id: 'features', label: 'Features' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-md font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {activeTab === 'overview' && (
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Overview</h3>
                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium text-gray-700">SKU</span>
                          <span className="text-gray-900">{product.sku}</span>
                        </div>
                        {product.specifications.weight && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="font-medium text-gray-700">Weight</span>
                            <span className="text-gray-900">{product.specifications.weight}</span>
                          </div>
                        )}
                        {product.specifications.dimensions && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="font-medium text-gray-700">Dimensions</span>
                            <span className="text-gray-900">{product.specifications.dimensions}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium text-gray-700">Mounting</span>
                          <span className="text-gray-900 capitalize">
                            {product.specifications.mounting.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Available Sizes</h4>
                        <div className="space-y-2">
                          {product.availableSizes.map((size) => (
                            <div key={size.id} className="flex justify-between py-1">
                              <span className="text-gray-700">{size.name}</span>
                              <span className="text-gray-900">{formatPrice(size.price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preview' && selectedImage && selectedSize && selectedColor && selectedMaterial && (
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Wall Preview</h3>
                    <PDPPreviewCanvas
                      selectedImage={selectedImage}
                      selectedSize={selectedSize}
                      selectedColor={selectedColor.name}
                      selectedMaterial={selectedMaterial.name}
                      wallImage={wallImage}
                      onWallImageChange={setWallImage}
                    />
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-900">{feature.feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Template Blocks - Rendered below tab content */}
      {product.template && product.template.blocks && product.template.blocks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <CMSBlockRenderer blocks={product.template.blocks} />
        </motion.div>
      )}

      <FrameItFooter />
    </>
  );
}