import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FooterNewsletterForm from '@/components/common/FooterNewsletterForm';

const footerLinks = {
  quickLinks: [
    // { name: "About Us", href: "/about" },
    // { name: "Our Story", href: "/story" },
    { name: "Home", href: "/" },
    { name: "Installation Guide", href: "/installation" },
  ],
  support: [
    { name: "Contact", href: "/contact" },
    // { name: "FAQ", href: "#faq" },
    // { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    // { name: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/" + process.env.NEXT_PUBLIC_APP_NAME },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/" + process.env.NEXT_PUBLIC_APP_NAME },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/" + process.env.NEXT_PUBLIC_APP_NAME },
];

const FrameItFooter = () => {
  return (
    <footer className="bg-dark-green">
      {/* Main footer content */}
      <div className="container mx-auto px-4 pt-6 pb-0">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Brand section */}
            <div className="lg:col-span-4">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </h3>
                <p className=" leading-relaxed mb-6">
                  Transform your precious memories into stunning wall art with
                  our premium, handcrafted frames. Every photo deserves to be
                  treasured.
                </p>
              </div>

              {/* Newsletter signup */}
              
              <FooterNewsletterForm />
            </div>

            {/* Links sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {/* Quick Links */}
                <div>
                  <h4 className="font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-3">
                    {footerLinks.quickLinks.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="hover:text-primary transition-colors duration-300"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-3">
                    {footerLinks.support.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className=" hover:text-primary transition-colors duration-300"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal & Contact */}
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-3 mb-6">
                    {footerLinks.legal.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className=" hover:text-primary transition-colors duration-300"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>

                  {/* Contact info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <a
                        href="mailto:hello@photoframix.com"
                        className=" hover:text-primary transition-colors duration-300"
                      >
                        hello@photoframix.com
                      </a>
                    </div>
                    <p className="">1-555-FRAME-IT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-cream-50/10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm">
              © 2025 {process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved. Made with ❤️ for your
              memories.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <span className="text-sm">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 rounded-full bg-cream-50/10 flex items-center justify-center /70 hover:bg-gold-500 hover: transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </footer>
  );
};

export default FrameItFooter;
