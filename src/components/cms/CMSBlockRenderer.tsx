'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow, EffectFade } from 'swiper/modules';
import { Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-fade';

interface CMSBlockRendererProps {
  blocks: Array<{
    blockType: string;
    [key: string]: any;
  }>;
  className?: string;
}

export function CMSBlockRenderer({ blocks, className = '' }: CMSBlockRendererProps) {
  return (
    <div className={`space-y-12 ${className}`}>
      {blocks.map((block, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <BlockRenderer block={block} />
        </motion.div>
      ))}
    </div>
  );
}

// Main Block Renderer
function BlockRenderer({ block }: { block: any }) {
  switch (block.blockType) {
    case 'faq':
      return <FAQBlock block={block} />;
    case 'frame-specifications':
      return <FrameSpecificationsBlock block={block} />;
    case 'banner':
      return <BannerBlock block={block} />;
    case 'slider':
      return <SliderBlock block={block} />;
    case 'custom-html':
      return <CustomHTMLBlock block={block} />;
    default:
      return null;
  }
}

// FAQ Block Component
function FAQBlock({ block }: { block: any }) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  // Group FAQs by category if enabled
  const groupedFAQs = block.showCategories 
    ? block.faqs.reduce((acc: any, faq: any, index: number) => {
        const category = faq.category || 'general';
        if (!acc[category]) acc[category] = [];
        acc[category].push({ ...faq, originalIndex: index });
        return acc;
      }, {})
    : { all: block.faqs.map((faq: any, index: number) => ({ ...faq, originalIndex: index })) };

  const categories = Object.keys(groupedFAQs);
  const filteredFAQs = selectedCategory === 'all' 
    ? block.faqs.map((faq: any, index: number) => ({ ...faq, originalIndex: index }))
    : groupedFAQs[selectedCategory] || [];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{block.title}</h2>
            {block.subtitle && (
              <p className="text-lg text-gray-600">{block.subtitle}</p>
            )}
          </motion.div>

          {/* Category Filter */}
          {block.showCategories && categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center mb-8"
            >
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                {categories.filter(cat => cat !== 'all').map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-md font-medium transition-all capitalize ${
                      selectedCategory === category
                        ? 'bg-white text-pink-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* FAQ Items */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredFAQs.map((faq: any, index: number) => {
                const isOpen = openItems.has(faq.originalIndex);
                
                return (
                  <motion.div
                    key={faq.originalIndex}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <motion.button
                      onClick={() => toggleItem(faq.originalIndex)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                    >
                      <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0"
                      >
                        <Plus className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    </motion.button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 text-gray-600 border-t border-gray-100">
                            <div className="pt-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600">No FAQs found for this category.</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// Frame Specifications Block Component
function FrameSpecificationsBlock({ block }: { block: any }) {
  const [activeSpec, setActiveSpec] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{block.title}</h2>
            {block.subtitle && (
              <p className="text-lg text-gray-600">{block.subtitle}</p>
            )}
          </motion.div>

          {/* Layout Rendering */}
          {block.layout === 'carousel' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
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
                className="specifications-swiper pb-12"
              >
                {block.specifications.map((spec: any, index: number) => (
                  <SwiperSlide key={index} style={{ width: '400px' }}>
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                      {spec.images && spec.images.length > 0 && (
                        <div className="aspect-video rounded-lg overflow-hidden mb-4">
                          <img
                            src={spec.images[0].image.url}
                            alt={spec.images[0].caption || spec.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{spec.title}</h3>
                      <div className="prose prose-sm text-gray-600" dangerouslySetInnerHTML={{ __html: spec.description }} />
                      
                      {spec.features && spec.features.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {spec.features.map((feature: any, featureIndex: number) => (
                            <div key={featureIndex} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{feature.feature}</span>
                              <span className="font-medium text-gray-900">{feature.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          )}

          {block.layout === 'tabs' && (
            <div>
              {/* Tab Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex justify-center mb-8 overflow-x-auto"
              >
                <div className="flex bg-gray-100 rounded-lg p-1 min-w-max">
                  {block.specifications.map((spec: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setActiveSpec(index)}
                      className={`px-4 py-2 rounded-md font-medium transition-all whitespace-nowrap ${
                        activeSpec === index
                          ? 'bg-white text-pink-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {spec.title}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSpec}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {block.specifications[activeSpec] && (
                    <div className="grid lg:grid-cols-2 gap-8 p-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          {block.specifications[activeSpec].title}
                        </h3>
                        <div className="prose text-gray-600 mb-6" dangerouslySetInnerHTML={{ 
                          __html: block.specifications[activeSpec].description 
                        }} />
                        
                        {block.specifications[activeSpec].features && (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Key Features</h4>
                            {block.specifications[activeSpec].features.map((feature: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700">{feature.feature}</span>
                                <span className="font-medium text-gray-900">{feature.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {block.specifications[activeSpec].images && 
                       block.specifications[activeSpec].images.length > 0 && (
                        <div className="space-y-4">
                          {block.specifications[activeSpec].images.length === 1 ? (
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <img
                                src={block.specifications[activeSpec].images[0].image.url}
                                alt={block.specifications[activeSpec].images[0].caption || block.specifications[activeSpec].title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <Swiper
                              modules={[Navigation, Pagination]}
                              spaceBetween={10}
                              slidesPerView={1}
                              navigation
                              pagination={{ clickable: true }}
                              className="aspect-video rounded-lg overflow-hidden"
                            >
                              {block.specifications[activeSpec].images.map((img: any, imgIndex: number) => (
                                <SwiperSlide key={imgIndex}>
                                  <img
                                    src={img.image.url}
                                    alt={img.caption || block.specifications[activeSpec].title}
                                    className="w-full h-full object-cover"
                                  />
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {block.layout === 'grid' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {block.specifications.map((spec: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {spec.images && spec.images.length > 0 && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={spec.images[0].image.url}
                        alt={spec.images[0].caption || spec.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{spec.title}</h3>
                    <div className="prose prose-sm text-gray-600" dangerouslySetInnerHTML={{ __html: spec.description }} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Comparison Table */}
          {block.showComparison && block.comparisonTable && block.comparisonTable.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Frame Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Classic</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Frameless</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Canvas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.comparisonTable.map((row: any, index: number) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-gray-900">{row.feature}</td>
                          <td className="py-3 px-4 text-center text-gray-600">{row.classic}</td>
                          <td className="py-3 px-4 text-center text-gray-600">{row.frameless}</td>
                          <td className="py-3 px-4 text-center text-gray-600">{row.canvas}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// Banner Block Component
function BannerBlock({ block }: { block: any }) {
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
      case 'left': return 'text-left items-start justify-start';
      case 'right': return 'text-right items-end justify-end';
      default: return 'text-center items-center justify-center';
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative ${getHeightClass()} flex ${getAlignmentClass()} overflow-hidden rounded-2xl`}
      style={{
        backgroundColor: block.backgroundColor,
        color: block.textColor,
      }}
    >
      {block.backgroundImage && (
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
        >
          <img
            src={block.backgroundImage.url}
            alt={block.backgroundImage.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      )}
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {block.title}
          </motion.h2>
          
          {block.subtitle && (
            <motion.p 
              className="text-xl md:text-2xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              {block.subtitle}
            </motion.p>
          )}
          
          {block.description && (
            <motion.div 
              className="prose prose-lg mb-8" 
              dangerouslySetInnerHTML={{ __html: block.description }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            />
          )}
          
          {block.buttons && block.buttons.length > 0 && (
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
            >
              {block.buttons.map((button: any, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
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
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}

// Slider Block Component
function SliderBlock({ block }: { block: any }) {
  const getHeightClass = () => {
    switch (block.height) {
      case 'small': return 'h-64';
      case 'medium': return 'h-96';
      case 'large': return 'h-[500px]';
      default: return 'h-auto';
    }
  };

  const getEffect = () => {
    switch (block.settings?.effect) {
      case 'fade': return EffectFade;
      case 'coverflow': return EffectCoverflow;
      default: return null;
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {block.title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{block.title}</h2>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade, EffectCoverflow]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={block.settings?.showNavigation}
            pagination={block.settings?.showPagination ? { clickable: true } : false}
            autoplay={block.settings?.autoplay ? {
              delay: block.settings.autoplayDelay || 5000,
              disableOnInteraction: false,
            } : false}
            loop={block.settings?.loop}
            effect={block.settings?.effect || 'slide'}
            fadeEffect={block.settings?.effect === 'fade' ? { crossFade: true } : undefined}
            coverflowEffect={block.settings?.effect === 'coverflow' ? {
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            } : undefined}
            className={`${getHeightClass()} rounded-2xl overflow-hidden shadow-xl`}
          >
            {block.slides.map((slide: any, index: number) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <motion.img
                    src={slide.image.url}
                    alt={slide.image.alt}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.2 }}
                    viewport={{ once: true }}
                  />
                  
                  {slide.overlay?.enabled && (
                    <div 
                      className="absolute inset-0"
                      style={{ backgroundColor: slide.overlay.color }}
                    />
                  )}
                  
                  {(slide.title || slide.description || slide.link) && (
                    <div className={`absolute inset-0 flex ${
                      slide.overlay?.position === 'bottom-left' ? 'items-end justify-start p-8' :
                      slide.overlay?.position === 'bottom-right' ? 'items-end justify-end p-8' :
                      slide.overlay?.position === 'top-left' ? 'items-start justify-start p-8' :
                      slide.overlay?.position === 'top-right' ? 'items-start justify-end p-8' :
                      'items-center justify-center'
                    }`}>
                      <motion.div
                        className="text-center text-white max-w-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                      >
                        {slide.title && (
                          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{slide.title}</h3>
                        )}
                        {slide.description && (
                          <div className="prose prose-lg prose-invert mb-6" dangerouslySetInnerHTML={{ __html: slide.description }} />
                        )}
                        {slide.link?.url && slide.link?.text && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button size="lg" asChild>
                              <a
                                href={slide.link.url}
                                target={slide.link.openInNewTab ? '_blank' : '_self'}
                                rel={slide.link.openInNewTab ? 'noopener noreferrer' : undefined}
                              >
                                {slide.link.text}
                              </a>
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}

// Custom HTML Block Component
function CustomHTMLBlock({ block }: { block: any }) {
  return (
    <motion.section 
      className={block.isFullWidth ? '' : 'py-12'}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
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
    </motion.section>
  );
}