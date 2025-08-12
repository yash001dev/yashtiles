import Link from 'next/link'
import { Star } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'

interface RelatedProductsProps {
  productId: string
}

export default async function RelatedProducts({ productId }: RelatedProductsProps) {
  const payload = await getPayloadClient()
  
  const products = await payload.find({
    collection: 'products',
    where: {
      id: {
        not_equals: productId,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
  )
}