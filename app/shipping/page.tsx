import FrameItFooter from "@/components/FrameItFooter";
import Link from "next/link";
import { ArrowLeft, Truck, Clock, Shield, MapPin } from "lucide-react";
import FrameItHeader from "@/components/FrameItHeader";

export const metadata = {
  title: "Shipping Information - FrameIt",
  description:
    "Learn about FrameIt shipping options, delivery times, and packaging to ensure your frames arrive safely.",
};

const ShippingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
   <FrameItHeader hideMenu />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal-900 mb-6">
              Shipping Information
            </h1>
            <p className="text-lg md:text-xl text-charcoal-800/80 max-w-2xl mx-auto">
              We ensure your beautiful frames arrive safely and on time with our
              premium packaging and reliable shipping partners.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
                Shipping Options
              </h2>
              <p className="text-lg text-charcoal-800/70">
                Choose the delivery option that works best for you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-cream-50 rounded-2xl p-8 text-center">
                <div className="bg-gold-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-charcoal-900 mb-4">
                  Standard Shipping
                </h3>
                <div className="text-3xl font-bold text-gold-600 mb-2">
                  FREE
                </div>
                <p className="text-charcoal-800/70 mb-4">7-10 business days</p>
                <ul className="text-sm text-charcoal-800/70 space-y-2">
                  <li>✓ Free on all orders</li>
                  <li>✓ Tracking included</li>
                  <li>✓ Signature required</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-gold-500 rounded-2xl p-8 text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gold-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
                <div className="bg-gold-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-charcoal-900 mb-4">
                  Express Shipping
                </h3>
                <div className="text-3xl font-bold text-gold-600 mb-2">$19</div>
                <p className="text-charcoal-800/70 mb-4">3-5 business days</p>
                <ul className="text-sm text-charcoal-800/70 space-y-2">
                  <li>✓ Faster delivery</li>
                  <li>✓ Priority handling</li>
                  <li>✓ Real-time tracking</li>
                </ul>
              </div>

              <div className="bg-cream-50 rounded-2xl p-8 text-center">
                <div className="bg-gold-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-charcoal-900 mb-4">
                  Rush Order
                </h3>
                <div className="text-3xl font-bold text-gold-600 mb-2">$39</div>
                <p className="text-charcoal-800/70 mb-4">1-2 business days</p>
                <ul className="text-sm text-charcoal-800/70 space-y-2">
                  <li>✓ Expedited production</li>
                  <li>✓ Priority shipping</li>
                  <li>✓ White glove service</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Process */}
      <section className="py-20 bg-cream-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
                Our Shipping Process
              </h2>
              <p className="text-lg text-charcoal-800/70">
                From order to doorstep, here&apos;s how we ensure your frames arrive
                perfectly.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-gold-500 text-white rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="font-bold text-charcoal-900 mb-2">
                  Order Processing
                </h3>
                <p className="text-sm text-charcoal-800/70">
                  Your order is reviewed and sent to production within 24 hours
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gold-500 text-white rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="font-bold text-charcoal-900 mb-2">
                  Frame Creation
                </h3>
                <p className="text-sm text-charcoal-800/70">
                  Our artisans carefully craft your frame using premium
                  materials
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gold-500 text-white rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="font-bold text-charcoal-900 mb-2">
                  Quality Check
                </h3>
                <p className="text-sm text-charcoal-800/70">
                  Each frame undergoes rigorous quality inspection before
                  packaging
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gold-500 text-white rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <h3 className="font-bold text-charcoal-900 mb-2">
                  Secure Shipping
                </h3>
                <p className="text-sm text-charcoal-800/70">
                  Carefully packaged and shipped with full tracking information
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packaging & Protection */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-6">
                  Premium Packaging
                </h2>
                <p className="text-lg text-charcoal-800/70 mb-8">
                  Your frames are precious cargo. We use custom-designed
                  packaging to ensure they arrive in perfect condition.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gold-500 p-2 rounded-lg flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal-900 mb-1">
                        Impact Protection
                      </h3>
                      <p className="text-sm text-charcoal-800/70">
                        Multi-layer foam padding absorbs shocks and impacts
                        during transit
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gold-500 p-2 rounded-lg flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal-900 mb-1">
                        Corner Guards
                      </h3>
                      <p className="text-sm text-charcoal-800/70">
                        Specialized corner protectors prevent frame damage at
                        vulnerable points
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gold-500 p-2 rounded-lg flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal-900 mb-1">
                        Moisture Protection
                      </h3>
                      <p className="text-sm text-charcoal-800/70">
                        Sealed protective wrapping keeps your frame safe from
                        humidity
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-cream-50 rounded-2xl p-8">
                <div className="aspect-square bg-gradient-to-br from-gold-100 to-wood-100 rounded-xl flex items-center justify-center">
                  <div className="text-center text-charcoal-800/60">
                    <div className="w-24 h-24 mx-auto mb-4 bg-charcoal-800/10 rounded-full flex items-center justify-center">
                      <Truck className="w-12 h-12" />
                    </div>
                    <p className="font-medium">Secure Packaging Illustration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Zones */}
      {/* <section className="py-20 bg-cream-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
                Shipping Zones
              </h2>
              <p className="text-lg text-charcoal-800/70">
                We deliver across the United States with consistent quality and
                care.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-gold-500" />
                  <h3 className="font-bold text-charcoal-900">
                    Continental US
                  </h3>
                </div>
                <p className="text-charcoal-800/70 mb-4">
                  Free standard shipping to all 48 contiguous states
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Standard:</span>
                    <span className="font-semibold">7-10 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express:</span>
                    <span className="font-semibold">3-5 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rush:</span>
                    <span className="font-semibold">1-2 business days</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-gold-500" />
                  <h3 className="font-bold text-charcoal-900">
                    Alaska & Hawaii
                  </h3>
                </div>
                <p className="text-charcoal-800/70 mb-4">
                  Extended delivery times due to distance and logistics
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Standard:</span>
                    <span className="font-semibold">10-14 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express:</span>
                    <span className="font-semibold">5-7 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Fee:</span>
                    <span className="font-semibold">$25</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gold-50 border border-gold-200 rounded-xl p-6">
              <h3 className="font-bold text-charcoal-900 mb-3">
                📦 Track Your Order
              </h3>
              <p className="text-charcoal-800/70 mb-4">
                Once your frame ships, you'll receive a tracking number via
                email. Track your package in real-time and get delivery updates.
              </p>
              <Link
                href="/contact"
                className="text-gold-600 hover:text-gold-700 font-semibold"
              >
                Need help with tracking? Contact us →
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      <FrameItFooter />
    </div>
  );
};

export default ShippingPage;
