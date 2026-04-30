import EmptyState from '@/components/common/EmptyState';

export default function NotFound() {
  return (
    <div className="container section-spacing">
      <EmptyState
        title="This page walked off the runway"
        text="The page you are looking for does not exist or may have moved."
        actionHref="/"
        actionLabel="Return home"
      />
    </div>
  );
}
