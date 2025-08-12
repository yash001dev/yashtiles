import Link from 'next/link'
import { Star } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'

export default async function FeaturedProducts() {
  const payload = await getPayloadClient()
  
  const products = await payload.find({
    collection: 'products',
    where: {
      featured: {
        equals: true,
      },
      status: {
        equals: 'published',
      },
    },
    limit: 4,
    sort: '-createdAt',
  })

  if (products.docs.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our most popular frames, loved by customers worldwide for their quality and style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.docs.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="card-hover group"
            >
              <div className="aspect-square overflow-hidden">
                {product.images && product.images.length > 0 && typeof product.images[0].image === 'object' && (
                  <img
                    src={product.images[0].image.url!}
                    alt={product.images[0].alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.shortDescription}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-900">
                    ${product.basePrice}
                  </div>
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-current" />
                    ))}
                    <span className="text-gray-500 text-sm ml-1">(4.9)</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/products" className="btn-primary">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}