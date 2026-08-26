export default function CartBagIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 21 21" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        stroke="none"
        d="M7 6v-.5a3.5 3.5 0 1 1 7 0V6h3v13H4V6h3Zm1-.5a2.5 2.5 0 0 1 5 0V6H8v-.5ZM7 7v1.5h1V7h5v1.5h1V7h2v11H5V7h2Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
