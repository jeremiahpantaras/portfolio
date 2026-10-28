// All 16 projects (the superset previously in pages/Projects.jsx; the home page showed 13 of them).
// `links.live` / `links.source` are only present when a real URL exists ('#' placeholders were dropped).

export const projects = [
  {
    slug: 'orki',
    title: 'Orki - Board Exam Review Platform',
    description:
      'Orki is a modern, web-app-first platform designed to help board exam takers study smarter, stay consistent, and track their progress with clarity.',
    tags: ['Python Django', 'ReactJs', 'Typescript', 'Firebase', 'RESTful API'],
    links: { live: 'https://orki.cosedevs.com' },
  },
  {
    slug: 'incognito',
    title: 'Incognito - Anonymous Messaging App',
    description:
      'Incognito is a modern web application that allows people to send anonymous messages through a unique, shareable link. It’s designed not just for fun confessions, but for honest feedback, suggestions, and civic participation—without fear or bias.',
    tags: ['Node.js', 'TypeScript', 'React', 'Tailwind CSS', 'Firebase', 'Firestore Auth'],
    links: { live: 'https://incognito.cosedevs.com' },
  },
  {
    slug: 'asikaso',
    title: 'Asikaso - Task Management Application',
    description:
      'ASIK is a modern, full-stack task management application designed for companies to efficiently manage tasks, teams, and projects. Built with the power of React, Node.js, Firebase, and Tailwind CSS, it provides a seamless experience for teams to collaborate and stay productive.',
    tags: ['TypeScript', 'Node.js', 'Tailwind CSS', 'Firebase', 'Firestore Auth'],
    links: {},
  },
  {
    slug: 'epuno',
    title: 'ePuno',
    description:
      'ePuno is designed as a foundational block, demonstrating the power of localized tracking in a global framework. It is the benchmark in this directory, setting standards for clarity, impact, and user focus.',
    tags: ['Node.js', 'TypeScript', 'React', 'Tailwind CSS', 'Firebase', 'Firestore Auth'],
    links: { live: 'https://epuno.vercel.app' },
  },
  {
    slug: 'recivo',
    title: 'Recivo - Receipt Generation Platform',
    description:
      'Recivo is a modern receipt generation platform designed specifically for online sellers and business owners. Create, manage, and share professional receipts in seconds—without the hassle of manual paperwork.',
    tags: ['TypeScript', 'React', 'Tailwind CSS', 'JavaScript', 'Node.js', 'Firebase'],
    links: { live: 'https://recivo.cosedevs.com' },
  },
  {
    slug: 'satoru',
    title: 'Satoru - Automated learning tool',
    description:
      'Satoru is a web application designed to intelligently summarize and extract key information from uploaded documents, providing users with quick, distilled insights.',
    tags: ['Python Django', 'Rest-framework', 'Vite React', 'Typescript', 'GSAP', 'Tailwind CSS'],
    links: { source: 'https://github.com/Yirmeyahuu/satoru' },
  },
  {
    slug: 'askium',
    title: 'Askium - AI Chatbot with Ollama',
    description: 'A modern, full-stack AI chatbot application powered by local LLMs',
    tags: ['Python Django', 'Ollama - Local LLM', 'Vite React', 'Tailwind CSS'],
    links: { source: 'https://github.com/Yirmeyahuu/Askium' },
  },
  {
    slug: 'tabang-negros',
    title: 'Tabang Negros - Emergency Help Request System',
    description:
      'A real-time emergency help request system designed for Negros Island, Philippines. Allows users to quickly send emergency requests with exact GPS location to responders.',
    tags: ['React', 'Django', 'PostgreSQL', 'Leaflet', 'Tailwind CSS', 'Vite'],
    links: { live: 'https://tabangnegros-installation.vercel.app/' },
  },
  {
    slug: 'avendro',
    title: 'Avendro - Lending Management System',
    description: 'A comprehensive system to manage lending operations, from client onboarding to payment tracking.',
    tags: ['Python Django', 'PostgreSQL', 'Tailwind CSS'],
    links: { live: 'https://avendrobcd.onrender.com/' },
  },
  {
    slug: 'sentinels-gamified',
    title: 'Sentinels - Gamified Cybersecurity Education',
    description:
      'An interactive mobile application that teaches cybersecurity concepts through engaging games and quizzes.',
    tags: ['C#', 'Firebase', 'Unity Engine', 'Python', 'Django'],
    links: {},
  },
  {
    slug: 'mabels',
    title: 'Mabels - Restaurant Management System',
    description:
      'An open source restaurant management system. This is used for clone, push, and remote code with regards to our project, MBALES POS | ORDER | INVENTORY MANAGEMENT SYSTEM.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    links: { source: 'https://github.com/jeremiahpantaras/Mabels' },
  },
  {
    slug: 'sentinels-sms',
    title: 'Sentinels Student Management System',
    description:
      'A gamified cybersecurity learning platform for Cybersecurity Fundamentals. A Thesis Study of DevInnovate. Empower your classroom with interactive tasks, real-time progress tracking, and a leaderboard that sparks friendly competition.',
    tags: ['Python Django', 'Tailwind CSS'],
    links: { live: 'https://sentinelsadmin.onrender.com' },
  },
  {
    slug: 'car-management',
    title: 'Open Source Car Management System',
    description:
      'Developed a web-based Car Management System utilizing Python Django and a MySQL database. This project implements fundamental CRUD (Create, Read, Update, Delete) operations, featuring a responsive user interface built with Bootstrap.',
    tags: ['Python Django', 'Bootstrap'],
    links: { source: 'https://github.com/jeremiahpantaras/Car-Management-System' },
  },
  {
    slug: 'qr-generator',
    title: 'Open Source QR Generator',
    description:
      'A sleek Python-based QR code generator that creates beautiful, white-on-transparent QR codes with corners. Perfect for overlaying on dark backgrounds, presentations, or modern web designs!',
    tags: ['Python', 'qrcode[pil]', 'Pillow'],
    links: { source: 'https://github.com/jeremiahpantaras/python-qr-generator' },
  },
  {
    slug: 'marketplace',
    title: 'Marketplace - E-commerce Platform',
    description:
      'A full-featured e-commerce website with product listings, user accounts, and a secure checkout process.',
    tags: ['Python', 'Django', 'React', 'PostgreSQL'],
    links: {},
  },
  {
    slug: 'construction-inventory',
    title: 'Construction Inventory Management System',
    description:
      'A comprehensive system for managing construction inventory, including tracking materials, equipment, and supplies.',
    tags: ['Python', 'Django', 'React', 'Tailwind CSS', 'PostgreSQL'],
    links: {},
  },
];

// Featured on the home page, in display order (needs owner approval; see decisions.md).
const FEATURED = ['satoru', 'orki', 'incognito', 'recivo'];
export const featuredProjects = FEATURED.map((slug) => projects.find((p) => p.slug === slug));
