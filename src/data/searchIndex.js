import { projects } from './projects';
import { techStack } from './techStack';
import { experience } from './experience';
import { certifications, workshops } from './recognition';

// Everything the top-bar search can find: pages and sections, projects, technologies, experience, certifications and
// workshops. Each entry says where to go (`to`), what kind of thing it is (`type`) and an optional hint line.
const pages = [
  { title: 'Selected Work', hint: 'Featured projects', to: '/#work' },
  { title: 'Projects', hint: 'All projects', to: '/projects' },
  { title: 'Tech Stack', hint: 'Languages, frameworks and tools', to: '/tech-stacks' },
  { title: 'Experience', hint: 'Roles and recognition', to: '/experience' },
  { title: 'Certifications', hint: 'Awards and certificates', to: '/certifications' },
  { title: 'Workshops', hint: 'Seminars and workshops', to: '/workshops' },
  { title: 'Contact', hint: 'Beam the Aurora: email and links', to: '/#contact' },
  { title: 'Creative', hint: 'Photography, film and design', to: '/creative' },
].map((p) => ({ ...p, type: 'Page' }));

const seen = new Set();
const tech = techStack
  .flatMap((group) => group.items.map((title) => ({ title, hint: group.label, to: '/tech-stacks', type: 'Tech' })))
  .filter((t) => !seen.has(t.title) && seen.add(t.title));

export const searchIndex = [
  ...pages,
  ...projects.map((p) => ({ title: p.title, hint: p.tags.join(' · '), to: '/projects', type: 'Project', keywords: p.description })),
  ...tech,
  ...experience.map((e) => ({ title: e.role, hint: `${e.org} · ${e.year}`, to: '/experience', type: 'Experience' })),
  ...certifications.map((c) => ({ title: c.title, hint: `${c.issuer} · ${c.year}`, to: '/certifications', type: 'Certification' })),
  ...workshops.map((w) => ({ title: w.title, hint: `${w.organizer} · ${w.year}`, to: '/workshops', type: 'Workshop' })),
];

// Entries shown before anything is typed.
export const quickLinks = pages;

// Every word of the query must appear in the title, hint or keywords; titles that start with the query rank first.
export function search(query, limit = 8) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored = [];
  for (const item of searchIndex) {
    const title = item.title.toLowerCase();
    const hay = `${title} ${item.hint ?? ''} ${item.keywords ?? ''} ${item.type}`.toLowerCase();
    if (!words.every((w) => hay.includes(w))) continue;
    const score = (title.startsWith(words[0]) ? 0 : title.includes(words[0]) ? 1 : 2) + (item.type === 'Page' ? -0.5 : 0);
    scored.push([score, item]);
  }
  return scored.sort((a, b) => a[0] - b[0]).slice(0, limit).map(([, item]) => item);
}
