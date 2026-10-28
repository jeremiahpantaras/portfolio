import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ImageModal from '../../components/ImageModal';
import SiteNav from '../../components/layout/SiteNav';
import SkipLink from '../../components/layout/SkipLink';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import { creativeGalleryImages } from '../data/creativeGallery';

export default function CreativeGalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  useDocumentMeta({
    title: 'Creative Gallery | Jeremiah Pantaras',
    description: 'All creative works by Jeremiah Pantaras: photography, cinematography and creative editing.',
    path: '/creative/gallery',
  });

  return (
    <>
      <SkipLink />
      <SiteNav />
      <main id="content" tabIndex={-1} className="min-h-screen bg-[#050505] text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8 selection:bg-slate-800 selection:text-white outline-none">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/creative"
            className="mb-8 inline-flex min-h-11 items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} aria-hidden="true" />
            Back to Creative Home
          </Link>

          <div className="flex flex-col mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2 font-semibold">
              Complete Portfolio
            </p>
            <h1 className="text-2xl md:text-3xl font-black">
              ALL WORKS
            </h1>
          </div>

          {/* Gallery Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {creativeGalleryImages.map((image) => (
              <button
                type="button"
                key={image.id}
                aria-haspopup="dialog"
                className="relative group overflow-hidden bg-gray-900 cursor-zoom-in break-inside-avoid border border-gray-800 mb-6 block w-full"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.thumb}
                  width={image.w}
                  height={image.h}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold tracking-widest uppercase border border-white/30 px-6 py-2">
                    View
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <ImageModal
          isOpen={!!selectedImage}
          image={selectedImage?.full}
          alt={selectedImage?.alt}
          downloadSrc={selectedImage?.original}
          onClose={() => setSelectedImage(null)}
        />
      </main>
    </>
  );
}
