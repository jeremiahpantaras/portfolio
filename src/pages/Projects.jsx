import PageShell from '../components/layout/PageShell';
import ProjectList from '../components/projects/ProjectList';
import { projects } from '../data/projects';

export default function Projects() {
  return (
    <PageShell
      label="Index — Projects"
      title="Projects"
      count={`${projects.length} projects`}
      meta={{
        title: 'Projects | Jeremiah Pantaras',
        description:
          'Web applications, open-source tools and thesis projects by Jeremiah Pantaras, built with Python Django, React, TypeScript and Firebase.',
        path: '/projects',
      }}
    >
      {/* h2 (not the default h3): this page has no other heading between the h1 and the project titles */}
      <ProjectList projects={projects} headingAs="h2" />
    </PageShell>
  );
}
