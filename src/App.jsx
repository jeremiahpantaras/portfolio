import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import SiteLayout from './components/layout/SiteLayout';
import ScrollToTop from './components/layout/ScrollToTop';
import Preloader from './components/layout/Preloader';
import Home from './pages/Home';
import { routeLoaders, notFoundLoader } from './routes';

// Every route except the home page is code-split (loaders live in routes.js so they can also be prefetched).
const TechStacks = lazy(routeLoaders['/tech-stacks']);
const Projects = lazy(routeLoaders['/projects']);
const Certifications = lazy(routeLoaders['/certifications']);
const Experience = lazy(routeLoaders['/experience']);
const Workshop = lazy(routeLoaders['/workshops']);
const NotFound = lazy(notFoundLoader);
const CreativeHome = lazy(routeLoaders['/creative']);
const CreativeGalleryPage = lazy(routeLoaders['/creative/gallery']);

// The site is dark-only (see index.html and src/index.css); there is no theme state to manage here.
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Preloader />
      <Suspense fallback={<div className="min-h-[100svh]" aria-busy="true" />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/tech-stacks" element={<TechStacks />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/workshops" element={<Workshop />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/creative" element={<CreativeHome />} />
          <Route path="/creative/gallery" element={<CreativeGalleryPage />} />
        </Routes>
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </Router>
  );
}

export default App;
