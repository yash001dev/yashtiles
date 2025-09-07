'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function ProductListingFAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqs = [
    {
      question: "How do I choose the right frame for my photo?",
      answer: "Consider your photo's style, your room's decor, and the mood you want to create. Classic frames work well for traditional photos, while frameless options suit modern spaces. Our frame guide can help you decide."
    },
    {
      question: "What's the difference between frame materials?",
      answer: "Classic frames offer a traditional look with wooden borders, frameless frames provide a modern, clean aesthetic, and canvas frames give a textured, artistic finish. Each material affects the overall presentation of your photo."
    },
    {
      question: "Can I see how the frame will look before ordering?",
      answer: "Yes! Our frame customizer lets you preview exactly how your photo will look in different frame styles, sizes, and colors before you place your order."
    },
    {
      question: "Do you offer custom sizes?",
      answer: "We offer a wide range of standard sizes from 8×8 to 32×24 inches. For custom sizes, please contact our support team and we'll be happy to help with a custom quote."
    },
    {
      question: "What's your return policy?",
      answer: "We offer a 7-day satisfaction guarantee. If you're not completely happy with your frame, we'll exchange it or provide a full refund. Your satisfaction is our priority."
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Common questions about our frames and services</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
                initial={false}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openItems.has(index) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openItems.has(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
