import React from "react";
import { Check } from "lucide-react";
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
  const faqs = faqBlock.faqs || [];

  if (faqs.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {faqBlock.title || "Frequently Asked Questions"}
            </h2>
            {faqBlock.subtitle && (
              <p className="text-lg text-gray-600">{faqBlock.subtitle}</p>
            )}
          </div>

          {faqBlock.style === "accordion" && (
            <div className="space-y-4">
              {faqs.map((faq: FAQ, index: number) => (
                <details
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden group"
                >
                  <summary className="w-full px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors list-none">
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 group-open:rotate-45 transition-transform duration-200">
                      <Check className="w-5 h-5 text-gray-500" />
                    </span>
                  </summary>
                  <div className="px-6 pb-4 text-gray-600">
                    {typeof faq.answer === "string" ? (
                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    ) : (
                      <div>{renderPayloadRichText(faq.answer)}</div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}

          {faqBlock.style === "cards" && (
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq: FAQ, index: number) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
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
                </div>
              ))}
            </div>
          )}

          {(faqBlock.style === "tabs" || !faqBlock.style) && (
            <div className="space-y-4">
              {faqs.map((faq: FAQ, index: number) => (
                <details
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden group"
                >
                  <summary className="w-full px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors list-none">
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 group-open:rotate-45 transition-transform duration-200">
                      <Check className="w-5 h-5 text-gray-500" />
                    </span>
                  </summary>
                  <div className="px-6 pb-4 text-gray-600">
                    {typeof faq.answer === "string" ? (
                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    ) : (
                      <div>{renderPayloadRichText(faq.answer)}</div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
