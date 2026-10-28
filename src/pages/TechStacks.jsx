import PageShell from '../components/layout/PageShell';
import { techStack } from '../data/techStack';

export default function TechStacks() {
  return (
    <PageShell
      label="Index — Capabilities"
      title="Tech Stack"
      meta={{
        title: 'Tech Stack | Jeremiah Pantaras',
        description:
          'Technologies Jeremiah Pantaras works with: React, TypeScript, Python, Django, Node.js, PostgreSQL, Firebase, Docker and more.',
        path: '/tech-stacks',
      }}
    >
      <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {techStack.map((group) => (
          <section key={group.id} aria-labelledby={`stack-${group.id}`}>
            <div data-reveal="rule" className="h-px w-full bg-line" />
            <h2 id={`stack-${group.id}`} data-reveal="fade" className="eyebrow mt-4 text-fg-subtle">
              {group.label}
            </h2>
            <ul data-reveal="stagger" className="mt-4 space-y-1">
              {group.items.map((item) => (
                <li key={item} data-reveal-item className="text-heading text-fg">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
