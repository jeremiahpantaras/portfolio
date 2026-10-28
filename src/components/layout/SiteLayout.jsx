import { Suspense, lazy, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SkipLink from './SkipLink';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import OpenCv from '../OpenCv';
import { SiteUiContext } from './siteUi';

// The chat (and its Gemini / markdown dependencies) is only downloaded when it's first needed.
const loadChat = () => import('../chat');
const Chat = lazy(loadChat);

export default function SiteLayout() {
  const [cvOpen, setCvOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const ui = useMemo(() => ({ openCv: () => setCvOpen(true), openChat: () => setChatOpen(true), prefetchChat: loadChat }), []);

  return (
    <SiteUiContext.Provider value={ui}>
      <SkipLink />
      <SiteNav />
      <main id="content" tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-[100svh]" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />

      {chatOpen && (
        <Suspense fallback={null}>
          <Chat onClose={() => setChatOpen(false)} />
        </Suspense>
      )}
      <OpenCv isOpen={cvOpen} onClose={() => setCvOpen(false)} />
      {/* After everything else, so it paints over the sky (also z-index -10). */}
      <div aria-hidden="true" className="film-grain" />
    </SiteUiContext.Provider>
  );
}
