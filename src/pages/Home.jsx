import { useRef } from 'react';
import Hero from '../components/hero/Hero';
import AuroraScene from '../components/motion/AuroraScene';
import DepthBackdrop from '../components/motion/DepthBackdrop';
import NightSky from '../components/motion/NightSky';
import Work from '../sections/home/Work';
import Capabilities from '../sections/home/Capabilities';
import Experience from '../sections/home/Experience';
import Contact from '../sections/home/Contact';
import useDocumentMeta from '../hooks/useDocumentMeta';
import usePageReveal from '../hooks/usePageReveal';

// The home page is one long "descent" (the fixed AuroraScene flows as you scroll): hero → sections, in the order listed in doc 01 §6.
export default function Home() {
  const root = useRef(null);
  useDocumentMeta({
    title: 'Jeremiah Pantaras | Software Engineer & Full-Stack Developer',
    description:
      'Experienced Software Engineer specializing in Python Django, React, and modern web development. Founder & CEO of Elpisoft, building innovative solutions for startups and MSMEs in the Philippines.',
    path: '/',
  });
  usePageReveal(root);

  return (
    <div ref={root} className="relative">
      <AuroraScene />
      <NightSky />
      <DepthBackdrop />
      <Hero />
      <Work />
      <Capabilities />
      <Experience />
      <Contact />
    </div>
  );
}
