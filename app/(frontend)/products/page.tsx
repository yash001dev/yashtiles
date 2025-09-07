import { Suspense } from 'react';
import FrameItHeader from '@/components/dashboard/FrameItHeader';
import FrameItFooter from '@/components/dashboard/FrameItFooter';
import ProductsHero from './components/ProductsHero';
import ProductsFilters from './components/ProductsFilters';
import ProductsGrid from './components/ProductsGrid';
import ProductListingFAQSection from './components/ProductListingFAQSection';
import CategoriesCarousel from './components/CategoriesCarousel';
import { ProductsProvider } from './components/ProductsContext';

// Loading components
import CategoriesSkeleton from './components/CategoriesSkeleton';
import ProductsGridSkeleton from './components/ProductsGridSkeleton';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    view?: 'grid' | 'list';
  };
}

export default function ProductListingPage({ searchParams }: ProductsPageProps) {
  return (
    <ProductsProvider initialFilters={searchParams}>
      <FrameItHeader />
      
      {/* Hero Section */}
      <ProductsHero />

      {/* Categories with Suspense */}
      <section className="pb-2 bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesCarousel />
          </Suspense>
        </div>
      </section>

      {/* Filters Section */}
      <Suspense fallback={<div className="h-24 bg-white border-b animate-pulse" />}>
        <ProductsFilters />
      </Suspense>

      {/* Products Grid with Suspense */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Suspense fallback={<ProductsGridSkeleton />}>
            <ProductsGrid />
          </Suspense>
        </div>
      </section>

      {/* FAQ Section */}
      <ProductListingFAQSection />

      <FrameItFooter />
    </ProductsProvider>
  );
}