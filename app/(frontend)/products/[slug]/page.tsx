import React from "react";
import { Star, Truck, Shield, RotateCcw } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import FrameItHeader from "@/components/dashboard/FrameItHeader";
import FrameItFooter from "@/components/dashboard/FrameItFooter";
import ProductGallery from "@/components/product/ProductGallery";
import ProductControls from "@/components/product/ProductControls";
import ProductDetailsTabs from "@/components/product/ProductDetailsTabs";
import ProductFAQSection from "@/components/product/ProductFAQSection";
import RelatedProducts from "@/components/product/RelatedProducts";
import FeatureBlockPayload from "@/components/ui/FeatureBlockPayload";
import { 
  getProductBySlug, 
  getPageContent, 
  getSizes,
  getProductsByCategory 
} from "@/lib/payload-server";
import type { Product, ProductCategory } from "payload-types";

// Type transformation helpers
function transformProductForGallery(product: Product) {
  return {
    ...product,
    id: product.id.toString(),
    images: product.images.map(img => ({
      image: {
        url: typeof img.image === 'number' ? '' : img.image.url || '',
        alt: typeof img.image === 'number' ? img.alt : img.image.alt || img.alt
      },
      alt: img.alt
    })),
    liveViewImage: typeof product.liveViewImage === 'number' ? undefined : {
      id: product.liveViewImage.id,
      url: product.liveViewImage.url || '',
      alt: product.liveViewImage.alt || '',
      caption: product.liveViewImage.caption || undefined,
      filename: product.liveViewImage.filename || '',
      mimeType: product.liveViewImage.mimeType || '',
      filesize: product.liveViewImage.filesize || 0,
      width: product.liveViewImage.width || 0,
      height: product.liveViewImage.height || 0
    }
  };
}

function transformProductForControls(product: Product) {
  return {
    ...product,
    id: product.id.toString(),
    stock: product.stock || 0,
    images: product.images.map(img => ({
      image: {
        url: typeof img.image === 'number' ? '' : img.image.url || '',
        alt: typeof img.image === 'number' ? img.alt : img.image.alt || img.alt
      },
      alt: img.alt
    })),
    availableSizes: product.availableSizes
      .filter((size): size is import("payload-types").Size => typeof size !== 'number')
      .map(size => ({ 
        ...size, 
        id: size.id.toString(),
        aspectRatio: parseFloat(size.aspectRatio) || 1
      })),
    defaultColors: product.defaultColors
      .filter((color): color is import("payload-types").FrameColor => typeof color !== 'number')
      .map(color => ({ ...color, id: color.id.toString() })),
    additionalColors: product.additionalColors
      ?.filter((color): color is import("payload-types").FrameColor => typeof color !== 'number')
      ?.map(color => ({ ...color, id: color.id.toString() })) || [],
    defaultMaterials: product.defaultMaterials
      .filter((material): material is import("payload-types").Material => typeof material !== 'number')
      .map(material => ({ 
        ...material, 
        id: material.id.toString(),
        content: material.content || ''
      })),
    additionalMaterials: product.additionalMaterials
      ?.filter((material): material is import("payload-types").Material => typeof material !== 'number')
      ?.map(material => ({ 
        ...material, 
        id: material.id.toString(),
        content: material.content || ''
      })) || [],
    variantPricing: product.variantPricing?.map(vp => ({
      size: typeof vp.size === 'number' ? { id: vp.size.toString(), name: '', price: 0 } : { 
        id: vp.size.id.toString(), 
        name: vp.size.name, 
        price: vp.size.price 
      },
      color: typeof vp.color === 'number' ? { id: vp.color.toString(), name: '' } : { 
        id: vp.color.id.toString(), 
        name: vp.color.name 
      },
      material: typeof vp.material === 'number' ? { id: vp.material.toString(), name: '' } : { 
        id: vp.material.id.toString(), 
        name: vp.material.name 
      },
      priceModifier: vp.priceModifier || 0,
      stock: vp.stock || 0,
      isAvailable: vp.isAvailable || false
    })) || [],
    specifications: product.specifications ? {
      weight: product.specifications.weight || undefined,
      dimensions: product.specifications.dimensions || undefined,
      mounting: product.specifications.mounting || ''
    } : {
      mounting: ''
    }
  };
}

function transformProductForTabs(product: Product) {
  return {
    ...product,
    features: product.features?.map(f => ({ feature: f.feature })) || [],
    specifications: product.specifications ? {
      weight: product.specifications.weight || undefined,
      dimensions: product.specifications.dimensions || undefined,
      mounting: product.specifications.mounting || ''
    } : {
      mounting: ''
    }
  };
}

function transformCategoriesForRelated(categories: (number | ProductCategory)[]) {
  return categories
    .filter((cat): cat is ProductCategory => typeof cat !== 'number')
    .map(cat => ({
      id: cat.id.toString(),
      name: cat.name,
      slug: cat.slug
    }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch all data server-side
  const [product] = await Promise.all([
    getProductBySlug(slug),
  ]);

  // Fetch related products if we have categories
  let relatedProducts: any[] = [];
  if (product && product.categories && product.categories.length > 0) {
    const firstCategory = product.categories[0];
    if (typeof firstCategory !== 'number' && firstCategory.slug) {
      relatedProducts = await getProductsByCategory(firstCategory.slug, 8, product.id.toString());
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <>
      <FrameItHeader />

      {/* Breadcrumb */}
      <nav className="bg-white border-b py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-pink-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-pink-600">
              Products
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </nav>

      {/* Product Details */}
      <section className="py-3 md:py-5 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
            {/* Left Column - Product Gallery */}
            <ProductGallery
              images={transformProductForGallery(product).images}
              liveViewImage={transformProductForGallery(product).liveViewImage}
              productName={product.name}
            />

            {/* Right Column - Product Info */}
            <div className="w-full lg:w-1/2 lg:pr-4">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {product.name}
                    </h1>
                    {product?.featured && (
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
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        (4.8) • 127 reviews
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      SKU: {product.sku}
                    </span>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Product Controls (Client Component) */}
                <ProductControls product={transformProductForControls(product)} />

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 py-6 border-t">
                  <div className="text-center">
                    <Truck className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">
                      Free Shipping
                    </div>
                    <div className="text-xs text-gray-600">
                      On orders over ₹2000
                    </div>
                  </div>
                  <div className="text-center">
                    <Shield className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">
                      Quality Guarantee
                    </div>
                    <div className="text-xs text-gray-600">
                      7-day satisfaction
                    </div>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">
                      Easy Returns
                    </div>
                    <div className="text-xs text-gray-600">
                      Hassle-free process
                    </div>
                  </div>
                </div>

                {/* Product Details Tabs - Mobile Optimized */}
                <div className="lg:hidden">
                  <ProductDetailsTabs product={transformProductForTabs(product)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs - Desktop */}
      <div className="hidden lg:block">
        <ProductDetailsTabs product={transformProductForTabs(product)} />
      </div>

      {/* Feature Block component */}
      {(product as any).featureBlocks &&
        (product as any).featureBlocks.map((block: any, index: number) => {
          if (block.items && block.items.length > 0) {
            return (
              <FeatureBlockPayload
                key={block.id || index}
                items={block?.items}
              />
            );
          }
          return null;
        })}

      {/* CMS Content Blocks */}
      {/* {pageContent && <CMSContentRenderer content={pageContent.content || []} />} */}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts
          categories={transformCategoriesForRelated(product.categories)}
          currentProductId={product.id.toString()}
          products={relatedProducts}
        />
      )}

      {/* FAQ Section */}
      {(product as any).faqBlocks &&
        (product as any).faqBlocks.map((block: any, index: number) => {
          if (block.faqs && block.faqs.length > 0) {
            return (
              <ProductFAQSection key={block.id || index} faqBlock={block} />
            );
          }
          return null;
        })}

      <FrameItFooter />
    </>
  );
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  // You can implement this to pre-generate common product pages
  return [];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  // Extract product details for metadata
  const productImages = product.images.map((img) => ({
    url: typeof img.image === 'number' ? '' : img.image.url || '',
    alt: img.alt || product.name,
    width: typeof img.image === 'number' ? 800 : img.image.width || 800,
    height: typeof img.image === 'number' ? 600 : img.image.height || 600,
  }));

  const firstImage = productImages[0];
  const basePrice = product.basePrice || 0;
  const currency = 'INR';
  const availability = (product.stock && product.stock > 0) ? 'in stock' : 'out of stock';
  
  // Generate category breadcrumb
  const categories = product.categories
    ?.filter((cat): cat is import("payload-types").ProductCategory => typeof cat !== 'number')
    ?.map(cat => cat.name) || [];

  return {
    title: `${product.name} | photoframix - Premium Photo Frames`,
    description: product.shortDescription || `Shop ${product.name} at photoframix. High-quality photo frames with premium materials and craftsmanship.`,
    keywords: [
      product.name,
      'photo frames',
      'picture frames',
      'wall decor',
      'home decor',
      'custom frames',
      'photoframix',
      ...categories,
      ...(product.features?.map(f => f.feature) || [])
    ].join(', '),
    
    authors: [{ name: 'photoframix' }],
    creator: 'photoframix',
    publisher: 'photoframix',
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    openGraph: {
      type: 'website',
      title: `${product.name} | photoframix`,
      description: product.shortDescription || `Shop ${product.name} at photoframix. High-quality photo frames with premium materials and craftsmanship.`,
      url: `https://photoframix.com/products/${slug}`,
      siteName: 'photoframix',
      locale: 'en_IN',
      images: productImages.map(img => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt,
        type: 'image/jpeg',
      })),
    },

    twitter: {
      card: 'summary_large_image',
      site: '@photoframix',
      creator: '@photoframix',
      title: `${product.name} | photoframix`,
      description: product.shortDescription || `Shop ${product.name} at photoframix. High-quality photo frames with premium materials and craftsmanship.`,
      images: firstImage ? [firstImage.url] : [],
    },

    // Additional meta tags
    other: {
      // Product specific meta tags
      'product:brand': 'photoframix',
      'product:availability': availability,
      'product:condition': 'new',
      'product:price:amount': basePrice.toString(),
      'product:price:currency': currency,
      'product:retailer_item_id': product.sku || product.id.toString(),
      
      // Ratings (placeholder - you can make this dynamic)
      'product:rating:value': '4.8',
      'product:rating:scale': '5',
      'product:rating:count': '127',
      
      // Additional SEO tags
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
      
      // Schema.org structured data
      'application-ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.shortDescription,
        image: productImages.map(img => img.url),
        brand: {
          '@type': 'Brand',
          name: 'photoframix'
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'photoframix'
        },
        sku: product.sku || product.id.toString(),
        gtin: product.sku || product.id.toString(),
        category: categories.join(', '),
        offers: {
          '@type': 'Offer',
          url: `https://photoframix.com/products/${slug}`,
          priceCurrency: currency,
          price: basePrice,
          availability: availability === 'in stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'photoframix'
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: 0,
              currency: currency
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 2,
                unitCode: 'DAY'
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 3,
                maxValue: 7,
                unitCode: 'DAY'
              }
            }
          }
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '127',
          bestRating: '5',
          worstRating: '1'
        },
        review: [
          {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5'
            },
            author: {
              '@type': 'Person',
              name: 'Anonymous Customer'
            },
            reviewBody: 'Excellent quality photo frame. Perfect finish and great value for money.',
            datePublished: new Date().toISOString().split('T')[0]
          }
        ],
        ...(product.specifications && {
          additionalProperty: [
            ...(product.specifications.weight ? [{
              '@type': 'PropertyValue',
              name: 'Weight',
              value: product.specifications.weight
            }] : []),
            ...(product.specifications.dimensions ? [{
              '@type': 'PropertyValue',
              name: 'Dimensions',
              value: product.specifications.dimensions
            }] : []),
            ...(product.specifications.mounting ? [{
              '@type': 'PropertyValue',
              name: 'Mounting Type',
              value: product.specifications.mounting.replace('_', ' ')
            }] : [])
          ]
        })
      })
    },

    // Canonical URL
    alternates: {
      canonical: `https://photoframix.com/products/${slug}`,
    },

    // Verification tags (add your actual verification codes)
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },

    // App links for mobile apps (if you have any)
    appLinks: {
      web: {
        url: `https://photoframix.com/products/${slug}`,
        should_fallback: true,
      },
    },

    // Archive and categorization
    category: categories[0] || 'Photo Frames',
  };
}
