import ProjectRow from './ProjectRow';

// A list of ProjectRows.
export default function ProjectList({ projects, headingAs, animated = false }) {
  return (
    <div>
      {projects.map((project, i) => (
        <ProjectRow key={project.slug} project={project} index={i} headingAs={headingAs} animated={animated} />
      ))}
      <div className="border-t border-line" />
    </div>
  );
}
