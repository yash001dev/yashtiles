"use client";

import { CheckCircle, Clock, Shield, Wrench } from "lucide-react";
import Image from "next/image";

const installationSteps = [
  {
    step: "01",
    title: "Planning it out",
    description:
      "Plan your frame arrangement by spacing out your frames on the floor, preferably leave an inch space between each frame",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
    icon: Wrench,
    tip: "Use painter's tape to mark positions on the wall before hanging",
  },
  {
    step: "02",
    title: "Clean and Prep",
    description:
      "Wipe the installation area with a dry cloth and make sure it is free of dust or dirt which might affect the adhesive strip",
    image:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
    icon: Shield,
    tip: "Allow the wall to completely dry before applying adhesive strips",
  },
  {
    step: "03",
    title: "Just Peel",
    description:
      "Slowly peel off the backing from the adhesive pad on the back of the frame",
    image:
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop",
    icon: Clock,
    tip: "Remove backing paper gradually to avoid air bubbles",
  },
  {
    step: "04",
    title: "And Stick!",
    description:
      "Press the top of the frame and firmly apply firm pressure to make sure the whole adhesive strip and the wall are evenly in contact",
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop",
    icon: CheckCircle,
    tip: "Hold for 30 seconds to ensure strong adhesion",
  },
];

const careInstructions = [
  {
    title: "Daily Care",
    description: "Dust gently with a soft, dry microfiber cloth",
    icon: "🧹",
  },
  {
    title: "Deep Cleaning",
    description:
      "Use a slightly damp cloth for stubborn spots, then dry immediately",
    icon: "💧",
  },
  {
    title: "Avoid Direct Sunlight",
    description:
      "Prevent fading by avoiding prolonged direct sunlight exposure",
    icon: "☀️",
  },
  {
    title: "Humidity Control",
    description: "Maintain stable humidity levels to prevent warping",
    icon: "🌡️",
  },
];

const FrameItInstallation = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal-900 mb-4">
              Installation & Care Guide
            </h2> */}
            <p className="text-lg text-charcoal-800/70 max-w-2xl mx-auto">
              Follow these simple steps to perfectly install your FrameIt frames
              and keep them looking beautiful for years to come.
            </p>
          </div>

          {/* Installation Steps */}
          <div id="installation" className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-charcoal-900 mb-4">
                Easy Installation in 4 Steps
              </h3>
              <p className="text-charcoal-800/70">
                No tools required! Our adhesive mounting system makes hanging
                your frames simple and damage-free.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {installationSteps.map((step, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 hover:bg-white/50 shadow-2xl transition-all duration-300 hover:shadow-xl"
                >
                  {/* Step Image */}
                  <div className="relative mb-6 overflow-hidden rounded-xl">
                    <div className="aspect-[16/10] relative">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />

                      {/* Step Number Overlay */}
                      <div className="absolute top-4 left-4 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                        {step.step}
                      </div>

                      {/* Icon Overlay */}
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div>
                    <h4 className="text-xl font-bold text-charcoal-900 mb-3">
                      Step {step.step}: {step.title}
                    </h4>
                    <p className="text-charcoal-800/80 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Pro Tip */}
                    <div className="bg-gold-50 border border-gold-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-semibold text-sm">
                          💡 Pro Tip:
                        </span>
                        <span className="text-gold-800 text-sm">
                          {step.tip}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Installation Video CTA */}
            <div className="text-center mt-12 bg-dark-green text-white rounded-2xl p-8 border border-gold-500/20">
              <h3 className="text-xl font-bold  mb-4">
                Need Visual Guidance?
              </h3>
              <p className="text-white/70 mb-6">
                Watch our step-by-step installation video for a complete
                walkthrough of the process.
              </p>
              <button className=" text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-300 inline-flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Watch Installation Video
              </button>
            </div>
          </div>

          {/* Care Instructions */}
          <div id="care">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-charcoal-900 mb-4">
                Care & Maintenance
              </h3>
              <p className="text-charcoal-800/70">
                Keep your frames looking pristine with these simple care tips.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {careInstructions.map((instruction, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-xl p-6 text-center hover:bg-white/60 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {instruction.icon}
                  </div>
                  <h4 className="font-bold text-charcoal-900 mb-3">
                    {instruction.title}
                  </h4>
                  <p className="text-sm text-charcoal-800/70 leading-relaxed">
                    {instruction.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Warranty Info */}
            <div className="mt-12 bg-charcoal-900 text-cream-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center md:text-left">
                  <h4 className="font-bold text-xl mb-2">Quality Guarantee</h4>
                  <p className="text-cream-50/80">
                    All FrameIt frames come with a 2-year quality warranty
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Premium Materials
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-cream-50/80 text-sm">
                    Questions about care? Contact our support team
                  </p>
                  <a
                    href="/contact"
                    className="text-primary transition-colors duration-300 font-semibold"
                  >
                    Get Help →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameItInstallation;
