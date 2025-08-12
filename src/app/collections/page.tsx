import { Suspense } from 'react'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CollectionGrid from '@/components/CollectionGrid'

export const metadata: Metadata = {
  title: 'Collections - YashTiles',
  description: 'Browse our curated collections of premium custom frames. Find the perfect style for your space.',
}

export default function CollectionsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frame Collections
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections of premium frames, each designed to complement different styles and spaces.
            </p>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          }>
            <CollectionGrid />
          </Suspense>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}