import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';

export default function CreativeAbout() {
  return (
    <section className="bg-black text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Column - Photo */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-700 to-gray-900 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700"></div>
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto md:mx-0 overflow-hidden shadow-2xl border border-gray-800">
            <img 
              src={profile.portrait.src}
              srcSet={profile.portrait.srcSet}
              sizes="(min-width: 768px) 28rem, 90vw"
              width={profile.portrait.w}
              height={profile.portrait.h}
              loading="lazy"
              alt={profile.portrait.alt} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col justify-center">
          <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 font-semibold">
            About Me
          </h2>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-8 leading-tight">
            BEHIND THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
              LENS
            </span>
          </h3>
          <div className="space-y-6 text-gray-400 text-base font-light leading-relaxed">
            <p>
              I am a multimedia creator passionate about visual storytelling. Beyond building systems through code, I capture the world through a cinematic lens, focusing on emotion, lighting, and composition.
            </p>
            <p>
              From striking portraits and sweeping landscapes to dynamic video sequences, my goal is to craft visuals that resonate and leave a lasting impression.
            </p>
          </div>
          
          <div className="mt-10">
            <Link
              to="#creative-contact"
              className="inline-block px-5 py-2.5 bg-transparent border border-gray-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
