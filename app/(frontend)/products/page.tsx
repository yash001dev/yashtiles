import { Suspense } from 'react';
import { Metadata } from 'next';
import FrameItHeader from '@/components/dashboard/FrameItHeader';
import FrameItFooter from '@/components/dashboard/FrameItFooter';
import ProductsHero from './components/ProductsHero';
import ProductsFilters from './components/ProductsFilters';
import ProductsGrid from './components/ProductsGrid';
import ProductListingFAQSection from './components/ProductListingFAQSection';
import CategoriesCarousel from './components/CategoriesCarousel';
import { ProductsProvider } from './components/ProductsContext';
import { getProducts, getProductCategories } from '@/lib/payload-server';

// Loading components
import CategoriesSkeleton from './components/CategoriesSkeleton';
import ProductsGridSkeleton from './components/ProductsGridSkeleton';
import ProductsHeroSkeleton from './components/ProductsHeroSkeleton';
import ProductsFiltersSkeleton from './components/ProductsFiltersSkeleton';
import CategoriesCarouselServer from './components/CategoriesCarouselServer';

// SEO and structured data
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    view?: 'grid' | 'list';
  }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const { category, search } = resolvedSearchParams;
  
  // Fetch data for dynamic metadata
  const [products, categories] = await Promise.all([
    getProducts(),
    getProductCategories()
  ]);

  const selectedCategory = categories.find(cat => cat.slug === category);
  const productsCount = products.length;
  
  // Dynamic title and description based on filters
  let title = 'Premium Photo Frames & Custom Framing';
  let description = `Browse our collection of ${productsCount}+ premium photo frames. Transform your favorite memories into stunning wall art with our handcrafted frames.`;
  
  if (selectedCategory) {
    title = `${selectedCategory.name} Photo Frames - Premium Quality`;
    description = `Discover our ${selectedCategory.name.toLowerCase()} photo frame collection. High-quality frames perfect for showcasing your precious memories in style.`;
  }
  
  if (search) {
    title = `Search Results for "${search}" - Photo Frames`;
    description = `Find the perfect photo frames for "${search}". Browse our curated selection of premium frames to showcase your memories.`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://photoframix.com';
  const currentUrl = `${baseUrl}/products`;
  
  // Build canonical URL with search params
  let canonicalUrl = currentUrl;
  if (category || search) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    canonicalUrl = `${currentUrl}?${params.toString()}`;
  }

  return {
    title,
    description,
    keywords: [
      'photo frames',
      'picture frames', 
      'custom framing',
      'wall art',
      'home decor',
      'photo printing',
      'frame shop',
      'digital photo frames',
      ...(selectedCategory?.name ? [selectedCategory.name.toLowerCase()] : []),
      ...(search ? [search.toLowerCase()] : [])
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: process.env.NEXT_PUBLIC_APP_NAME,
      images: [
        {
          url: `${baseUrl}/og-products.jpg`,
          width: 1200,
          height: 630,
          alt: `${title} - ${process.env.NEXT_PUBLIC_APP_NAME}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-products.jpg`],
      site: '@photoframix',
      creator: '@photoframix',
    },
    alternates: {
      canonical: canonicalUrl,
    },
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
    other: {
      'product:count': productsCount.toString(),
      'product:category': selectedCategory?.name || 'All Categories',
    },
  };
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    view?: 'grid' | 'list';
  }>;
}

// Enhanced server component with proper error boundaries
export default async function ProductListingPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  
  // Pre-fetch data on server for SSR
  const [products, categories] = await Promise.all([
    getProducts().catch(error => {
      console.error('Failed to fetch products:', error);
      return [];
    }),
    getProductCategories().catch(error => {
      console.error('Failed to fetch categories:', error);
      return [];
    })
  ]);

  // JSON-LD structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Photo Frames Collection',
    description: 'Browse our premium collection of photo frames and custom framing solutions',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://photoframix.com'}/products`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 12).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'https://photoframix.com'}/products/${product.slug}`,
          name: product.name,
          description: product.shortDescription,
          image: product.liveViewImage.url,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          category: product.categories.map(cat => cat.name).join(', '),
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_APP_URL || 'https://photoframix.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Products',
          item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://photoframix.com'}/products`,
        },
      ],
    },
  };
  
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <ProductsProvider initialFilters={resolvedSearchParams}>
        <FrameItHeader />
        
        {/* Hero Section with Suspense */}
        {/* <Suspense fallback={<ProductsHeroSkeleton />}> */}
          <ProductsHero />
        {/* </Suspense> */}

        {/* Categories with Suspense and Error Boundary */}
        <section className="pb-2 bg-gradient-to-br from-pink-50 via-white to-purple-50">
          <div className="container mx-auto px-4">
            {/* <Suspense fallback={<CategoriesSkeleton />}> */}
              <CategoriesCarouselServer />
            {/* </Suspense> */}
          </div>
        </section>

        {/* Filters Section with Suspense */}
        <Suspense fallback={<ProductsFiltersSkeleton />}>
          <ProductsFilters />
        </Suspense>

        {/* Products Grid with Suspense and Server-side Rendering */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* <Suspense fallback={<ProductsGridSkeleton />}> */}
              <ProductsGrid 
                selectedCategory={resolvedSearchParams.category}
                searchQuery={resolvedSearchParams.search}
                sortBy={resolvedSearchParams.sort}
                viewMode={resolvedSearchParams.view}
                initialProducts={products}
                initialCategories={categories}
              />
            {/* </Suspense> */}
          </div>
        </section>

        {/* FAQ Section - Secondary content, rendered normally for performance */}
        <ProductListingFAQSection />

        <FrameItFooter />
      </ProductsProvider>
    </>
  );
}