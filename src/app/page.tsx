import { Suspense } from 'react'
import Hero from '@/components/Hero'
import FeaturedCollections from '@/components/FeaturedCollections'
import FeaturedProducts from '@/components/FeaturedProducts'
import Features from '@/components/Features'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Suspense fallback={<div className="py-20 text-center">Loading collections...</div>}>
        <FeaturedCollections />
      </Suspense>
      <Suspense fallback={<div className="py-20 text-center">Loading products...</div>}>
        <FeaturedProducts />
      </Suspense>
      <Features />
      <Newsletter />
      <Footer />
    </main>
  )
}