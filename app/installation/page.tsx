import FrameItInstallation from "@/components/FrameItInstallation";
import FrameItFooter from "@/components/FrameItFooter";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Installation & Care Guide - FrameIt",
  description:
    "Learn how to easily install and care for your FrameIt frames with our step-by-step guide.",
};

const InstallationPage = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="bg-white border-b border-cream-300 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-charcoal-800 hover:text-gold-600 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>

            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-primary">
                FrameIt
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/contact"
                  className="text-charcoal-800 hover:text-gold-600 transition-colors duration-300"
                >
                  Contact
                </Link>
                <Link
                  href="/installation"
                  className="text-dark-green font-semibold"
                >
                  Installation Guide
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-dark-green text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold  mb-6">
              Installation & Care Guide
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Everything you need to know to perfectly install your FrameIt
              frames and keep them looking beautiful for years to come.
            </p>

            {/* Quick Nav */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#installation"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary  font-semibold rounded-xl text-white transition-colors duration-300"
              >
                Installation Steps
              </a>
              <a
                href="#care"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-charcoal-800 hover:bg-green-800 hover:text-cream-50  font-semibold rounded-xl border border-charcoal-800/20  transition-colors duration-300"
              >
                Care Instructions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <FrameItInstallation />

      {/* Additional Resources */}
      <section className="py-20 bg-white text-dark-green">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold  mb-4">
                Need More Help?
              </h2>
              <p className="text-lg ">
                We&apos;re here to support you every step of the way.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white shadow-xl hover:shadow-2xl rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-dark-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold  mb-3">
                  Live Chat Support
                </h3>
                <p className="text-charcoal-800/70 mb-4">
                  Get instant help from our installation experts
                </p>
                <a
                  href="/contact"
                  className="text-primary font-semibold"
                >
                  Start Chat →
                </a>
              </div>

              <div className="bg-white shadow-xl hover:shadow-2xl rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-dark-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold  mb-3">
                  Video Tutorials
                </h3>
                <p className="text-charcoal-800/70 mb-4">
                  Watch step-by-step installation videos
                </p>
                <a
                  href="#"
                  className="text-primary font-semibold"
                >
                  Watch Now →
                </a>
              </div>

              <div className="bg-white shadow-xl hover:shadow-2xl rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-dark-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold  mb-3">PDF Guide</h3>
                <p className="text-charcoal-800/70 mb-4">
                  Download our complete installation manual
                </p>
                <a
                  href="#"
                  className="text-primary font-semibold"
                >
                  Download →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FrameItFooter />
    </div>
  );
};

export default InstallationPage;
