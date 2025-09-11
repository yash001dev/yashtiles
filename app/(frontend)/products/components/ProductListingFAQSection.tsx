import { ChevronDown } from 'lucide-react';

export default function ProductListingFAQSection() {
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
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Common questions about our frames and services</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-gray-200 rounded-lg overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <summary className="w-full px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors list-none">
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                
                <div className="px-6 pb-4 text-gray-600 animate-fade-in">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
