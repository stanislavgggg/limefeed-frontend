// ============================================================================
// THE ONE BACKEND MODULE. No component fetches the API directly.
// FIXED CONTRACT — do not invent endpoints, do not gate /api/news via params.
// ============================================================================

import { BRAND } from "./brand";
import { getUid, openExternal } from "./telegram";

// API base reader MUST stay this exact form: absolute URL, default "".
const API_BASE = import.meta.env.VITE_API_BASE || "";

// ---------------------------------------------------------------------------
// Types — mirror the fixed contract exactly.
// ---------------------------------------------------------------------------
export type Category = "all" | "crypto" | "casino" | "esports";

export interface AppConfig {
  brand: string;
  display_name: string;
  tagline: string;
  character: { name: string; role: string };
  mode: "product" | "channel";
  show_offer: boolean;
  cta: {
    label: { en?: string; ru?: string; es?: string };
    url: string;
    channel: string;
    channel_url: string;
    gate: boolean;
    bot_username: string;
    partner_name: string;
  };
  offer?: unknown;
  markets?: unknown;
  honest_stats?: unknown;
  win_rate_display?: unknown;
  privacy_url?: string;
}

export interface NewsItem {
  id: string | number;
  title: string;
  url: string;
  source: string;
  category: "crypto" | "casino" | "esports";
  published_at: string;
  image: string | null;
  summary: string;
}

export interface NewsCoin {
  symbol: string;
  name?: string;
  price: number | null;
  change_24h: number | null;
  image?: string | null;
}

export interface NewsMarket {
  coins: NewsCoin[];
  fng: { value: number; label: string } | null;
  mcap_change_24h: number | null;
  btc_dominance: number | null;
}

export interface NewsResponse {
  items: NewsItem[];
  market: NewsMarket;
  updated_at: string;
}

export interface BackendMatch {
  game: string;
  team1: string;
  team2: string;
  league?: string;
  score1?: number | null;
  score2?: number | null;
  begin_at?: string;
  format?: string;
  id?: number | string;
}

export interface MembershipResponse {
  uid: number | null;
  member: boolean;
  gate: { enabled: boolean; locked: boolean; is_member: boolean; channel: string };
  channel: string;
  configured: boolean;
}

export interface StatsResponse {
  correct: number;
  total: number;
  rate: number | null;
  note: "accumulating" | "real";
}

export type EventName = "cta_view" | "cta_tap" | "channel_open";

// ---------------------------------------------------------------------------
// Low-level fetch
// ---------------------------------------------------------------------------
async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`);
  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// Endpoints (exact contract)
// ---------------------------------------------------------------------------
export const getConfig = () => apiGet<AppConfig>("/api/config");

export const getNews = (category: Category = "all", limit = 40) =>
  apiGet<NewsResponse>(`/api/news?category=${category}&limit=${limit}`);

export const getLive = () => apiGet<{ matches: BackendMatch[] }>("/api/live");

export const getUpcoming = () => apiGet<{ matches: BackendMatch[] }>("/api/upcoming");

export const getStats = () => apiGet<StatsResponse>("/api/stats");

export function getMembership(): Promise<MembershipResponse> {
  const uid = getUid();
  const q = uid != null ? `?uid=${uid}` : "";
  return apiGet<MembershipResponse>(`/api/membership${q}`);
}

// Fire-and-forget analytics. Never throws. Always include a surface in meta.
export function postEvent(
  event: EventName,
  meta: { surface: string } & Record<string, unknown>,
): void {
  try {
    const uid = getUid();
    const body = JSON.stringify({ event, uid: uid ?? undefined, meta });
    fetch(`${API_BASE}/api/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never throws */
  }
}

// ---------------------------------------------------------------------------
// Open the Telegram channel (fire channel_open first).
// ---------------------------------------------------------------------------
export function openChannel(config: AppConfig | undefined, surface: string) {
  postEvent("channel_open", { surface });
  const channelUrl = config?.cta.channel_url;
  const botUsername = config?.cta.bot_username || BRAND.botUsername;
  const url =
    channelUrl ||
    (botUsername ? `https://t.me/${botUsername}?start=join` : "");
  if (url) openExternal(url);
}

// Resolved display values: runtime config first, env/brand fallback.
export function resolveBranding(config: AppConfig | undefined) {
  return {
    displayName: config?.display_name || BRAND.wordmark,
    tagline: config?.tagline || "",
    characterName: config?.character?.name || BRAND.mascot.name,
    channel: config?.cta.channel || BRAND.channelHandle,
    botUsername: config?.cta.bot_username || BRAND.botUsername,
    privacyUrl: config?.privacy_url || "",
  };
}