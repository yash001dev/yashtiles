import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I upload my photos?",
    answer:
      "Simply click 'Start Framing' and you'll be guided through our easy upload process. You can upload photos directly from your device, or import from social media platforms like Instagram or Facebook. We accept JPEG, PNG, and HEIC formats with high resolution for the best quality prints.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 7-10 business days from the time you approve your preview. We offer express shipping (3-5 business days) and rush orders (24-48 hours) for an additional fee. All frames are carefully packaged to arrive in perfect condition.",
  },
  {
    question: "Can I preview the final product before purchase?",
    answer:
      "Absolutely! After uploading your photo and selecting your frame, you'll receive a detailed digital preview showing exactly how your framed photo will look. You can request adjustments to positioning, sizing, or frame selection before we start production.",
  },
  {
    question: "What if I'm not happy with my frame?",
    answer:
      "We offer a 100% satisfaction guarantee. If you're not completely happy with your frame, contact us within 7 daysand we'll remake it free of charge or provide a full refund. Your happiness is our top priority.",
  },
  {
    question: "Are these frames easy to hang?",
    answer:
      "Yes! Every frame comes with pre-installed hanging hardware and detailed instructions. We include both sawtooth hangers and wire backing systems depending on the frame size. We also provide a simple template to help you mark the wall for perfect placement.",
  },
  {
    question: "What frame materials do you offer?",
    answer:
      "We specialize in premium wood frames including Oak, Walnut, Birch, and Ash in various finishes. All our frames are handcrafted by skilled artisans using sustainable materials. We also offer metal frames in classic colors for a more modern look.",
  },
];

const FrameItFAQ = () => {
  return (
    <section className="py-20 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-charcoal-800/70 max-w-2xl mx-auto">
              Everything you need to know about our framing process, delivery,
              and quality guarantee.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="rounded-2xl p-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-xl border border-dark-green/50 px-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <AccordionTrigger className="text-left font-semibold text-dark-green hover:text-green-800 transition-colors duration-300 py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-charcoal-800/80 leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Still have questions CTA */}
          {/* <div className="text-center mt-12 bg-gradient-to-r from-gold-500/10 to-wood-500/10 rounded-2xl p-8 border border-gold-500/20">
            <h3 className="text-xl font-bold text-charcoal-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-charcoal-800/70 mb-6">
              Our friendly customer service team is here to help you every step
              of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@frameit.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-gold-500 text-white font-semibold rounded-xl hover:bg-gold-600 transition-colors duration-300"
              >
                Email Us
              </a>
              <a
                href="tel:+1-555-FRAME-IT"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-charcoal-800 font-semibold rounded-xl border border-charcoal-800/20 hover:bg-charcoal-800 hover:text-white transition-colors duration-300"
              >
                Call Us
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default FrameItFAQ;
