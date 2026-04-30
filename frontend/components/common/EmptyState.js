import Link from 'next/link';

export default function EmptyState({ title, text, actionHref, actionLabel }) {
  return (
    <section className="empty-state">
      <span className="eyebrow">Nothing here yet</span>
      <h2>{title}</h2>
      <p>{text}</p>
      {actionHref && actionLabel ? (
        <Link className="button button-primary" href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
