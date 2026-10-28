import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import Container from '../../components/ui/Container';
import SectionLabel from '../../components/ui/SectionLabel';
import SectionHeading from '../../components/ui/SectionHeading';
import Button from '../../components/ui/Button';
import TextLink from '../../components/ui/TextLink';
import RevealText from '../../components/ui/RevealText';
import { useSiteUi } from '../../components/layout/siteUi';
import { profile } from '../../data/profile';
import { socials } from '../../data/socials';

export default function Contact() {
  const { openCv } = useSiteUi();
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the mailto link above still works */
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-16 py-[clamp(3.5rem,8vh,6rem)]">
      <Container>
        <SectionLabel index="04" animated>
          Contact
        </SectionLabel>
        <SectionHeading id="contact-title" animated>
          Beam the Aurora
        </SectionHeading>

        <div className="mt-8 md:mt-10">
          <a
            href={`mailto:${profile.email}`}
            className="link-u block text-[clamp(1.1rem,3.4vw,2.6rem)] font-medium leading-[1.05] tracking-tight text-fg [overflow-wrap:anywhere]"
          >
            <RevealText as="span" preset="heading" animateBy="letters" delay={28} stepDuration={0.45} distance={18} text={profile.email} />
          </a>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={copy}
              className="eyebrow inline-flex min-h-9 pointer-coarse:min-h-11 items-center gap-2 text-fg-muted transition-colors hover:text-fg"
            >
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy email'}
            </button>
            <span role="status" aria-live="polite" className="sr-only">
              {copied ? 'Email address copied to clipboard' : ''}
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <RevealText as="p" preset="body" text={profile.location} className="text-fg-muted md:col-span-5" />

          <ul data-reveal="stagger" className="flex flex-wrap gap-x-8 gap-y-1 md:col-span-7">
            {socials.map((s) => (
              <li key={s.id} data-reveal-item>
                <TextLink href={s.url} className="eyebrow min-h-9 pointer-coarse:min-h-11">
                  {s.label}
                </TextLink>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal="fade" className="mt-8 flex flex-wrap gap-2">
          <Button onClick={openCv}>View CV</Button>
          <Button href={profile.cv.path} download={profile.cv.downloadName}>
            Download CV
          </Button>
        </div>
      </Container>
    </section>
  );
}
