import SocialIcon from '../../components/ui/SocialIcon';
import { profile } from '../../data/profile';
import { socials } from '../../data/socials';

export default function CreativeContact() {
  return (
    <section id="creative-contact" className="py-14 scroll-mt-16 px-4 sm:px-6 lg:px-8 bg-[#050505] text-white border-t border-gray-900">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 font-semibold">
          Get in Touch
        </h2>
        <h3 className="text-2xl md:text-3xl font-black mb-8 leading-tight">
          LET'S CREATE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
            TOGETHER
          </span>
        </h3>
        <p className="text-gray-400 mb-8 text-base font-light max-w-2xl">
          Looking to collaborate on a visual project, short film, or photography session? I'm always open to new creative opportunities.
        </p>
        
        <a 
          href={`mailto:${profile.email}`} 
          className="inline-block px-6 py-3 bg-transparent border border-gray-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors mb-8"
        >
          Contact Me
        </a>

        <div className="flex gap-2 justify-center items-center mt-4">
          {socials.map((social) => (
            <SocialIcon
              key={social.id}
              social={social}
              className="border border-gray-800 bg-gray-900 hover:bg-gray-800 shadow-lg"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
