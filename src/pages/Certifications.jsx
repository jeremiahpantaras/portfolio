import PageShell from '../components/layout/PageShell';
import TextLink from '../components/ui/TextLink';
import { certifications, conference } from '../data/recognition';

export default function Certifications() {
  return (
    <PageShell
      label="Index — Recognition"
      title="Certifications"
      meta={{
        title: 'Certifications | Jeremiah Pantaras',
        description:
          'Awards, certifications and conference presentations by Jeremiah Pantaras, including ICT Olympics Web Design and Development.',
        path: '/certifications',
      }}
    >
      <ol>
        {certifications.map((cert, i) => (
          <li key={cert.title} data-reveal="row" className="grid gap-2 border-t border-line py-5 md:grid-cols-12 md:gap-8">
            <p className="eyebrow text-fg-subtle md:col-span-2">
              {String(i + 1).padStart(2, '0')} · {cert.year}
            </p>
            <div className="md:col-span-10">
              <h2 className="text-heading text-fg">{cert.title}</h2>
              <p className="mt-1 text-fg-muted">{cert.issuer}</p>
            </div>
          </li>
        ))}
        <li data-reveal="row" className="grid gap-2 border-t border-line py-5 md:grid-cols-12 md:gap-8">
          <p className="eyebrow text-fg-subtle md:col-span-2">
            {String(certifications.length + 1).padStart(2, '0')} · {conference.year}
          </p>
          <div className="md:col-span-10">
            <h2 className="text-heading text-fg">{conference.title}</h2>
            <p className="mt-1 text-fg-muted">{conference.place}</p>
            <p className="mt-3 text-small">
              <TextLink href={conference.url}>Conference schedule</TextLink>
            </p>
          </div>
        </li>
      </ol>
      <div className="border-t border-line" />
    </PageShell>
  );
}
