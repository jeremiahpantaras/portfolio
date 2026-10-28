import PageShell from '../components/layout/PageShell';
import { workshops } from '../data/recognition';

// Workshops grouped by year, newest first (data is already ordered that way).
const byYear = workshops.reduce((acc, w) => {
  (acc[w.year] ??= []).push(w);
  return acc;
}, {});

export default function Workshop() {
  return (
    <PageShell
      label="Index — Seminars"
      title="Seminars & Workshops"
      count={`${workshops.length} entries`}
      meta={{
        title: 'Seminars & Workshops | Jeremiah Pantaras',
        description:
          'Seminars and workshops Jeremiah Pantaras has taken part in, from Google Developer Groups Bacolod and the STIWNU Programmers\' Guild to PICSPRO.',
        path: '/workshops',
      }}
    >
      {Object.entries(byYear)
        .sort(([a], [b]) => b - a)
        .map(([year, items]) => (
          <section key={year} className="grid gap-4 border-t border-line py-5 md:grid-cols-12 md:gap-8">
            <h2 data-reveal="fade" className="eyebrow text-fg-subtle md:col-span-2">
              {year}
            </h2>
            <ul className="space-y-5 md:col-span-10">
              {items.map((w) => (
                <li key={w.title} data-reveal="row">
                  <p className="text-heading text-fg">{w.title}</p>
                  <p className="mt-1 text-fg-muted">{w.organizer}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      <div className="border-t border-line" />
    </PageShell>
  );
}
