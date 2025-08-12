import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductGrid from '@/components/ProductGrid'
import { getPayloadClient } from '@/lib/payload'

interface CollectionPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const payload = await getPayloadClient()
  
  const collections = await payload.find({
    collection: 'collections',
    where: {
      slug: {
        equals: params.slug,
      },
    },
    limit: 1,
  })

  const collection = collections.docs[0]

  if (!collection) {
    return {
      title: 'Collection Not Found - YashTiles',
    }
  }

  return {
    title: `${collection.seo?.title || collection.name} - YashTiles`,
    description: collection.seo?.description || collection.description,
    keywords: collection.seo?.keywords,
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const payload = await getPayloadClient()
  
  const collections = await payload.find({
    collection: 'collections',
    where: {
      slug: {
        equals: params.slug,
      },
    },
    limit: 1,
  })

  const collection = collections.docs[0]

  if (!collection) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="bg-white">
        {/* Collection Header */}
        <div className="relative">
          <div className="aspect-[21/9] bg-gray-900">
            {collection.image && typeof collection.image === 'object' && (
              <img
                src={collection.image.url!}
                alt={collection.image.alt || collection.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <h1 className="text-5xl font-bold mb-4">{collection.name}</h1>
              <p className="text-xl opacity-90">{collection.description}</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
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
            <ProductGrid collectionSlug={params.slug} />
          </Suspense>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}