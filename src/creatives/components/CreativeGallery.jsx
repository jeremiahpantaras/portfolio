import { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageModal from '../../components/ImageModal';
import { creativeGalleryImages } from '../data/creativeGallery';

// Balanced bento layout for the first 6 images.
const bentoClasses = [
  'md:col-span-2 md:row-span-2 sm:col-span-2', // Large hero square
  'md:col-span-1 md:row-span-1 sm:col-span-1', // Small square
  'md:col-span-1 md:row-span-2 sm:col-span-1', // Tall rectangle
  'md:col-span-1 md:row-span-1 sm:col-span-1', // Small square
  'md:col-span-2 md:row-span-1 sm:col-span-2', // Wide rectangle
  'md:col-span-2 md:row-span-1 sm:col-span-2', // Wide rectangle
];

export default function CreativeGallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="gallery" className="py-14 px-4 sm:px-6 lg:px-8 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 font-semibold">
            Portfolio
          </h2>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-6 leading-tight">
            SELECTED{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600">
              WORKS
            </span>
          </h3>
          <p className="text-gray-400 max-w-2xl text-base font-light">
            A curated selection of my visual projects, spanning photography,
            cinematography, and creative editing.
          </p>
        </div>

        {/* Gallery Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-4">
          {creativeGalleryImages.slice(0, 6).map((image, index) => (
            <button
              type="button"
              key={image.id}
              aria-haspopup="dialog"
              className={`relative group overflow-hidden bg-gray-900 cursor-zoom-in border border-gray-800 ${bentoClasses[index]}`}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.thumb}
                width={image.w}
                height={image.h}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              {/* Hover Overlay */}
              <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-xs font-semibold tracking-widest uppercase border border-white/30 px-6 py-2">
                  View
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/creative/gallery"
            className="px-5 py-2.5 bg-transparent border border-gray-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors"
          >
            View All Works
          </Link>
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        image={selectedImage?.full}
        alt={selectedImage?.alt}
        downloadSrc={selectedImage?.original}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
}
