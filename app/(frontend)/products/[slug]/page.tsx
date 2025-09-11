import React from "react";
import { Star, Truck, Shield, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import FrameItHeader from "@/components/dashboard/FrameItHeader";
import FrameItFooter from "@/components/dashboard/FrameItFooter";
import ProductGallery from "@/components/product/ProductGallery";
import ProductControls from "@/components/product/ProductControls";
import ProductDetailsTabs from "@/components/product/ProductDetailsTabs";
import ProductFAQSection from "@/components/product/ProductFAQSection";
import CMSContentRenderer from "@/components/product/CMSContentRenderer";
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
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = params;

  // Fetch all data server-side
  const [product, pageContent, sizes] = await Promise.all([
    getProductBySlug(slug),
    getPageContent("pdp"),
    getSizes(),
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
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | YashTiles`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images.map((img) => ({
        url: typeof img.image === 'number' ? '' : img.image.url || '',
        alt: img.alt,
      })),
    },
  };
}
