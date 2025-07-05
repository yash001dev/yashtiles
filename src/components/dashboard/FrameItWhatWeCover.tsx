import {
  Users,
  Camera,
  Heart,
  Crown,
  Instagram,
  Palette,
  Sparkles,
} from "lucide-react";

const coverItems = [
  {
    icon: Users,
    title: "Family Portraits",
    description: "Cherish your family moments",
  },
  {
    icon: Camera,
    title: "Travel Photos",
    description: "Remember your adventures",
  },
  {
    icon: Heart,
    title: "Pet Photos",
    description: "Celebrate your furry friends",
  },
  {
    icon: Crown,
    title: "Wedding Pictures",
    description: "Preserve your special day",
  },
  {
    icon: Instagram,
    title: "Instagram Posts",
    description: "Turn digital into physical",
  },
  {
    icon: Palette,
    title: "Art Prints",
    description: "Display your creativity",
  },
  {
    icon: Sparkles,
    title: "Digital Illustrations",
    description: "Bring digital art to life",
  },
];

const FrameItWhatWeCover = () => {
  return (
    <section className="py-20 bg-white text-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold  mb-4">
              What Can You Frame?
            </h2>
            <p className="text-lg  max-w-2xl mx-auto">
              From precious family moments to artistic creations, we frame it
              all with the same care and attention to detail.
            </p>
          </div>

          {/* Grid of items */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {coverItems.map((item, index) => (
              <div
                key={index}
                className="group bg-white shadow-lg rounded-xl p-6 text-center hover:bg-gold-50 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-cream-300/50"
              >
                <div className="inline-flex items-center text-white justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-green-600  rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-charcoal-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-charcoal-800/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Special note */}
          <div className="bg-gradient-to-bl from-green-500 to-green-500/40 rounded-2xl p-8 text-center border border-gold-500/20">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold  mb-4">
                Don&apos;t See Your Type? We&apos;ve Got You Covered!
              </h3>
              <p className="/70 mb-6">
                Whether it&apos;s vintage photographs, children&apos;s artwork, or that
                perfect sunset shot, our expert team can frame virtually any
                image you treasure. Just upload and let us work our magic.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-charcoal-800 shadow-sm">
                  ✓ Any size, any format
                </span>
                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-charcoal-800 shadow-sm">
                  ✓ Digital or physical photos
                </span>
                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-charcoal-800 shadow-sm">
                  ✓ Custom sizing available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameItWhatWeCover;
