// Telegram WebApp SDK helpers — degrade gracefully outside Telegram.

type HapticStyle = "light" | "medium" | "heavy" | "rigid" | "soft";

interface TGUser {
  id?: number;
  language_code?: string;
  first_name?: string;
}

interface TelegramWebApp {
  initDataUnsafe?: { user?: TGUser };
  themeParams?: Record<string, string>;
  ready?: () => void;
  expand?: () => void;
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string) => void;
  HapticFeedback?: {
    impactOccurred?: (style: HapticStyle) => void;
    notificationOccurred?: (type: "error" | "success" | "warning") => void;
    selectionChanged?: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export function tg(): TelegramWebApp | undefined {
  if (typeof window === "undefined") return undefined;
  return window.Telegram?.WebApp;
}

export function isInTelegram(): boolean {
  return Boolean(tg()?.initDataUnsafe?.user?.id);
}

export function getUid(): number | null {
  const id = tg()?.initDataUnsafe?.user?.id;
  return typeof id === "number" ? id : null;
}

export function getTelegramLang(): string | null {
  return tg()?.initDataUnsafe?.user?.language_code ?? null;
}

export function initTelegram() {
  const app = tg();
  if (!app) return;
  try {
    app.ready?.();
    app.expand?.();
  } catch {
    /* noop */
  }
}

export function haptic(style: HapticStyle = "light") {
  try {
    tg()?.HapticFeedback?.impactOccurred?.(style);
  } catch {
    /* noop */
  }
}

export function hapticSuccess() {
  try {
    tg()?.HapticFeedback?.notificationOccurred?.("success");
  } catch {
    /* noop */
  }
}

export function openExternal(url: string) {
  const app = tg();
  if (app?.openTelegramLink && url.includes("t.me")) {
    app.openTelegramLink(url);
  } else if (app?.openLink) {
    app.openLink(url);
  } else if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}