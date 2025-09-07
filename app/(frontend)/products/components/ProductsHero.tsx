'use client';

import { motion } from 'framer-motion';

export default function ProductsHero() {
  return (
    <section className="pt-16 pb-2 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Ready-Made Frames
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of premium frames, ready to transform your space
          </p>
        </motion.div>
      </div>
    </section>
  );
}
