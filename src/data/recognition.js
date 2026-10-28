// Certifications, conference and workshops (previously duplicated in MainSection and three pages).
// `badge` emoji are kept for completeness but are not rendered by the redesigned UI.

export const certifications = [
  { title: 'ICT Olympics Web Design and Development Champion', issuer: 'STIWNU-CICT', year: '2022', badge: '🏆' },
  { title: 'ICT Olympics Web Design and Development 3rd Placer', issuer: 'STIWNU-CICT', year: '2023', badge: '🏆' },
  { title: 'Philippine Institute of Cyber Security Professionals Inc.', issuer: 'PICSPRO Inc.', year: '2023', badge: '🎖️' },
];

// Source: the "Presented in the 11th Asia International Conference 2025" badge on the old home page and the
// chat context (portfolio-context.json: Kuala Lumpur, Malaysia). The URL is kept exactly as it was; it
// returned 404 when checked on 2026-10-27 (with or without its tracking query), so it needs owner review.
export const conference = {
  title: 'Presented in the 11th Asia International Conference 2025',
  place: 'Kuala Lumpur, Malaysia',
  year: '2025',
  url: 'https://portal.connectingasia.org/conference/schedule/aic?_gl=1*tctq5t*_gcl_au*MTY4NTUzNzc5NS4xNzYzNTU4NTg4*_ga*MTE0Mjk2NzQ4My4xNzYzNTU4NTg4*_ga_VGQ86S5R1H*czE3NjUyODYwNjkkbzMkZzAkdDE3NjUyODYwNjkkajYwJGwwJGgw&_ga=2.32719870.1781276684.1765286072-1142967483.1763558588',
};

export const workshops = [
  { title: 'DevFest Workshop Series: Introduction to Web Development', organizer: 'Google Developer Groups Bacolod', year: '2025', badge: '📲' },
  { title: 'House of Algorithm Seminar and Workshop', organizer: "STIWNU Programmers' Guild", year: '2025', badge: '🧑🏻‍💻' },
  { title: 'Mastering Figma: Turning Design Concepts into Interactive Prototypes', organizer: "STIWNU Programmers' Guild", year: '2024', badge: '🍥' },
  { title: 'Mastering Dimensions: 2D and 3D Concept Arts', organizer: 'Holysoft Studios', year: '2024', badge: '👾' },
  { title: 'Philippines Institute of Cyber Security Professionals Workshop', organizer: 'PICSPRO Inc.', year: '2024', badge: '🪪' },
  { title: 'From Sketch to Screen: Exploring Techniques For A Creative Web Design', organizer: "STIWNU Programmers' Guild", year: '2023', badge: '💻' },
  // Previously spelled "Programerss' Guild" (obvious typo).
  { title: "Programmers' Guild: IMentor Workshop", organizer: "STIWNU Programmers' Guild", year: '2022', badge: '🗣️' },
];

// The home page previously showed the first three workshops.
export const featuredWorkshops = workshops.slice(0, 3);
