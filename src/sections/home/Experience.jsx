import Container from '../../components/ui/Container';
import SectionLabel from '../../components/ui/SectionLabel';
import SectionHeading from '../../components/ui/SectionHeading';
import TextLink from '../../components/ui/TextLink';
import RevealText from '../../components/ui/RevealText';
import { experience } from '../../data/experience';
import { certifications, conference, featuredWorkshops } from '../../data/recognition';

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-16 py-[clamp(3.5rem,8vh,6rem)]">
      <Container>
        <SectionLabel index="03" animated>
          Experience &amp; Recognition
        </SectionLabel>
        <SectionHeading id="experience-title" animated>
          Experience
        </SectionHeading>

        <div className="mt-8 grid gap-10 md:mt-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <RevealText as="h3" preset="label" text="Experience" className="eyebrow text-fg-subtle" />
            <ol className="mt-4">
              {experience.map((job) => (
                <li key={`${job.role}-${job.year}`} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[5rem_1fr] sm:gap-5">
                  <RevealText as="p" preset="label" text={job.year} className="eyebrow text-fg-subtle" />
                  <div>
                    <RevealText as="p" preset="body" text={job.role} className="text-heading text-fg" />
                    <RevealText as="p" preset="body" text={job.org} className="mt-1 text-fg-muted" />
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6">
              <TextLink to="/experience">Full experience</TextLink>
            </p>
          </div>

          <div className="space-y-8 lg:col-span-5">
            <div>
              <RevealText as="h3" preset="label" text="Recognition" className="eyebrow text-fg-subtle" />
              <ul className="mt-4">
                {certifications.slice(0, 2).map((c) => (
                  <li key={c.title} className="border-t border-line py-3.5">
                    <RevealText as="p" preset="body" text={c.title} className="text-fg" />
                    <RevealText as="p" preset="body" text={`${c.issuer} · ${c.year}`} className="mt-1 text-small text-fg-muted" />
                  </li>
                ))}
                <li className="border-t border-line py-3.5">
                  <RevealText as="p" preset="body" text={conference.title} className="text-fg" />
                  <RevealText as="p" preset="body" text={`${conference.place} · ${conference.year}`} className="mt-1 text-small text-fg-muted" />
                </li>
                <li className="border-t border-line py-3.5">
                  <RevealText as="p" preset="body" text={certifications[2].title} className="text-fg" />
                  <RevealText as="p" preset="body" text={`${certifications[2].issuer} · ${certifications[2].year}`} className="mt-1 text-small text-fg-muted" />
                </li>
              </ul>
              <p className="mt-2">
                <TextLink to="/certifications">All certifications</TextLink>
              </p>
            </div>

            <div>
              <RevealText as="h3" preset="label" text="Seminars & Workshops" className="eyebrow text-fg-subtle" />
              <ul className="mt-4">
                {featuredWorkshops.map((w) => (
                  <li key={w.title} className="border-t border-line py-3.5">
                    <RevealText as="p" preset="body" text={w.title} className="text-fg" />
                    <RevealText as="p" preset="body" text={`${w.organizer} · ${w.year}`} className="mt-1 text-small text-fg-muted" />
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                <TextLink to="/workshops">All workshops</TextLink>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
