// ============================================================================
// Fallback data for the local API routes. Keeps the funnel fully functional
// when no external VITE_API_BASE backend is configured.
// ============================================================================

export const fallbackConfig = {
  brand: "greenlime",
  display_name: { en: "Green Lime Feed", ru: "Green Lime Feed", es: "Green Lime Feed" },
  tagline: {
    en: "The money behind the headlines",
    ru: "Деньги за заголовками",
    es: "El dinero detrás de los titulares",
  },
  character: {
    name: { en: "Limo", ru: "Лимо", es: "Limo" },
    role: { en: "Your feed guide", ru: "Гид по ленте", es: "Tu guía del feed" },
  },
  mode: "channel" as const,
  show_offer: true,
  cta: {
    label: { en: "Join the channel", ru: "Вступить в канал", es: "Unirse al canal" },
    url: "https://t.me/greenlimefeed",
    channel: "@greenlimefeed",
    channel_url: "https://t.me/greenlimefeed",
    gate: false,
    bot_username: "",
    partner_name: "Green Lime",
  },
  privacy_url: "/privacy",
};

const now = Date.now();
const ago = (m: number) => new Date(now - m * 60_000).toISOString();

export const fallbackNews = {
  items: [
    {
      id: 1,
      title: "Bitcoin reclaims $70K as ETF inflows hit a record week",
      url: "https://t.me/greenlimefeed",
      source: "Green Lime",
      category: "crypto" as const,
      published_at: ago(8),
      image: null,
      summary: "Spot ETFs absorbed nine figures in a single session as momentum returned.",
    },
    {
      id: 2,
      title: "Ethereum gas fees drop to multi-month lows after upgrade",
      url: "https://t.me/greenlimefeed",
      source: "Green Lime",
      category: "crypto" as const,
      published_at: ago(24),
      image: null,
      summary: "Lower fees reignite on-chain activity across L2 ecosystems.",
    },
    {
      id: 3,
      title: "Esports finals smash viewership records this weekend",
      url: "https://t.me/greenlimefeed",
      source: "Green Lime",
      category: "esports" as const,
      published_at: ago(41),
      image: null,
      summary: "Prize pools and sponsorships keep climbing as audiences grow.",
    },
    {
      id: 4,
      title: "Casino operators lean into live dealer streams for retention",
      url: "https://t.me/greenlimefeed",
      source: "Green Lime",
      category: "casino" as const,
      published_at: ago(63),
      image: null,
      summary: "Interactive formats are reshaping how platforms keep players engaged.",
    },
    {
      id: 5,
      title: "Solana memecoins drive a fresh wave of retail volume",
      url: "https://t.me/greenlimefeed",
      source: "Green Lime",
      category: "crypto" as const,
      published_at: ago(90),
      image: null,
      summary: "Speculative flows return as fees stay low and throughput stays high.",
    },
    {
      id: 6,
      title: "Major league announces record sponsorship for next season",
      url: "https://t.me/greenlimefeed",
      source: "Green Lime",
      category: "esports" as const,
      published_at: ago(120),
      image: null,
      summary: "Brands double down on competitive gaming as growth accelerates.",
    },
    {
      id: 7,
      title: "Stablecoin supply hits new all-time high",
      url: "https://t.me/greenlimefeed",
      source: "Green Lime",
      category: "crypto" as const,
      published_at: ago(155),
      image: null,
      summary: "On-chain dollars keep expanding as liquidity deepens.",
    },
    {
      id: 8,
      title: "Regulators outline clearer rules for online gaming",
      url: "https://t.me/greenlimefeed",
      source: "Green Lime",
      category: "casino" as const,
      published_at: ago(190),
      image: null,
      summary: "Clarity is expected to bring more institutional players to the space.",
    },
  ],
  market: {
    coins: [
      { symbol: "BTC", name: "Bitcoin", price: 70120, change_24h: 2.4, image: null },
      { symbol: "ETH", name: "Ethereum", price: 3580, change_24h: 1.1, image: null },
      { symbol: "SOL", name: "Solana", price: 172, change_24h: 4.8, image: null },
      { symbol: "BNB", name: "BNB", price: 605, change_24h: -0.6, image: null },
    ],
    fng: { value: 68, label: "Greed" },
    mcap_change_24h: 1.9,
    btc_dominance: 54.2,
  },
  updated_at: new Date(now).toISOString(),
};

export const fallbackLive = {
  matches: [
    {
      id: "l1",
      game: "CS2",
      team1: "Navi",
      team2: "FaZe",
      league: "ESL Pro League",
      score1: 1,
      score2: 0,
      format: "BO3",
    },
    {
      id: "l2",
      game: "Dota 2",
      team1: "Team Spirit",
      team2: "Gaimin Gladiators",
      league: "ESL One",
      score1: 0,
      score2: 1,
      format: "BO3",
    },
  ],
};

export const fallbackUpcoming = {
  matches: [
    {
      id: "u1",
      game: "LoL",
      team1: "T1",
      team2: "Gen.G",
      league: "LCK",
      begin_at: ago(-45),
      format: "BO5",
    },
    {
      id: "u2",
      game: "Valorant",
      team1: "Sentinels",
      team2: "Fnatic",
      league: "VCT",
      begin_at: ago(-120),
      format: "BO3",
    },
  ],
};

export const fallbackMembership = {
  uid: null as number | null,
  member: false,
  gate: { enabled: false, locked: false, is_member: false, channel: "@greenlimefeed" },
  channel: "@greenlimefeed",
  configured: true,
};

export const fallbackStats = {
  correct: 0,
  total: 0,
  rate: null as number | null,
  note: "accumulating" as const,
};

export const JSON_HEADERS = { "Content-Type": "application/json" } as const;