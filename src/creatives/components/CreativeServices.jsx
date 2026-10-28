import React from 'react';
import ChromaGrid from './ui/ChromaGrid';
import { creativeServices } from '../data/creativeServices';

export default function CreativeServices() {
  return (
    <section className="relative min-h-screen py-14 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] text-white flex flex-col justify-center items-center overflow-hidden border-t border-gray-900">
      {/* Subtle ambient lighting backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center mb-10">
        <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 font-semibold">
          Services
        </h2>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-6 leading-tight">
          CREATIVE{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600">
            DISCIPLINES
          </span>
        </h3>
        <p className="text-gray-400 max-w-2xl text-base font-light">
          I transform ideas into visual experiences through photography, filmmaking, editing, and design.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto pb-12">
        {/* ChromaGrid adapts height based on its flex children. It wraps naturally. */}
        <ChromaGrid 
          items={creativeServices}
          radius={320}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </div>
    </section>
  );
}
