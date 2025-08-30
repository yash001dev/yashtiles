"use client";

import Image from "next/image";

type Media = {
  url?: string;
  alt?: string;
  sizes?: {
    thumbnail?: { url: string };
    card?: { url: string };
    tablet?: { url: string };
  };
} | string | null;

type FeatureItem = {
  id: string;
  image: Media;
  title: string;
  description: string;
};

export default function FeatureBlockPayload({ items }: { items: FeatureItem[] }) {
  return (
    <section className="grid gap-8 md:grid-cols-3 max-w-[1200px] mx-auto my-12 px-4">
      {items.map((item) => {
        let imgUrl: string | undefined;
        let alt: string = item.title;

        if (item.image && typeof item.image === "object") {
          // Prefer smaller optimized size if available
          imgUrl =
            item.image.sizes?.card?.url ||
            item.image.sizes?.thumbnail?.url ||
            item.image.url;
          alt = item.image.alt || item.title;
        }

        return (
          <article
            key={item.id}
            className="flex flex-col rounded-2xl overflow-hidden shadow bg-white"
          >
            <div className="relative w-full aspect-[4/3]">
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
