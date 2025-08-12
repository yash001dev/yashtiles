import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Beautiful framed photos on wall"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your
            <span className="text-primary-600"> Memories</span>
            <br />
            Into Beautiful Frames
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create stunning custom frames that showcase your most precious moments. 
            Premium quality materials, expert craftsmanship, and fast delivery guaranteed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/custom" className="btn-primary inline-flex items-center justify-center group">
              Start Customizing
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link href="/collections" className="btn-secondary inline-flex items-center justify-center">
              Browse Collections
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">24h</div>
              <div className="text-gray-600">Fast Processing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-gray-600">Quality Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}