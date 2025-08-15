'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Check,
  Minus,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import FrameItHeader from '@/components/dashboard/FrameItHeader';
import FrameItFooter from '@/components/dashboard/FrameItFooter';
import Link from 'next/link';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import { useGetPageContentQuery, useGetProductsByCategoryQuery } from '@/redux/api/resourcesApi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import { ProductCard } from '@/components/ecommerce/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: any;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{
    image: {
      url: string;
      alt: string;
    };
    alt: string;
    caption?: string;
  }>;
  categories: Array<{
    name: string;
    slug: string;
  }>;
  variants: Array<{
    name: string;
    displayName: string;
    basePrice: number;
    colors: Array<{
      name: string;
      value: string;
      hexCode?: string;
      priceModifier: number;
      stock: number;
      isDefault: boolean;
    }>;
  }>;
  features: Array<{
    feature: string;
  }>;
  specifications: {
    material: string;
    weight?: string;
    dimensions?: string;
    mounting: string;
  };
  stock: number;
  sku: string;
}

interface PageContent {
  content: Array<{
    blockType: string;
    [key: string]: any;
  }>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Fetch product
        const productResponse = await fetch(`/api/products?where[slug][equals]=${slug}&status=published`);
        const productData = await productResponse.json();
        
        if (productData.docs && productData.docs.length > 0) {
          const productItem = productData.docs[0];
          setProduct(productItem);
          
          // Set default variant and color
          if (productItem.variants && productItem.variants.length > 0) {
            setSelectedVariant(productItem.variants[0].name);
            const defaultColor = productItem.variants[0].colors.find((c: any) => c.isDefault) || 
                               productItem.variants[0].colors[0];
            if (defaultColor) {
              setSelectedColor(defaultColor.value);
            }
          }
        }

        // Fetch page content for PDP template
        const pageResponse = await fetch(`/api/pages?where[pageType][equals]=pdp&status=published`);
        const pageData = await pageResponse.json();
        
        if (pageData.docs && pageData.docs.length > 0) {
          setPageContent(pageData.docs[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const getCurrentPrice = () => {
    if (!product || !selectedVariant || !selectedColor) return product?.price || 0;
    
    const variant = product.variants.find(v => v.name === selectedVariant);
    if (!variant) return product.price;
    
    const color = variant.colors.find(c => c.value === selectedColor);
    const priceModifier = color?.priceModifier || 0;
    
    return variant.basePrice + priceModifier;
  };

  const getCurrentStock = () => {
    if (!product || !selectedVariant || !selectedColor) return 0;
    
    const variant = product.variants.find(v => v.name === selectedVariant);
    if (!variant) return 0;
    
    const color = variant.colors.find(c => c.value === selectedColor);
    return color?.stock || 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if (loading) {
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

  if (!product) {
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

      {/* Product Details */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                {/* Main Image Swiper */}
                <Swiper
                  modules={[Navigation, Pagination, Thumbs, Zoom]}
                  spaceBetween={10}
                  navigation
                  pagination={{ clickable: true }}
                  thumbs={{ swiper: thumbsSwiper }}
                  zoom={{ maxRatio: 3 }}
                  onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                  className="aspect-square rounded-2xl overflow-hidden shadow-lg"
                >
                  {product.images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="swiper-zoom-container">
                        <img
                          src={img.image.url}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Thumbnail Swiper */}
                {product.images.length > 1 && (
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={10}
                    slidesPerView={4}
                    watchSlidesProgress
                    onSwiper={setThumbsSwiper}
                    className="thumbs-swiper"
                  >
                    {product.images.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          index === activeImageIndex ? 'border-pink-500' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <img
                            src={img.image.url}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
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
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  {product.featured && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(4.8) • 127 reviews</span>
                  </div>
                  <span className="text-sm text-gray-600">SKU: {product.sku}</span>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Price */}
              <div className="border-t border-b py-6">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(getCurrentPrice())}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > getCurrentPrice() && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        Save {formatPrice(product.compareAtPrice - getCurrentPrice())}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Variants */}
              {product.variants.length > 0 && (
                <div className="space-y-4">
                  {/* Size Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.name}
                          onClick={() => {
                            setSelectedVariant(variant.name);
                            const defaultColor = variant.colors.find(c => c.isDefault) || variant.colors[0];
                            if (defaultColor) {
                              setSelectedColor(defaultColor.value);
                            }
                          }}
                          className={`p-3 border-2 rounded-lg text-center transition-all ${
                            selectedVariant === variant.name
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{variant.displayName}</div>
                          <div className="text-sm text-gray-600">{formatPrice(variant.basePrice)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  {selectedVariant && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Color: {product.variants.find(v => v.name === selectedVariant)?.colors.find(c => c.value === selectedColor)?.name}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {product.variants.find(v => v.name === selectedVariant)?.colors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={`relative w-12 h-12 rounded-full border-4 transition-all ${
                              selectedColor === color.value
                                ? 'border-pink-500 scale-110'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={{ backgroundColor: color.hexCode || color.value }}
                            title={`${color.name} - ${color.stock > 0 ? 'In Stock' : 'Out of Stock'}`}
                          >
                            {color.stock === 0 && (
                              <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                                <span className="text-xs text-gray-500">✕</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
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
                        onClick={() => setQuantity(Math.min(getCurrentStock(), quantity + 1))}
                        className="p-2 hover:bg-gray-50 transition-colors"
                        disabled={quantity >= getCurrentStock()}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">
                      {getCurrentStock() > 0 ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          {getCurrentStock()} in stock
                        </span>
                      ) : (
                        <span className="text-red-600">Out of stock</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    className="flex-1 h-12 text-lg"
                    disabled={getCurrentStock() === 0}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Free Shipping</div>
                  <div className="text-xs text-gray-600">On orders over ₹2000</div>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Quality Guarantee</div>
                  <div className="text-xs text-gray-600">7-day satisfaction</div>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Easy Returns</div>
                  <div className="text-xs text-gray-600">Hassle-free process</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <ProductDetailsTabs product={product} />

      {/* CMS Content Blocks */}
      {pageContent && <CMSContentRenderer content={pageContent.content} />}

      {/* Related Products */}
      <RelatedProducts categories={product.categories} currentProductId={product.id} />

      <FrameItFooter />
    </>
  );
}

// Product Details Tabs Component
function ProductDetailsTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'features', label: 'Features' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Technical Specifications</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Material</span>
                        <span className="font-medium">{product.specifications.material}</span>
                      </div>
                      {product.specifications.weight && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Weight</span>
                          <span className="font-medium">{product.specifications.weight}</span>
                        </div>
                      )}
                      {product.specifications.dimensions && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Dimensions</span>
                          <span className="font-medium">{product.specifications.dimensions}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Mounting</span>
                        <span className="font-medium capitalize">{product.specifications.mounting.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-gray-900">{feature.feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-12">
                  <p className="text-gray-600">Reviews coming soon...</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// CMS Content Renderer Component
function CMSContentRenderer({ content }: { content: any[] }) {
  return (
    <div className="space-y-12">
      {content.map((block, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          {block.blockType === 'faq' && <FAQSection block={block} />}
          {block.blockType === 'frame-specifications' && <FrameSpecificationsSection block={block} />}
          {block.blockType === 'banner' && <BannerSection block={block} />}
          {block.blockType === 'slider' && <SliderSection block={block} />}
          {block.blockType === 'custom-html' && <CustomHTMLSection block={block} />}
        </motion.div>
      ))}
    </div>
  );
}

// FAQ Section Component
function FAQSection({ block }: { block: any }) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{block.title}</h2>
            {block.subtitle && (
              <p className="text-lg text-gray-600">{block.subtitle}</p>
            )}
          </div>

          <div className="space-y-4">
            {block.faqs.map((faq: any, index: number) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
                initial={false}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openItems.has(index) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openItems.has(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600">
                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Frame Specifications Section Component
function FrameSpecificationsSection({ block }: { block: any }) {
  const [activeSpec, setActiveSpec] = useState(0);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{block.title}</h2>
            {block.subtitle && (
              <p className="text-lg text-gray-600">{block.subtitle}</p>
            )}
          </div>

          {block.layout === 'carousel' && (
            <Swiper
              modules={[Navigation, Pagination, EffectCoverflow]}
              effect="coverflow"
              grabCursor
              centeredSlides
              slidesPerView="auto"
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              navigation
              pagination={{ clickable: true }}
              className="specifications-swiper"
            >
              {block.specifications.map((spec: any, index: number) => (
                <SwiperSlide key={index} style={{ width: '400px' }}>
                  <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                    {spec.images && spec.images.length > 0 && (
                      <div className="aspect-video rounded-lg overflow-hidden mb-4">
                        <img
                          src={spec.images[0].image.url}
                          alt={spec.images[0].caption || spec.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{spec.title}</h3>
                    <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: spec.description }} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {block.layout === 'tabs' && (
            <div>
              {/* Tab Navigation */}
              <div className="flex justify-center mb-8">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {block.specifications.map((spec: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setActiveSpec(index)}
                      className={`px-4 py-2 rounded-md font-medium transition-all ${
                        activeSpec === index
                          ? 'bg-white text-pink-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {spec.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSpec}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  {block.specifications[activeSpec] && (
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          {block.specifications[activeSpec].title}
                        </h3>
                        <div className="prose" dangerouslySetInnerHTML={{ 
                          __html: block.specifications[activeSpec].description 
                        }} />
                      </div>
                      {block.specifications[activeSpec].images && 
                       block.specifications[activeSpec].images.length > 0 && (
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={block.specifications[activeSpec].images[0].image.url}
                            alt={block.specifications[activeSpec].images[0].caption || block.specifications[activeSpec].title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Banner Section Component
function BannerSection({ block }: { block: any }) {
  const getHeightClass = () => {
    switch (block.height) {
      case 'small': return 'h-64';
      case 'medium': return 'h-96';
      case 'large': return 'h-[500px]';
      case 'full': return 'h-screen';
      default: return 'h-96';
    }
  };

  const getAlignmentClass = () => {
    switch (block.alignment) {
      case 'left': return 'text-left items-start';
      case 'right': return 'text-right items-end';
      default: return 'text-center items-center';
    }
  };

  return (
    <section 
      className={`relative ${getHeightClass()} flex ${getAlignmentClass()} justify-center overflow-hidden`}
      style={{
        backgroundColor: block.backgroundColor,
        color: block.textColor,
      }}
    >
      {block.backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={block.backgroundImage.url}
            alt={block.backgroundImage.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{block.title}</h2>
          {block.subtitle && (
            <p className="text-xl mb-6">{block.subtitle}</p>
          )}
          {block.description && (
            <div className="prose prose-lg mb-8" dangerouslySetInnerHTML={{ __html: block.description }} />
          )}
          
          {block.buttons && block.buttons.length > 0 && (
            <div className="flex gap-4">
              {block.buttons.map((button: any, index: number) => (
                <Button
                  key={index}
                  variant={button.style === 'primary' ? 'default' : 'outline'}
                  size="lg"
                  asChild
                >
                  <a
                    href={button.url}
                    target={button.openInNewTab ? '_blank' : '_self'}
                    rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
                  >
                    {button.text}
                  </a>
                </Button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// Slider Section Component
function SliderSection({ block }: { block: any }) {
  const getHeightClass = () => {
    switch (block.height) {
      case 'small': return 'h-64';
      case 'medium': return 'h-96';
      case 'large': return 'h-[500px]';
      default: return 'h-auto';
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {block.title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{block.title}</h2>
          </div>
        )}
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={block.settings?.autoplay ? {
            delay: block.settings.autoplayDelay || 5000,
            disableOnInteraction: false,
          } : false}
          loop={block.settings?.loop}
          className={`${getHeightClass()} rounded-2xl overflow-hidden`}
        >
          {block.slides.map((slide: any, index: number) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img
                  src={slide.image.url}
                  alt={slide.image.alt}
                  className="w-full h-full object-cover"
                />
                
                {slide.overlay?.enabled && (
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: slide.overlay.color }}
                  />
                )}
                
                {(slide.title || slide.description || slide.link) && (
                  <div className={`absolute inset-0 flex items-center justify-center ${
                    slide.overlay?.position === 'bottom-left' ? 'items-end justify-start p-8' :
                    slide.overlay?.position === 'bottom-right' ? 'items-end justify-end p-8' :
                    slide.overlay?.position === 'top-left' ? 'items-start justify-start p-8' :
                    slide.overlay?.position === 'top-right' ? 'items-start justify-end p-8' :
                    'items-center justify-center'
                  }`}>
                    <div className="text-center text-white max-w-2xl">
                      {slide.title && (
                        <h3 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h3>
                      )}
                      {slide.description && (
                        <div className="prose prose-lg prose-invert mb-6" dangerouslySetInnerHTML={{ __html: slide.description }} />
                      )}
                      {slide.link?.url && slide.link?.text && (
                        <Button size="lg" asChild>
                          <a
                            href={slide.link.url}
                            target={slide.link.openInNewTab ? '_blank' : '_self'}
                            rel={slide.link.openInNewTab ? 'noopener noreferrer' : undefined}
                          >
                            {slide.link.text}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

// Custom HTML Section Component
function CustomHTMLSection({ block }: { block: any }) {
  return (
    <section className={block.isFullWidth ? '' : 'py-12'}>
      <div className={block.isFullWidth ? '' : 'container mx-auto px-4'}>
        <div className={block.wrapperClass || ''}>
          {block.css && (
            <style dangerouslySetInnerHTML={{ __html: block.css }} />
          )}
          <div dangerouslySetInnerHTML={{ __html: block.html }} />
          {block.javascript && (
            <script dangerouslySetInnerHTML={{ __html: block.javascript }} />
          )}
        </div>
      </div>
    </section>
  );
}

// Related Products Component
function RelatedProducts({ categories, currentProductId }: { 
  categories: Array<{ slug: string }>, 
  currentProductId: string 
}) {
  const categorySlug = categories[0]?.slug;
  
  const { data: relatedProducts = [] } = useGetProductsByCategoryQuery(
    { categorySlug, limit: 8, excludeId: currentProductId },
    { skip: !categorySlug }
  );

  const filteredProducts = relatedProducts.slice(0, 4);

  if (filteredProducts.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">You Might Also Like</h2>
          
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            navigation
            pagination={{ clickable: true }}
            className="related-products-swiper"
          >
            {filteredProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}