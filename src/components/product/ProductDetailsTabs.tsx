import React from "react";
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
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Description Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Description</h2>
            <div className="prose max-w-none bg-white p-6 rounded-lg border">
              {renderPayloadRichText(product.description)}
            </div>
          </div>

          {/* Specifications Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Specifications</h2>
            <div className="bg-white p-6 rounded-lg border">
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
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Features</h2>
            <div className="bg-white p-6 rounded-lg border">
              <div className="grid md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border"
                  >
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900">{feature.feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Reviews</h2>
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-center py-12">
                <p className="text-gray-600">Reviews coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
