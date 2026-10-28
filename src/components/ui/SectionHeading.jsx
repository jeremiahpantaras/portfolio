import RevealText from './RevealText';

// `animated` (the home page's sections) blurs the heading in word by word; the other pages keep the plain heading.
export default function SectionHeading({ as = 'h2', id, className = '', animated = false, children }) {
  const Tag = as;
  if (animated && typeof children === 'string') {
    return <RevealText preset="heading" as={as} id={id} text={children} className={`text-display text-fg ${className}`} />;
  }
  return (
    <Tag id={id} data-reveal="heading" className={`text-display text-fg ${className}`}>
      {children}
    </Tag>
  );
}
