import Container from '../../components/ui/Container';
import SectionLabel from '../../components/ui/SectionLabel';
import SectionHeading from '../../components/ui/SectionHeading';
import TextLink from '../../components/ui/TextLink';
import ProjectList from '../../components/projects/ProjectList';
import { featuredProjects, projects } from '../../data/projects';

export default function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-16 py-[clamp(3.5rem,8vh,6rem)]">
      <Container>
        <SectionLabel index="01" animated>
          Selected Work
        </SectionLabel>
        <SectionHeading id="work-title" animated>
          Selected Work
        </SectionHeading>
        <div className="mt-8 md:mt-10">
          <ProjectList projects={featuredProjects} animated />
        </div>
        <p className="mt-6" data-reveal="fade">
          <TextLink to="/projects">All {projects.length} projects</TextLink>
        </p>
      </Container>
    </section>
  );
}
