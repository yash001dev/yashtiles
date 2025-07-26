'use client';
import NewsletterForm from './NewsletterForm';

const FooterNewsletterForm = () => (
  <div className="bg-white/80 text-black shadow-lg rounded-xl p-6">
    <h4 className="font-semibold mb-3">Stay Updated</h4>
    <p className="text-sm mb-4">
      Get framing tips, design inspiration, and exclusive offers.
    </p>
    <NewsletterForm />
  </div>
);

export default FooterNewsletterForm; 