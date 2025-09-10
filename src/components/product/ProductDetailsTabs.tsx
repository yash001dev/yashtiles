"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { renderPayloadRichText } from "@/components/ui/renderPayloadRihText";

interface Product {
  description: any;
  specifications: {
    weight?: string;
    dimensions?: string;
    mounting: string;
  };
  features: Array<{
    feature: string;
  }>;
}

interface ProductDetailsTabsProps {
  product: Product;
}

export default function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "features", label: "Features" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8 max-w-full overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 md:px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  {renderPayloadRichText(product.description)}
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Technical Specifications
                    </h3>
                    <div className="space-y-3">
                      {product.specifications.weight && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Weight</span>
                          <span className="font-medium">
                            {product.specifications.weight}
                          </span>
                        </div>
                      )}
                      {product.specifications.dimensions && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Dimensions</span>
                          <span className="font-medium">
                            {product.specifications.dimensions}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Mounting</span>
                        <span className="font-medium capitalize">
                          {product.specifications.mounting.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "features" && (
                <div className="grid md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-white rounded-lg border"
                    >
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-gray-900">{feature.feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="text-center py-12">
                  <p className="text-gray-600">Reviews coming soon...</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
