import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  company: [
    // { name: "About Us", href: "/about" },
    // { name: "Our Story", href: "/story" },
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
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/frameit" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/frameit" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/frameit" },
];

const FrameItFooter = () => {
  return (
    <footer className="bg-dark-green text-cream-50">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Brand section */}
            <div className="lg:col-span-4">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  FrameIt
                </h3>
                <p className="text-cream-50/80 leading-relaxed mb-6">
                  Transform your precious memories into stunning wall art with
                  our premium, handcrafted frames. Every photo deserves to be
                  treasured.
                </p>
              </div>

              {/* Newsletter signup */}
              <div className="bg-white/80 text-black shadow-lg rounded-xl p-6">
                <h4 className="font-semibold mb-3">Stay Updated</h4>
                <p className="text-sm  mb-4">
                  Get framing tips, design inspiration, and exclusive offers.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/10 border-black/20 text-black placeholder:text-black/50 "
                  />
                  <Button className=" text-white px-6">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Links sections */}
            <div className="lg:col-span-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Company */}
                <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-cream-50/70 hover:text-primarytransition-colors duration-300"
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
                          className="text-cream-50/70 hover:text-primary transition-colors duration-300"
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
                          className="text-cream-50/70 hover:text-primary transition-colors duration-300"
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
                        href="mailto:hello@frameit.com"
                        className="text-cream-50/70 hover:text-primary transition-colors duration-300"
                      >
                        hello@frameit.com
                      </a>
                    </div>
                    <p className="text-cream-50/70">1-555-FRAME-IT</p>
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
            <p className="text-cream-50/60 text-sm">
              © 2025 FrameIt. All rights reserved. Made with ❤️ for your
              memories.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <span className="text-cream-50/60 text-sm">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 rounded-full bg-cream-50/10 flex items-center justify-center text-cream-50/70 hover:bg-gold-500 hover:text-white transition-all duration-300"
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
