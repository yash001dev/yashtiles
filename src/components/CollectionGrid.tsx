import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'

export default async function CollectionGrid() {
  const payload = await getPayloadClient()
  
  const collections = await payload.find({
    collection: 'collections',
    limit: 12,
    sort: '-createdAt',
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <p className="text-gray-600 mb-4 line-clamp-3">
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
  )
}