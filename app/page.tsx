import dynamic from "next/dynamic";
import { Suspense } from "react";
import FrameItHeader from "@/components/dashboard/FrameItHeader";
import FrameItHero from "@/components/dashboard/FrameItHero";
import FrameItHowItWorks from "@/components/dashboard/FrameItHowItWorks";

// Lazy load non-critical components
const FrameItPhotoGallery = dynamic(
  () => import("@/components/dashboard/FrameItPhotoGallery"),
  {
    loading: () => (
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    ),
    ssr: true,
  }
);

const FrameItTestimonialsSlider = dynamic(
  () => import("@/components/dashboard/FrameItTestimonialsSlider"),
  {
    loading: () => (
      <div className="py-20 bg-dark-green">
        <div className="container mx-auto px-4">
          <div className="animate-pulse h-96 bg-green-800 rounded-lg"></div>
        </div>
      </div>
    ),
    ssr: true,
  }
);

const FrameItFeatures = dynamic(
  () => import("@/components/dashboard/FrameItFeatures"),
  {
    loading: () => (
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    ),
    ssr: true,
  }
);

const FrameItShowcase = dynamic(
  () => import("@/components/dashboard/FrameItShowcase"),
  {
    loading: () => (
      <div className="py-20 bg-cream-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    ),
    ssr: true,
  }
);

const FrameItWhatWeCover = dynamic(
  () => import("@/components/dashboard/FrameItWhatWeCover"),
  {
    loading: () => (
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    ),
    ssr: true,
  }
);

const FrameItFAQ = dynamic(() => import("@/components/dashboard/FrameItFAQ"), {
  loading: () => (
    <div className="py-20 bg-cream-50">
      <div className="container mx-auto px-4">
        <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  ),
  ssr: true,
});

const FrameItFooter = dynamic(
  () => import("@/components/dashboard/FrameItFooter"),
  {
    loading: () => (
      <div className="py-20 bg-charcoal-900">
        <div className="container mx-auto px-4">
          <div className="animate-pulse h-96 bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    ),
    ssr: true,
  }
);
export const metadata = {
  title: "PhotoFramix – Custom Photo Framing Online",
  description:
    "Transform your memories into stunning wall art with PhotoFramix. Premium frames, fast shipping, and a 7-day satisfaction guarantee.",
  openGraph: {
    title: "PhotoFramix – Custom Photo Framing Online",
    description:
      "Transform your memories into stunning wall art with PhotoFramix. Premium frames, fast shipping, and a 7-day satisfaction guarantee.",
    url: "https://photoframix.com/",
    siteName: "PhotoFramix",
    images: [
      {
        url: "/favicon.svg",
        width: 1200,
        height: 630,
        alt: "PhotoFramix - Custom Photo Framing",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <FrameItHeader />
      <FrameItHero />
   

      <Suspense
        fallback={
          <div className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        }
      >
        <FrameItPhotoGallery />
      </Suspense>

   <FrameItHowItWorks />
      <Suspense
        fallback={
          <div className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        }
      >
        <FrameItFeatures />
      </Suspense>

      <Suspense
        fallback={
          <div className="py-20 bg-cream-50">
            <div className="container mx-auto px-4">
              <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        }
      >
        <FrameItShowcase />
      </Suspense>

      <Suspense
        fallback={
          <div className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        }
      >
        <FrameItWhatWeCover />
      </Suspense>
      <Suspense
        fallback={
          <div className="py-20 bg-dark-green">
            <div className="container mx-auto px-4">
              <div className="animate-pulse h-96 bg-green-800 rounded-lg"></div>
            </div>
          </div>
        }
      >
        <FrameItTestimonialsSlider />
      </Suspense>

      <Suspense
        fallback={
          <div className="py-20 bg-cream-50">
            <div className="container mx-auto px-4">
              <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        }
      >
        <FrameItFAQ />
      </Suspense>

      <Suspense
        fallback={
          <div className="py-20 bg-charcoal-900">
            <div className="container mx-auto px-4">
              <div className="animate-pulse h-96 bg-gray-800 rounded-lg"></div>
            </div>
          </div>
        }
      >
        <FrameItFooter />
      </Suspense>
    </div>
  );
}
