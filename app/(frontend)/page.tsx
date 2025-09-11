import FrameItHeader from "@/components/dashboard/FrameItHeader";
import FrameItHero from "@/components/dashboard/FrameItHero";
import FrameItHowItWorks from "@/components/dashboard/FrameItHowItWorks";
import FrameItPhotoGallery from "@/components/dashboard/FrameItPhotoGallery";
import FrameItTestimonialsSlider from "@/components/dashboard/FrameItTestimonialsSlider";
import FrameItFeatures from "@/components/dashboard/FrameItFeatures";
import FrameItShowcase from "@/components/dashboard/FrameItShowcase";
import FrameItWhatWeCover from "@/components/dashboard/FrameItWhatWeCover";
import FrameItFAQ from "@/components/dashboard/FrameItFAQ";
import FrameItFooter from "@/components/dashboard/FrameItFooter";

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
      <FrameItPhotoGallery />
      <FrameItHowItWorks />
      <FrameItFeatures />
      <FrameItShowcase />
      <FrameItWhatWeCover />
      <FrameItTestimonialsSlider />
      <FrameItFAQ />
      <FrameItFooter />
    </div>
  );
}
