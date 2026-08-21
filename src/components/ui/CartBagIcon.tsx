export default function CartBagIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 8.1h10.8l.95 12.35a1.15 1.15 0 0 1-1.14 1.3H6.79a1.15 1.15 0 0 1-1.14-1.3L6.6 8.1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8.7 8.1V6.85a3.3 3.3 0 0 1 6.6 0V8.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
