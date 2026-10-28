import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';
import imageMeta from '../../data/imageMeta.json';

const BG = '/images/hero/hero-bg-1600.webp';

export default function CreativeHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center overflow-hidden selection:bg-slate-800 selection:text-white">
      {/* Background Image Layer */}
      <img
        src={BG}
        width={imageMeta[BG].w}
        height={imageMeta[BG].h}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-[center_25%] z-0 animate-slow-zoom"
      />

      {/* Cinematic Vignette & Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-black/50"></div>
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle,_transparent_30%,_rgba(0,0,0,0.85)_80%,_#0a0a0a_100%)] shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-gray-400 uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-4">
            Jeremiah Pantaras
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-6 leading-tight tracking-tighter">
            THE CREATIVE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">
              SIDE
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl font-light leading-relaxed border-l-2 border-gray-700 pl-6">
            A space where imagination meets visual storytelling. I specialize in crafting meaningful experiences through photography, cinematic films, visual design, and creative editing—capturing authentic moments and transforming ideas into compelling pieces of art. Every frame, composition, and detail is intentionally created to evoke emotion, tell stories, and bring visions to life in ways that are both memorable and impactful.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Explore Work
            </button>
            <a
              href={profile.creativeResumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-transparent border border-gray-700 text-white font-bold uppercase tracking-wider text-xs hover:bg-white hover:text-black transition-colors"
            >
              Creative Resume
            </a>
            <Link to="/" className="px-5 py-2.5 bg-transparent border border-gray-700 text-white font-bold uppercase tracking-wider text-xs hover:bg-gray-800 transition-colors flex items-center gap-2">
              Back to Developer
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
