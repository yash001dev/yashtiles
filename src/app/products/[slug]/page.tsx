import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetails from '@/components/ProductDetails'
import RelatedProducts from '@/components/RelatedProducts'
import { getPayloadClient } from '@/lib/payload'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const payload = await getPayloadClient()
  
  const products = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: params.slug,
      },
    },
    limit: 1,
  })

  const product = products.docs[0]

  if (!product) {
    return {
      title: 'Product Not Found - YashTiles',
    }
  }

  return {
    title: `${product.seo?.title || product.name} - YashTiles`,
    description: product.seo?.description || product.shortDescription,
    keywords: product.seo?.keywords,
    openGraph: {
      title: `${product.seo?.title || product.name} - YashTiles`,
      description: product.seo?.description || product.shortDescription,
      images: product.images?.length > 0 && typeof product.images[0].image === 'object' 
        ? [{ url: product.images[0].image.url! }] 
        : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const payload = await getPayloadClient()
  
  const products = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: params.slug,
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
  })

  const product = products.docs[0]

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductDetails product={product} />
        </div>
        
        <div className="border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
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
              <RelatedProducts productId={product.id} />
            </Suspense>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}