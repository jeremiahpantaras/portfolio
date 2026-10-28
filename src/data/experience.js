// Experience timeline, newest first. Union of the old home list and pages/Experience.jsx.
// The company-role wording follows the old home page (see decisions.md 2a).
export const experience = [
  { role: 'Software Engineer - Full-Stack Developer', org: 'Elpisoft', year: '2025' },
  { role: 'Project Manager / Lead Web Developer', org: 'Computer Science Thesis', year: '2024' },
  { role: 'Freelance Full-Stack Developer', org: 'Bacolod City, Philippines', year: '2024' },
];

// The home page shows all of them (the "Intern - Web Developer" and "Student Assistant - IT" entries were removed by the
// owner, and no entry is labelled "Current" any more).
export const featuredExperience = experience.slice(0, 3);
