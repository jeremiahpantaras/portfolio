import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import Container from '../ui/Container';
import BlurText from '../ui/BlurText';
import ShinyText from '../ui/ShinyText';
import useReducedMotion from '../../hooks/useReducedMotion';
import Button from '../ui/Button';
import RevealBlock from '../ui/RevealBlock';
import SocialIcon from '../ui/SocialIcon';
import { useSiteUi } from '../layout/siteUi';
import { profile } from '../../data/profile';
import { socials } from '../../data/socials';
import { usePreloaderDone } from '../../lib/preloader';

// Hero: one justified sentence, "Hi! I'm Jeremiah Pantaras, a software engineer and ...", with the name in shiny text (a
// band of light sweeps across it), then the calls to action, centred over the fixed AuroraScene (the sky behind the
// whole page). The words blur in once the opening preloader has gone. The page's h1 is the name, visually hidden here
// because the sentence is the visible heading.
export default function Hero() {
  const { openCv } = useSiteUi();
  const ready = usePreloaderDone(); // the sentence is held back (invisible, same space) until the preloader is gone
  const reduced = useReducedMotion();
  const blurProps = { as: 'span', inline: true, trigger: 'load', direction: 'bottom', stepDuration: 0.55, blur: 8, distance: 16 };

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-center pb-36 pt-20 md:pb-40"
    >
      <Container className="relative flex justify-center">
        <div className="relative z-10 flex w-[min(100%,32rem)] flex-col items-center">
          <h1 id="hero-title" className="sr-only">
            {profile.name}
          </h1>

          <p className="w-full text-[clamp(1.05rem,1.7vw,1.3rem)] leading-[1.5] text-fg-muted/90 [text-align-last:center] [text-align:justify]">
            {ready ? (
              <>
                <BlurText {...blurProps} text="Hi! I'm" delay={60} />{' '}
                <span className="hero-name whitespace-nowrap">
                  <ShinyText
                    text={profile.name}
                    color="#ffffff"
                    shineColor="#ffffff"
                    speed={2}
                    delay={1.6}
                    shineWidth={55}
                    softness={0.9}
                    glow={1}
                    angle={110}
                    disabled={reduced}
                    className="font-semibold"
                  />
                  ,
                </span>{' '}
                <BlurText {...blurProps} text={profile.intro} delay={40} />
              </>
            ) : (
              <span className="invisible">
                Hi! I&apos;m {profile.name}, {profile.intro}
              </span>
            )}
          </p>

          <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <RevealBlock as="span" trigger="load" delay={0.6}>
              <Button to="/#work" variant="ghost">
                View selected work
                <ArrowDown size={16} aria-hidden="true" />
              </Button>
            </RevealBlock>
            <RevealBlock as="span" trigger="load" delay={0.75}>
              <Button onClick={openCv} variant="ghost">
                View CV
                <ArrowUpRight size={16} aria-hidden="true" />
              </Button>
            </RevealBlock>
            <RevealBlock as="span" trigger="load" delay={0.9}>
              <Button href={`mailto:${profile.email}`} variant="ghost">
                Email me
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </RevealBlock>
          </div>

          <div className="mt-4 flex w-full justify-center">
            {socials.map((s, i) => (
              <RevealBlock key={s.id} as="span" trigger="load" delay={1.05 + i * 0.1}>
                <SocialIcon social={s} />
              </RevealBlock>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
