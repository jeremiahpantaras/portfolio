import RevealText from './RevealText';

// Hairline + mono index label that opens every section ("02 — Work"). `animated` blurs the label in.
export default function SectionLabel({ index, children, className = '', animated = false }) {
  const label = `${index ? `${index} — ` : ''}${children}`;
  return (
    <div className={`mb-6 md:mb-8 ${className}`}>
      <div data-reveal="rule" className="h-px w-full bg-line" />
      {animated ? (
        <RevealText preset="label" text={label} className="eyebrow mt-4 text-fg-subtle" />
      ) : (
        <p data-reveal="fade" className="eyebrow mt-4 text-fg-subtle">
          {label}
        </p>
      )}
    </div>
  );
}
