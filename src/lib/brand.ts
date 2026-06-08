// ============================================================================
// SINGLE SOURCE OF BRAND TRUTH — swap everything here in one place.
// Wordmark, gradient stops, channel handle, bot username, mascot.
// ============================================================================

import limoMascot from "@/assets/limo-mascot.png";

export const BRAND = {
  wordmark: "Green Lime Feed",
  brandId: import.meta.env.VITE_BRAND_ID || "greenlime",
  mascot: {
    name: "Limo",
    image: limoMascot,
  },
  // Build-time fallbacks. Runtime values come from GET /api/config first.
  botUsername: import.meta.env.VITE_BOT_USERNAME || "",
  channelHandle: import.meta.env.VITE_CHANNEL_HANDLE || "",
  // Juicy green gradient stops (kept here so the look is swappable)
  colors: {
    lime: "#A3FF12",
    limeAlt: "#7CFC00",
    emerald: "#00C853",
    teal: "#00E5A0",
    canvas: "#06120C",
    up: "#21E07A",
    down: "#FF5C5C",
  },
} as const;