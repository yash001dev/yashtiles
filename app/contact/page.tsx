import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import FrameItHeader from "@/components/dashboard/FrameItHeader";
import FrameItFooter from "@/components/dashboard/FrameItFooter";
import { Input } from "@/components/ui/input";


export const metadata = {
  title: "Contact Us - " + process.env.NEXT_PUBLIC_APP_NAME,
  description:
    "Get in touch with " + process.env.NEXT_PUBLIC_APP_NAME + ". We're here to help with your photo framing needs.",
};

export default function ContactPage() {
  return (
    <>
      <FrameItHeader />
      {/* Hero Section */}
      <section className=" py-10 md:py-20 bg-dark-green ">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold  mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl /80 max-w-2xl mx-auto">
              Have questions about our framing services? Need help with your
              order? We&apos;re here to help you create the perfect framed memories.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className=" py-10 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-charcoal-900 mb-8">
                  Send us a Message
                </h2>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-charcoal-800 mb-2"
                      >
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-charcoal-800 mb-2"
                      >
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-charcoal-800 mb-2"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-charcoal-800 mb-2"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="How can we help you?"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-charcoal-800 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      placeholder="Tell us about your framing needs..."
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2  focus:border-transparent resize-none"
                    />
                  </div>

                  <Button className="w-full   font-semibold py-3 text-lg">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="bg-white shadow-lg border  rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-charcoal-900 mb-8">
                  Contact Information
                </h2>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-500 text-white p-3 rounded-lg">
                      <Mail className="w-6 h-6 " />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900 mb-1">
                        Email Us
                      </h3>
                      <p className="text-charcoal-800/70">hello@photoframix.com</p>
                      <p className="text-charcoal-800/70">
                        support@photoframix.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-pink-500 text-white p-3 rounded-lg">
                      <Phone className="w-6 h-6 " />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900 mb-1">
                        Call Us
                      </h3>
                      <p className="text-charcoal-800/70">1-555-FRAME-IT</p>
                      <p className="text-charcoal-800/70">(1-555-372-6348)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-pink-500 text-white p-3 rounded-lg">
                      <MapPin className="w-6 h-6 " />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900 mb-1">
                        Visit Us
                      </h3>
                      <p className="text-charcoal-800/70">123 Frame Street</p>
                      <p className="text-charcoal-800/70">
                        Art District, NY 10001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-pink-500 text-white p-3 rounded-lg">
                      <Clock className="w-6 h-6 " />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900 mb-1">
                        Business Hours
                      </h3>
                      <p className="text-charcoal-800/70">
                        Mon - Fri: 9AM - 6PM
                      </p>
                      <p className="text-charcoal-800/70">
                        Sat - Sun: 10AM - 4PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                {/* <div className="mt-12 pt-8 border-t border-cream-300">
                  <h3 className="font-semibold text-charcoal-900 mb-4">
                    Quick Help
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="/faq"
                      className="block text-gold-600 hover:text-gold-700 transition-colors"
                    >
                      Frequently Asked Questions
                    </a>
                    <a
                      href="/shipping"
                      className="block text-gold-600 hover:text-gold-700 transition-colors"
                    >
                      Shipping Information
                    </a>
                    <a
                      href="/returns"
                      className="block text-gold-600 hover:text-gold-700 transition-colors"
                    >
                      Returns & Exchanges
                    </a>
                    <a
                      href="/frame-guide"
                      className="block text-gold-600 hover:text-gold-700 transition-colors"
                    >
                      Frame Selection Guide
                    </a>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className=" py-10 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-8">
              Common Questions
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl border p-6">
                <h3 className="font-semibold text-charcoal-900 mb-3">
                  How quickly do you respond?
                </h3>
                <p className="text-charcoal-800/70">
                  We typically respond to all inquiries within 2-4 hours during
                  business hours, and within 24 hours on weekends.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl border p-6">
                <h3 className="font-semibold text-charcoal-900 mb-3">
                  Can I track my order?
                </h3>
                <p className="text-charcoal-800/70">
                  Yes! Once your order ships, you&apos;ll receive a tracking number
                  via email to monitor your frame&apos;s journey to your door.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl border p-6">
                <h3 className="font-semibold text-charcoal-900 mb-3">
                  Do you offer custom sizes?
                </h3>
                <p className="text-charcoal-800/70">
                  Absolutely! We can create frames in virtually any size.
                  Contact us with your specific dimensions for a custom quote.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl border p-6">
                <h3 className="font-semibold text-charcoal-900 mb-3">
                  What if I need help choosing?
                </h3>
                <p className="text-charcoal-800/70">
                  Our frame experts are happy to help! Send us your photo and
                  room details, and we&apos;ll recommend the perfect frame style.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FrameItFooter />
    </>
  );
};
