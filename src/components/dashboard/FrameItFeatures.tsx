import { Hammer, Upload, Truck, Heart } from "lucide-react";

const features = [
  {
    icon: Hammer,
    title: "Premium Handmade Frames",
    description:
      "Crafted with the highest quality wood and finishes by skilled artisans who care about every detail.",
  },
  {
    icon: Upload,
    title: "Easy Upload & Customization",
    description:
      "Just upload your photo and choose your frame. Our intuitive interface makes it simple and fun.",
  },
  {
    icon: Truck,
    title: "Fast & Secure Delivery",
    description:
      "Delivered to your door, damage-free with our premium packaging and trusted shipping partners.",
  },
  {
    icon: Heart,
    title: "Happiness Guaranteed",
    description:
      "Easy replacements if you're not satisfied. Your happiness is our top priority, always.",
  },
];

const FrameItFeatures = () => {
  return (
    <section className="py-20  text-black" id="features">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold  mb-4">
              Why Choose FrameIt?
            </h2>
            <p className="text-lg  max-w-2xl mx-auto">
              We&apos;re passionate about transforming your precious memories into
              beautiful wall art that you&apos;ll treasure forever.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group shadow-lg rounded-2xl p-8 text-center hover:bg-white transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold text-dark-green imary mb-4">
                  {feature.title}
                </h3>

                <p className="text-charcoal-800/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 shadow-xl px-6 py-3 rounded-full">
              <span className="text-dark-green font-semibold">
                ✨ Join thousands of happy customers
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameItFeatures;
