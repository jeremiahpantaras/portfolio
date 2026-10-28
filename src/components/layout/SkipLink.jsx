export default function SkipLink() {
  const skip = (e) => {
    e.preventDefault();
    const main = document.getElementById('content');
    main?.focus({ preventScroll: true });
    main?.scrollIntoView();
  };
  return (
    <a
      href="#content"
      onClick={skip}
      className="sr-only-focusable fixed left-4 top-4 z-[100] bg-fg px-4 py-3 text-small font-medium text-ink-950"
    >
      Skip to content
    </a>
  );
}
