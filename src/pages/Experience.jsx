import PageShell from '../components/layout/PageShell';
import { experience } from '../data/experience';

export default function Experience() {
  return (
    <PageShell
      label="Index — Experience"
      title="Experience"
      meta={{
        title: 'Experience | Jeremiah Pantaras',
        description:
          'Professional experience of Jeremiah Pantaras: Elpisoft, freelance full-stack development, a Computer Science thesis project and early roles.',
        path: '/experience',
      }}
    >
      <ol>
        {experience.map((job) => (
          <li
            key={`${job.role}-${job.year}`}
            data-reveal="row"
            className="grid gap-2 border-t border-line py-5 md:grid-cols-12 md:gap-8"
          >
            <p className="eyebrow text-fg-subtle md:col-span-2">{job.year}</p>
            <div className="md:col-span-10">
              <h2 className="text-heading text-fg">{job.role}</h2>
              <p className="mt-1 text-fg-muted">{job.org}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="border-t border-line" />
    </PageShell>
  );
}
