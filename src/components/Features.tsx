import { Truck, Shield, Palette, Clock } from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: 'Custom Design',
    description: 'Create unique frames with our easy-to-use customization tools. Choose materials, sizes, and colors.',
  },
  {
    icon: Shield,
    title: 'Premium Quality',
    description: 'Made with the finest materials and expert craftsmanship. Every frame is built to last a lifetime.',
  },
  {
    icon: Clock,
    title: 'Fast Processing',
    description: 'Your custom frames are processed within 24 hours and shipped with care to your doorstep.',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Enjoy free shipping on all orders over $50. Fast, secure delivery with tracking included.',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose YashTiles?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing the best custom framing experience with premium quality and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <feature.icon size={32} className="text-primary-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}