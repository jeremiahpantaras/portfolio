import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Search, X } from 'lucide-react';
import Container from '../ui/Container';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import { useSiteUi } from './siteUi';
import { profile } from '../../data/profile';
import { navLinks } from '../../data/nav';
import { prefetchProps } from '../../routes';

// Home sections observed for the active-section marker (ids come from the sections in pages/Home).
const sectionIds = ['top', 'work', 'stack', 'experience', 'contact'];

// Which nav item a sub-route belongs to.
const routeGroup = {
  '/projects': 'work',
  '/experience': 'experience',
  '/certifications': 'experience',
  '/workshops': 'experience',
};

export default function SiteNav() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // the search row under the bar, on small screens
  const { openChat, prefetchChat } = useSiteUi();
  const [homeActive, setHomeActive] = useState(null);
  const active = pathname === '/' ? homeActive : (routeGroup[pathname] ?? null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active-section tracking on the home page: the section crossing the middle of the viewport wins.
  useEffect(() => {
    if (pathname !== '/') return undefined;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setHomeActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  const goHome = (e) => {
    if (pathname === '/' && !window.location.hash) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`site-nav fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled ? 'border-line bg-ink-900/90' : 'border-transparent'
        }`}
      >
        <Container className="flex h-14 items-center justify-between">
          <Link to="/" onClick={goHome} className="eyebrow inline-flex min-h-9 pointer-coarse:min-h-11 items-center text-fg" aria-label={`${profile.name}, home`}>
            {profile.name}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            <SearchBar className="w-40 transition-[width] duration-300 focus-within:w-60 lg:w-48 lg:focus-within:w-72" />
            {navLinks.map((l) => {
              const on = active === l.id;
              return (
                <Link
                  key={l.id}
                  to={`/#${l.id}`}
                  aria-current={on ? 'location' : undefined}
                  className={`eyebrow link-u inline-flex min-h-9 pointer-coarse:min-h-11 items-center gap-2 transition-colors duration-200 hover:text-fg ${
                    on ? 'text-fg' : 'text-fg-muted'
                  }`}
                >
                  <span aria-hidden="true" className={`h-1 w-1 bg-ember transition-opacity duration-200 ${on ? 'opacity-100' : 'opacity-0'}`} />
                  {l.label}
                </Link>
              );
            })}
            <Link to="/creative" {...prefetchProps('/creative')} className="eyebrow link-u inline-flex min-h-9 pointer-coarse:min-h-11 items-center text-fg-muted transition-colors duration-200 hover:text-fg">
              Creative ↗
            </Link>
            <button
              type="button"
              onClick={openChat}
              onPointerEnter={prefetchChat}
              onFocus={prefetchChat}
              className="eyebrow link-u inline-flex cursor-pointer min-h-9 pointer-coarse:min-h-11 items-center gap-2 text-fg transition-colors duration-200"
            >
              <MessageSquare size={14} aria-hidden="true" />
              Ask AI Me
            </button>
          </nav>

          <div className="-mr-3 flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen((o) => !o)}
              aria-label={searchOpen ? 'Close search' : 'Search the site'}
              aria-expanded={searchOpen}
              className="inline-flex min-h-9 min-w-9 pointer-coarse:min-h-11 pointer-coarse:min-w-11 items-center justify-center text-fg"
            >
              {searchOpen ? <X size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={openChat}
              aria-label="Ask AI Me"
              className="inline-flex min-h-9 min-w-9 pointer-coarse:min-h-11 pointer-coarse:min-w-11 items-center justify-center text-fg"
            >
              <MessageSquare size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="eyebrow inline-flex min-h-9 pointer-coarse:min-h-11 items-center px-3 text-fg"
            >
              Menu
            </button>
          </div>

        </Container>
        {searchOpen && (
          <Container className="pb-3 md:hidden">
            <SearchBar autoFocus className="w-full" onDone={() => setSearchOpen(false)} />
          </Container>
        )}
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={navLinks} />
    </>
  );
}
