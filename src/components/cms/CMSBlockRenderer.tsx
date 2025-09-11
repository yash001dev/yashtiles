import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div key={index} className="opacity-100">
          <BlockRenderer block={block} />
        </div>
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

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{block.title}</h2>
            {block.subtitle && (
              <p className="text-lg text-gray-600">{block.subtitle}</p>
            )}
          </div>

          {/* Categories Display */}
          {block.showCategories && categories.length > 1 && (
            <div className="mb-12">
              {categories.filter(cat => cat !== 'all').map((category) => (
                <div key={category} className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 capitalize">{category}</h3>
                  <div className="space-y-4">
                    {groupedFAQs[category].map((faq: any, index: number) => (
                      <details
                        key={faq.originalIndex}
                        className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <summary className="w-full px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                          <span className="flex-shrink-0 group-open:rotate-45 transition-transform duration-200">
                            <Check className="w-5 h-5 text-gray-500" />
                          </span>
                        </summary>
                        <div className="px-6 pb-4 text-gray-600 border-t border-gray-100">
                          <div className="pt-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All FAQs without categories */}
          {!block.showCategories && (
            <div className="space-y-4">
              {block.faqs.map((faq: any, index: number) => (
                <details
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <summary className="w-full px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    <span className="flex-shrink-0 group-open:rotate-45 transition-transform duration-200">
                      <Check className="w-5 h-5 text-gray-500" />
                    </span>
                  </summary>
                  <div className="px-6 pb-4 text-gray-600 border-t border-gray-100">
                    <div className="pt-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Frame Specifications Block Component
function FrameSpecificationsBlock({ block }: { block: any }) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{block.title}</h2>
            {block.subtitle && (
              <p className="text-lg text-gray-600">{block.subtitle}</p>
            )}
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {block.specifications.map((spec: any, index: number) => (
              <div
                key={index}
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
                  <div className="prose prose-sm text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: spec.description }} />
                  
                  {spec.features && spec.features.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Features:</h4>
                      {spec.features.map((feature: any, featureIndex: number) => (
                        <div key={featureIndex} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                          <span className="text-gray-600">{feature.feature}</span>
                          <span className="font-medium text-gray-900">{feature.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          {block.showComparison && block.comparisonTable && block.comparisonTable.length > 0 && (
            <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
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
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-gray-900">{row.feature}</td>
                          <td className="py-3 px-4 text-center text-gray-600">{row.classic}</td>
                          <td className="py-3 px-4 text-center text-gray-600">{row.frameless}</td>
                          <td className="py-3 px-4 text-center text-gray-600">{row.canvas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
    <section 
      className={`relative ${getHeightClass()} flex ${getAlignmentClass()} overflow-hidden rounded-2xl`}
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
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {block.title}
          </h2>
          
          {block.subtitle && (
            <p className="text-xl md:text-2xl mb-6">
              {block.subtitle}
            </p>
          )}
          
          {block.description && (
            <div 
              className="prose prose-lg mb-8" 
              dangerouslySetInnerHTML={{ __html: block.description }}
            />
          )}
          
          {block.buttons && block.buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {block.buttons.map((button: any, index: number) => (
                <div key={index}>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
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

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {block.title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{block.title}</h2>
          </div>
        )}
        
        <div className={`${getHeightClass()} rounded-2xl overflow-hidden shadow-xl`}>
          {/* Display first slide as static image */}
          {block.slides && block.slides.length > 0 && (
            <div className="relative w-full h-full">
              <img
                src={block.slides[0].image.url}
                alt={block.slides[0].image.alt}
                className="w-full h-full object-cover"
              />
              
              {block.slides[0].overlay?.enabled && (
                <div 
                  className="absolute inset-0"
                  style={{ backgroundColor: block.slides[0].overlay.color }}
                />
              )}
              
              {(block.slides[0].title || block.slides[0].description || block.slides[0].link) && (
                <div className={`absolute inset-0 flex ${
                  block.slides[0].overlay?.position === 'bottom-left' ? 'items-end justify-start p-8' :
                  block.slides[0].overlay?.position === 'bottom-right' ? 'items-end justify-end p-8' :
                  block.slides[0].overlay?.position === 'top-left' ? 'items-start justify-start p-8' :
                  block.slides[0].overlay?.position === 'top-right' ? 'items-start justify-end p-8' :
                  'items-center justify-center'
                }`}>
                  <div className="text-center text-white max-w-2xl">
                    {block.slides[0].title && (
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{block.slides[0].title}</h3>
                    )}
                    {block.slides[0].description && (
                      <div className="prose prose-lg prose-invert mb-6" dangerouslySetInnerHTML={{ __html: block.slides[0].description }} />
                    )}
                    {block.slides[0].link?.url && block.slides[0].link?.text && (
                      <div>
                        <Button size="lg" asChild>
                          <a
                            href={block.slides[0].link.url}
                            target={block.slides[0].link.openInNewTab ? '_blank' : '_self'}
                            rel={block.slides[0].link.openInNewTab ? 'noopener noreferrer' : undefined}
                          >
                            {block.slides[0].link.text}
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Show other slides as thumbnails if there are multiple */}
        {block.slides && block.slides.length > 1 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {block.slides.slice(1).map((slide: any, index: number) => (
                <div key={index + 1} className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={slide.image.url}
                    alt={slide.image.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Custom HTML Block Component
function CustomHTMLBlock({ block }: { block: any }) {
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