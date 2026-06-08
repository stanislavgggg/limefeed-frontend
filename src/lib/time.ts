import type { Lang } from "./i18n";

const UNITS: Record<Lang, { now: string; m: string; h: string; d: string }> = {
  en: { now: "now", m: "m", h: "h", d: "d" },
  ru: { now: "сейчас", m: "м", h: "ч", d: "д" },
  es: { now: "ahora", m: "m", h: "h", d: "d" },
};

/** now / 12m / 5h / 2d style relative time. */
export function relativeTime(iso: string | undefined, lang: Lang): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const u = UNITS[lang] ?? UNITS.en;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return u.now;
  if (mins < 60) return `${mins}${u.m}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}${u.h}`;
  const days = Math.floor(hrs / 24);
  return `${days}${u.d}`;
}

export function formatPrice(value: number | null): string {
  if (value == null) return "—";
  if (value >= 1000) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (value >= 1) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 6 })}`;
}

export function formatPct(value: number | null): string {
  if (value == null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}