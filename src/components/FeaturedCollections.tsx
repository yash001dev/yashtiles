import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'

export default async function FeaturedCollections() {
  const payload = await getPayloadClient()
  
  const collections = await payload.find({
    collection: 'collections',
    where: {
      featured: {
        equals: true,
      },
    },
    limit: 3,
    sort: '-createdAt',
  })

  if (collections.docs.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Collections
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular frame collections, carefully curated for different styles and occasions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {collections.docs.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="card-hover group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                {collection.image && typeof collection.image === 'object' && (
                  <img
                    src={collection.image.url!}
                    alt={collection.image.alt || collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {collection.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {collection.description}
                </p>
                <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                  Explore Collection
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/collections" className="btn-secondary">
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  )
}