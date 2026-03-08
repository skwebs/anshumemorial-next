// app/gallery/page.tsx
import { prisma } from "@/lib/prisma";
import { Image as ImageIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Gallery" };
export const revalidate = 3600;

export default async function GalleryPage() {
  const images = await prisma.gallery.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const categories = [...new Set(images.map((i) => i.category))];

  return (
    <>
      <section className="bg-gradient-to-br from-navy-900 to-navy-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle text-saffron-400 mb-2">Memories</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">School Gallery</h1>
          <p className="text-slate-300">A glimpse into life at Anshu Memorial Academy.</p>
        </div>
      </section>

      <section className="py-12 px-4 bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          {images.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium">Gallery coming soon.</p>
              <p className="text-sm mt-1">Check back for photos of our events and activities.</p>
            </div>
          ) : (
            <>
              {/* Category filter tabs */}
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                  <span className="badge bg-navy-900 text-white px-4 py-1.5 text-sm">All</span>
                  {categories.map((c) => (
                    <span key={c} className="badge bg-navy-100 text-navy-800 px-4 py-1.5 text-sm cursor-pointer hover:bg-navy-200 transition-colors">
                      {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Masonry-style grid */}
              <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
                {images.map((img, i) => (
                  <div key={img.id} className="break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative bg-slate-100">
                    <div className="relative aspect-square">
                      <Image
                        src={img.imageUrl}
                        alt={img.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-navy-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-3">
                        <p className="text-white font-semibold text-sm">{img.title}</p>
                        {img.description && (
                          <p className="text-slate-300 text-xs mt-0.5 line-clamp-1">{img.description}</p>
                        )}
                        <span className="badge bg-saffron-500/80 text-navy-900 text-xs mt-1">{img.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
