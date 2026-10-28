import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <PageShell
      label="Error — 404"
      title="Lost at sea."
      meta={{ title: 'Page not found | Jeremiah Pantaras', description: 'This page does not exist.', noindex: true }}
    >
      <p className="text-lead max-w-[40ch] text-fg-muted">That page doesn&rsquo;t exist, or it has moved.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button to="/" variant="primary">
          Back to home
        </Button>
        <Button to="/projects">View projects</Button>
      </div>
    </PageShell>
  );
}
