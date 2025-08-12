import { Suspense } from 'react'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductGrid from '@/components/ProductGrid'
import ProductFilters from '@/components/ProductFilters'

export const metadata: Metadata = {
  title: 'All Products - YashTiles',
  description: 'Browse our complete collection of premium custom frames. Find the perfect frame for your memories.',
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All Products
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our complete collection of premium custom frames, designed to showcase your most precious memories.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters />
            </aside>
            
            <div className="flex-1">
              <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="aspect-square bg-gray-200" />
                      <div className="p-4">
                        <div className="h-5 bg-gray-200 rounded mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                        <div className="h-6 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              }>
                <ProductGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}