import { Link } from "react-router-dom";

// The 3x3 rounded-square grid — the same motif as the availability heatmap.
// Uses currentColor so it inherits its colour from context (teal in the nav,
// --fg in monochrome contexts).
export function Mark({ size = 26 }: { size?: number }) {
  return (
    <svg
      className="mark"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6" y="6" width="26" height="26" rx="7" opacity=".22" />
      <rect x="37" y="6" width="26" height="26" rx="7" opacity=".46" />
      <rect x="68" y="6" width="26" height="26" rx="7" opacity=".22" />
      <rect x="6" y="37" width="26" height="26" rx="7" opacity=".46" />
      <rect className="mark-core" x="37" y="37" width="26" height="26" rx="7" />
      <rect x="68" y="37" width="26" height="26" rx="7" opacity=".46" />
      <rect x="6" y="68" width="26" height="26" rx="7" opacity=".22" />
      <rect x="37" y="68" width="26" height="26" rx="7" opacity=".46" />
      <rect x="68" y="68" width="26" height="26" rx="7" opacity=".22" />
    </svg>
  );
}

// The full lockup used in the nav: the teal mark + the wordmark, linking home.
export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="samkoma — home">
      <span className="logo-mark">
        <Mark size={26} />
      </span>
      <span className="wordmark">samkoma</span>
    </Link>
  );
}
