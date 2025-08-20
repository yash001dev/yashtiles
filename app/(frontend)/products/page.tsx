'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Filter, Grid, List, Search, Star, Heart, ShoppingCart, Eye, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FrameItHeader from '@/components/dashboard/FrameItHeader';
import FrameItFooter from '@/components/dashboard/FrameItFooter';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{
    image: {
      url: string;
      alt: string;
    };
    alt: string;
  }>;
  categories: Array<{
    name: string;
    slug: string;
  }>;
  featured: boolean;
  status: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: {
    url: string;
    alt: string;
  };
}

export default function ProductListingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('/api/products?status=published&limit=50');
        const productsData = await productsResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/product-categories?status=active');
        const categoriesData = await categoriesResponse.json();
        
        setProducts(productsData.docs || []);
        setCategories(categoriesData.docs || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || 
        product.categories.some(cat => cat.slug === selectedCategory);
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (loading) {
    return (
      <>
        <FrameItHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading our beautiful frames...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FrameItHeader />
      
      {/* Hero Section with Categories Carousel */}
      <section className="py-16 bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Ready-Made Frames
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our curated collection of premium frames, ready to transform your space
            </p>
          </motion.div>

          {/* Categories Carousel */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 relative"
            >
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView="auto"
                navigation={{
                  nextEl: '.categories-swiper-button-next',
                  prevEl: '.categories-swiper-button-prev',
                }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className="categories-swiper"
              >
                <SwiperSlide style={{ width: 'auto' }}>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      selectedCategory === 'all'
                        ? 'bg-pink-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
                    }`}
                  >
                    All Categories
                  </button>
                </SwiperSlide>
                {categories.map((category) => (
                  <SwiperSlide key={category.id} style={{ width: 'auto' }}>
                    <button
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                        selectedCategory === category.slug
                          ? 'bg-pink-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Enhanced Navigation Buttons */}
              <button className="categories-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group">
                <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </button>
              
              <button className="categories-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group">
                <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search frames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} frames
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductListItem product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No frames found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}>
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <ProductListingFAQSection />

      <FrameItFooter />
    </>
  );
}

// Enhanced Product Card Component with Auto-Swipe on Hover
function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoSwipeTimer, setAutoSwipeTimer] = useState<NodeJS.Timeout | null>(null);

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

  const discount = calculateDiscount(product.price, product.compareAtPrice);

  // Auto-swipe functionality on hover
  useEffect(() => {
    if (isHovered && product.images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 1500); // Change image every 1.5 seconds
      setAutoSwipeTimer(timer);
    } else {
      if (autoSwipeTimer) {
        clearInterval(autoSwipeTimer);
        setAutoSwipeTimer(null);
      }
      // Reset to first image when not hovering
      if (!isHovered) {
        setCurrentImageIndex(0);
      }
    }

    return () => {
      if (autoSwipeTimer) {
        clearInterval(autoSwipeTimer);
      }
    };
  }, [isHovered, product.images.length]);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={product.images[currentImageIndex]?.image.url || product.images[0]?.image.url}
            alt={product.images[currentImageIndex]?.alt || product.images[0]?.alt}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Image Navigation Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {discount}% OFF
          </div>
        )}

        {/* Quick Actions */}
        <motion.div
          className="absolute top-4 right-4 flex flex-col gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
        >
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <Link href={`/products/${product.slug}`}>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          </Link>
        </motion.div>

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link href={`/products/${product.slug}`}>
            <Button className="bg-white text-gray-900 hover:bg-gray-100">
              View Details
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
          {product.featured && (
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.categories.slice(0, 2).map((category) => (
            <span
              key={category.slug}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {category.name}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Product List Item Component
function ProductListItem({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoSwipeTimer, setAutoSwipeTimer] = useState<NodeJS.Timeout | null>(null);

  const calculateDiscount = (price: number, comparePrice?: number) => {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };
  const discount = calculateDiscount(product.price, product.compareAtPrice);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // Auto-swipe functionality on hover
  useEffect(() => {
    if (isHovered && product.images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 1500);
      setAutoSwipeTimer(timer);
    } else {
      if (autoSwipeTimer) {
        clearInterval(autoSwipeTimer);
        setAutoSwipeTimer(null);
      }
      if (!isHovered) {
        setCurrentImageIndex(0);
      }
    }

    return () => {
      if (autoSwipeTimer) {
        clearInterval(autoSwipeTimer);
      }
    };
  }, [isHovered, product.images.length]);

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-64 aspect-square md:aspect-auto overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={product.images[currentImageIndex]?.image.url || product.images[0]?.image.url}
              alt={product.images[currentImageIndex]?.alt || product.images[0]?.alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {discount}% OFF
            </div>
          )}
          
          {/* Image dots indicator */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-pink-600 transition-colors">
                <Link href={`/products/${product.slug}`}>
                  {product.name}
                </Link>
              </h3>
              <p className="text-gray-600 mb-4">
                {product.shortDescription}
              </p>
            </div>
            {product.featured && (
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.categories.map((category) => (
              <span
                key={category.slug}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
              <Link href={`/products/${product.slug}`}>
                <Button size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// FAQ Section for Product Listing Page
function ProductListingFAQSection() {
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

  const faqs = [
    {
      question: "How do I choose the right frame for my photo?",
      answer: "Consider your photo's style, your room's decor, and the mood you want to create. Classic frames work well for traditional photos, while frameless options suit modern spaces. Our frame guide can help you decide."
    },
    {
      question: "What's the difference between frame materials?",
      answer: "Classic frames offer a traditional look with wooden borders, frameless frames provide a modern, clean aesthetic, and canvas frames give a textured, artistic finish. Each material affects the overall presentation of your photo."
    },
    {
      question: "Can I see how the frame will look before ordering?",
      answer: "Yes! Our frame customizer lets you preview exactly how your photo will look in different frame styles, sizes, and colors before you place your order."
    },
    {
      question: "Do you offer custom sizes?",
      answer: "We offer a wide range of standard sizes from 8×8 to 32×24 inches. For custom sizes, please contact our support team and we'll be happy to help with a custom quote."
    },
    {
      question: "What's your return policy?",
      answer: "We offer a 7-day satisfaction guarantee. If you're not completely happy with your frame, we'll exchange it or provide a full refund. Your satisfaction is our priority."
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Common questions about our frames and services</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
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
                        {faq.answer}
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