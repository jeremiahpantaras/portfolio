import { ArrowUpRight } from 'lucide-react';
import TagList from '../ui/TagList';
import RevealText from '../ui/RevealText';
import RevealBlock from '../ui/RevealBlock';

const pill =
  'eyebrow relative z-10 inline-flex min-h-9 pointer-coarse:min-h-11 items-center gap-1.5 border border-line-strong px-2.5 text-fg-muted transition-colors duration-200 hover:border-fg hover:text-fg focus-visible:border-fg';

// One project as an editorial row. The title is a stretched link to the primary URL (live, else source)
// so the whole row is clickable; explicit "Live" / "Source" pills sit above it. Projects with no URL
// render as plain rows (no dead links).
export default function ProjectRow({ project, index, headingAs = 'h3', animated = false }) {
  const Heading = headingAs;
  const { title, description, tags, links } = project;
  const primary = links.live ?? links.source;
  const num = String(index + 1).padStart(2, '0');
  // `animated` (the home page): the title and description blur in word by word instead of the row sliding in
  const titleText = animated ? <RevealText as="span" preset="body" text={title} /> : title;

  const pills = (
    <>
      {links.live && (
        <a href={links.live} target="_blank" rel="noopener noreferrer" className={pill}>
          Live <ArrowUpRight size={14} aria-hidden="true" />
          <span className="sr-only"> site for {title}</span>
        </a>
      )}
      {links.source && (
        <a href={links.source} target="_blank" rel="noopener noreferrer" className={pill}>
          Source <ArrowUpRight size={14} aria-hidden="true" />
          <span className="sr-only"> code for {title}</span>
        </a>
      )}
    </>
  );

  return (
    <article
      data-reveal={animated ? undefined : 'row'}
      className={`group relative border-t border-line py-5 transition-colors duration-300 md:py-6 ${
        primary ? 'hover:border-line-strong' : ''
      }`}
    >
      <div className="grid gap-4 md:grid-cols-12 md:gap-x-8">
        <p className="eyebrow text-fg-subtle md:col-span-1" aria-hidden="true">
          {num}
        </p>

        <div className="md:col-span-7">
          <Heading className="text-title text-fg-muted transition-colors duration-300 group-hover:text-fg">
            {primary ? (
              <a
                href={primary}
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-8"
              >
                {titleText}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              titleText
            )}
          </Heading>
          {animated ? (
            <RevealText as="p" preset="body" text={description} className="mt-3 max-w-[60ch] text-fg-muted" />
          ) : (
            <p className="mt-3 max-w-[60ch] text-fg-muted">{description}</p>
          )}
        </div>

        <div className="flex flex-col gap-5 md:col-span-4 md:items-end md:text-right">
          {animated ? (
            <RevealBlock delay={0.15}>
              <TagList tags={tags} className="md:justify-end" />
            </RevealBlock>
          ) : (
            <TagList tags={tags} className="md:justify-end" />
          )}
          {(links.live || links.source) &&
            (animated ? (
              <RevealBlock delay={0.3} className="flex flex-wrap gap-2 md:justify-end">
                {pills}
              </RevealBlock>
            ) : (
              <div className="flex flex-wrap gap-2 md:justify-end">{pills}</div>
            ))}
        </div>
      </div>
    </article>
  );
}
