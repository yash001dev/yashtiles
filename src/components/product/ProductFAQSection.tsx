"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { renderPayloadRichText } from "@/components/ui/renderPayloadRihText";

interface FAQ {
  question: string;
  answer: any;
  category?: string;
  sortOrder?: number;
  id?: string;
}

interface FAQBlock {
  title?: string;
  subtitle?: string;
  faqs?: FAQ[];
  style?: "accordion" | "tabs" | "cards";
  showCategories?: boolean;
  id?: string;
  blockName?: string;
}

interface ProductFAQSectionProps {
  faqBlock: FAQBlock;
}

export default function ProductFAQSection({ faqBlock }: ProductFAQSectionProps) {
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

  const faqs = faqBlock.faqs || [];

  if (faqs.length === 0) return null;

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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {faqBlock.title || "Frequently Asked Questions"}
            </h2>
            {faqBlock.subtitle && (
              <p className="text-lg text-gray-600">{faqBlock.subtitle}</p>
            )}
          </motion.div>

          {faqBlock.style === "accordion" && (
            <div className="space-y-4">
              {faqs.map((faq: FAQ, index: number) => (
                <motion.div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                  initial={false}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
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
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-4 pb-0 text-gray-600">
                          {typeof faq.answer === "string" ? (
                            <div
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          ) : (
                            <div>{renderPayloadRichText(faq.answer)}</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}

          {faqBlock.style === "cards" && (
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq: FAQ, index: number) => (
                <motion.div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <div className="text-gray-600">
                    {typeof faq.answer === "string" ? (
                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    ) : (
                      <div>{renderPayloadRichText(faq.answer)}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {(faqBlock.style === "tabs" || !faqBlock.style) && (
            <div className="space-y-4">
              {faqs.map((faq: FAQ, index: number) => (
                <motion.div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                  initial={false}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
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
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 text-gray-600">
                          {typeof faq.answer === "string" ? (
                            <div
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          ) : (
                            <div>{renderPayloadRichText(faq.answer)}</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
