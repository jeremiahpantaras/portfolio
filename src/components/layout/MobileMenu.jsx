import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import useFocusTrap from '../../hooks/useFocusTrap';
import useScrollLock from '../../hooks/useScrollLock';
import { profile } from '../../data/profile';

const more = [
  ['Projects', '/projects'],
  ['Tech Stack', '/tech-stacks'],
  ['Certifications', '/certifications'],
  ['Workshops', '/workshops'],
];

// Full-screen menu for < md. A dialog: traps focus, closes on Esc / link click, returns focus to "Menu".
export default function MobileMenu({ open, onClose, links }) {
  const ref = useRef(null);
  useScrollLock(open);
  useFocusTrap(ref, open, onClose);
  if (!open) return null;

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      tabIndex={-1}
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink-850 px-[clamp(1.25rem,4vw,3rem)] outline-none md:hidden"
    >
      <div className="flex h-14 shrink-0 items-center justify-between">
        <span className="eyebrow text-fg">{profile.name}</span>
        <button type="button" onClick={onClose} className="eyebrow -mr-3 inline-flex min-h-9 pointer-coarse:min-h-11 items-center gap-2 px-3 text-fg">
          Close
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-10 pb-10">
        <ul className="flex flex-col gap-3">
          {links.map((l) => (
            <li key={l.id}>
              <Link to={`/#${l.id}`} onClick={onClose} className="text-title text-fg">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/creative" onClick={onClose} className="text-title text-fg">
              Creative
            </Link>
          </li>
        </ul>
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          {more.map(([label, to]) => (
            <li key={to}>
              <Link to={to} onClick={onClose} className="inline-flex min-h-9 pointer-coarse:min-h-11 items-center text-fg-muted">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <a href={`mailto:${profile.email}`} className="eyebrow text-fg-subtle">
          {profile.email}
        </a>
      </nav>
    </div>
  );
}
