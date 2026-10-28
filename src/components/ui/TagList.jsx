export default function TagList({ tags, className = '' }) {
  return (
    <ul className={`eyebrow flex flex-wrap gap-x-4 gap-y-1.5 text-fg-subtle ${className}`}>
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}
