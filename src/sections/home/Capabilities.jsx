import Container from '../../components/ui/Container';
import SectionLabel from '../../components/ui/SectionLabel';
import SectionHeading from '../../components/ui/SectionHeading';
import TextLink from '../../components/ui/TextLink';
import RevealText from '../../components/ui/RevealText';
import { techStack } from '../../data/techStack';

// Plain lists grouped by category: no proficiency bars, percentages or ratings (none exist in the content).
export default function Capabilities() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="scroll-mt-16 py-[clamp(3.5rem,8vh,6rem)]">
      <Container>
        <SectionLabel index="02" animated>
          Capabilities
        </SectionLabel>
        <SectionHeading id="stack-title" animated>
          Tech Stack
        </SectionHeading>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-10 md:grid-cols-3 xl:grid-cols-6">
          {techStack.map((group) => (
            <div key={group.id}>
              <RevealText as="h3" preset="label" text={group.label} className="eyebrow border-t border-line pt-4 text-fg-subtle" />
              <ul className="mt-4 space-y-1">
                {group.items.map((item) => (
                  <li key={item} className="text-fg">
                    <RevealText as="span" preset="label" text={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8" data-reveal="fade">
          <TextLink to="/tech-stacks">Full tech stack</TextLink>
        </p>
      </Container>
    </section>
  );
}
