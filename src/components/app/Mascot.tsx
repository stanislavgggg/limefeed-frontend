import { BRAND } from "@/lib/brand";

/** Small flat vector lime motif used next to the wordmark (no copyrighted art). */
export function LimeMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lime-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--lime)" />
          <stop offset="55%" stopColor="var(--emerald)" />
          <stop offset="100%" stopColor="var(--teal)" />
        </linearGradient>
      </defs>
      <path
        d="M14 6c2 1.5 3 3.5 3 6"
        stroke="var(--emerald)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 7c4-3 9-2 11 1-3 4-8 4-11-1z"
        fill="var(--emerald)"
        opacity="0.85"
      />
      <circle cx="24" cy="28" r="16" fill="url(#lime-g)" />
      <circle cx="24" cy="28" r="16" fill="none" stroke="oklch(0.3 0.06 150)" strokeOpacity="0.3" strokeWidth="1" />
      <g stroke="oklch(0.99 0.02 150 / 0.55)" strokeWidth="1.4" fill="none">
        <path d="M24 28 L24 14" />
        <path d="M24 28 L36 22" />
        <path d="M24 28 L37 32" />
        <path d="M24 28 L31 40" />
        <path d="M24 28 L17 40" />
        <path d="M24 28 L11 32" />
        <path d="M24 28 L12 22" />
      </g>
      <circle cx="19" cy="22" r="3.4" fill="oklch(0.99 0.02 150 / 0.4)" />
    </svg>
  );
}

export function LimoAvatar({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <img
      src={BRAND.mascot.image}
      alt={`${BRAND.mascot.name} the lime mascot`}
      width={1024}
      height={1024}
      loading="lazy"
      className={`object-contain drop-shadow-[0_8px_30px_rgba(33,224,122,0.35)] ${className}`}
    />
  );
}