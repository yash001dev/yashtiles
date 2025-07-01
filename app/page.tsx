'use client'
import Link from 'next/link'
import { ArrowRight, Sparkles, Frame, Download, Palette } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Frame className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">YashTiles</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-purple-600 transition-colors">About</a>
              <Link 
                href="/app" 
                className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <span>Design Your Frame</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="md:hidden">
              <Link 
                href="/app" 
                className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
              >
                Design
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Create Stunning
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Tile Frames</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform your photos with beautiful ceramic tile frames. Choose from premium materials, 
              customize sizes, and add stunning effects to create the perfect decorative piece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/app" 
                className="bg-purple-600 text-white px-8 py-4 rounded-full hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center space-x-3 text-lg font-semibold shadow-lg"
              >
                <Sparkles className="h-5 w-5" />
                <span>Start Designing</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="text-purple-600 hover:text-purple-700 font-semibold flex items-center space-x-2">
                <span>Watch Demo</span>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center ml-2">
                  <div className="w-0 h-0 border-l-[6px] border-l-purple-600 border-t-[4px] border-b-[4px] border-t-transparent border-b-transparent ml-1"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose YashTiles?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade tile framing tools with an intuitive interface
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Materials</h3>
              <p className="text-gray-600">
                Choose from high-quality ceramic, porcelain, and natural stone tiles with authentic textures and finishes.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Frame className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Custom Frames</h3>
              <p className="text-gray-600">
                Design unique frames with multiple tile patterns, borders, and decorative elements to match your style.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Download</h3>
              <p className="text-gray-600">
                Get high-resolution designs ready for printing or digital use. Perfect for home decor projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Create Your Masterpiece?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of creators who trust YashTiles for their decorative projects
          </p>
          <Link 
            href="/app" 
            className="bg-white text-purple-600 px-8 py-4 rounded-full hover:bg-gray-50 transition-all transform hover:scale-105 inline-flex items-center space-x-3 text-lg font-semibold shadow-xl"
          >
            <Sparkles className="h-5 w-5" />
            <span>Design Your Frame Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Frame className="h-8 w-8 text-purple-400" />
                <span className="ml-2 text-xl font-bold">YashTiles</span>
              </div>
              <p className="text-gray-400">
                Creating beautiful tile frames for your most precious memories.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link href="/app" className="hover:text-white transition-colors">Design Tool</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Gallery</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@yashtiles.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 YashTiles. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 