import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Loading() {
  return (
    <div className="container section-spacing">
      <LoadingSpinner label="Loading page..." />
    </div>
  );
}
