import { Suspense } from 'react';
import ProductListingPage from '@/components/products/ProductListingPage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const metadata = {
  title: 'Products - PhotoFramix',
  description: 'Browse our collection of high-quality photo frames and wall art products.',
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover our carefully curated collection of premium photo frames and wall art. 
            Transform your memories into stunning pieces that complement any space.
          </p>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <ProductListingPage />
        </Suspense>
      </div>
    </div>
  );
}