import { Facebook, Github, Globe, Instagram, Linkedin } from 'lucide-react';

const icons = { github: Github, linkedin: Linkedin, facebook: Facebook, instagram: Instagram, website: Globe };

// Icon-only social link with an accessible name. Hit area is 44×44.
export default function SocialIcon({ social, size = 20, className = '' }) {
  const Icon = icons[social.id] ?? Globe;
  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      className={`inline-flex h-9 w-9 pointer-coarse:h-11 pointer-coarse:w-11 items-center justify-center text-fg-subtle transition-colors duration-200 hover:text-fg focus-visible:text-fg ${className}`}
    >
      <Icon size={size} aria-hidden="true" />
    </a>
  );
}
