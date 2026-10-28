// Single source of truth for personal info. Text is carried over verbatim from the
// previous MainSection.jsx / About.jsx; see docs/portfolio-enhancement/decisions.md.
import imageMeta from './imageMeta.json';

export const profile = {
  name: 'Jeremiah Pantaras',
  firstName: 'Jeremiah',
  lastName: 'Pantaras',
  title: 'Software Engineer | Full-Stack Developer',
  role: 'Software Engineer',
  location: 'Bacolod City, Negros Occidental, Philippines',
  city: 'Bacolod City, PH',
  email: 'jeremiahpantaras@gmail.com',
  // Hero intro, written for this site (needs owner approval). It follows "Hi! I'm <name>, " in the hero's one sentence.
  intro: 'a software engineer and full-stack developer based in Bacolod City, Philippines, 6100.',
  bio: [
    "I'm an aspiring Software Engineer, eager to learn and grow in the field. I specialize in Python (Django) and React (Vite), focusing on building modern web applications, mobile apps, and contributing to digital marketing efforts.",
    "Currently, I'm helping startups and MSMEs grow with my company, Elpisoft. Beyond building systems, my goal is to foster a community for all developers in Negros Island, centered on sharing knowledge and providing mentorship.",
    "I've recently been diving deep into the world of artificial intelligence, fascinated by its potential. I'm actively learning to integrate AI tools and techniques into modern applications, focusing on developing AI-powered solutions, creating intelligent apps, and using generative AI to optimize workflows and deliver cutting-edge technology.",
  ],
  focus: 'Web applications, mobile apps, AI-powered solutions',
  education: 'Computer Science, STI West Negros University',
  company: {
    name: 'Elpisoft',
    role: 'Co-Founder and Lead Project Manager',
    blurb: 'Leading a team of passionate developers building innovative solutions for startups and MSMEs',
    url: 'https://www.elpisoft.com/',
  },
  cv: {
    path: '/Resume.pdf',
    downloadName: 'Jeremiah-Pantaras-CV.pdf',
  },
  creativeResumePath: '/creative-assets/creative-resume/creative-resume.pdf',
  portrait: {
    src: '/images/portrait/portrait-1200.webp',
    srcSet: `/images/portrait/portrait-640.webp ${imageMeta['/images/portrait/portrait-640.webp'].w}w, /images/portrait/portrait-1200.webp ${imageMeta['/images/portrait/portrait-1200.webp'].w}w`,
    ...imageMeta['/images/portrait/portrait-1200.webp'],
    alt: 'Jeremiah Pantaras seated in a dimly lit room with a city skyline at night in the background',
  },
};
