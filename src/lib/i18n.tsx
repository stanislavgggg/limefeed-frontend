import {
  createContext,
  useCallback as _unused,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getTelegramLang } from "./telegram";

export type Lang = "en" | "ru" | "es";
export const LANGS: Lang[] = ["en", "ru", "es"];
const STORAGE_KEY = "mp_lang";

export function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  // 1. ?lang=
  const param = new URLSearchParams(window.location.search).get("lang");
  if (param && LANGS.includes(param as Lang)) return param as Lang;
  // 2. localStorage
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && LANGS.includes(stored as Lang)) return stored as Lang;
  // 3. Telegram language_code
  const tgLang = getTelegramLang()?.slice(0, 2);
  if (tgLang && LANGS.includes(tgLang as Lang)) return tgLang as Lang;
  // 4. navigator.language
  const nav = navigator.language?.slice(0, 2);
  if (nav && LANGS.includes(nav as Lang)) return nav as Lang;
  // 5. en
  return "en";
}

type Dict = Record<string, string>;

const STRINGS: Record<Lang, Dict> = {
  en: {
    tagline: "The money behind the headlines",
    disclaimer: "18+ · Informational only. Not financial or betting advice.",
    tab_hot: "Hot",
    tab_news: "News",
    tab_live: "Live",
    tab_markets: "Markets",
    chip_all: "All",
    chip_crypto: "Crypto",
    chip_casino: "Casino",
    chip_esports: "Esports",
    live: "LIVE",
    upcoming: "Upcoming",
    updated: "Updated",
    subscribe: "Subscribe to channel",
    join: "Join the channel",
    join_keep_reading: "Join to keep reading",
    maybe_later: "maybe later",
    locked_title: "Subscribe to unlock",
    locked_sub: "Join the channel to read the full money feed.",
    value_strip: "Full money feed · market alerts · first to know",
    youre_in: "You're in!",
    youre_in_sub: "Full feed unlocked. Welcome to the money.",
    empty_news: "No headlines right now. Limo is squeezing the latest.",
    empty_live: "No live matches right now.",
    empty_upcoming: "Nothing scheduled yet.",
    error_title: "Couldn't load the feed",
    error_sub: "Pull to refresh or try again in a moment.",
    retry: "Try again",
    pull_refresh: "Pull to refresh",
    refreshing: "Refreshing…",
    market_fng: "Fear & Greed",
    market_mcap: "Market cap 24h",
    market_dominance: "BTC dominance",
    market_coins: "Top coins",
    onb_title: "Welcome to Green Lime Feed",
    onb_sub: "Fast money news + live scores. Follow the money behind the headlines.",
    onb_feature_1: "Crypto, casino & esports news in one Stream",
    onb_feature_2: "Live & upcoming match scores",
    onb_feature_3: "Markets: Fear & Greed, coins, dominance",
    onb_cta: "Subscribe & continue",
    onb_skip: "Explore first",
    privacy: "Privacy",
    back: "Back",
    now: "now",
  },
  ru: {
    tagline: "Деньги за заголовками",
    disclaimer: "18+ · Только информация. Не финансовый и не игровой совет.",
    tab_hot: "Топ",
    tab_news: "Новости",
    tab_live: "Лайв",
    tab_markets: "Рынки",
    chip_all: "Все",
    chip_crypto: "Крипта",
    chip_casino: "Казино",
    chip_esports: "Киберспорт",
    live: "ЛАЙВ",
    upcoming: "Скоро",
    updated: "Обновлено",
    subscribe: "Подписаться на канал",
    join: "Перейти в канал",
    join_keep_reading: "Подпишись, чтобы читать дальше",
    maybe_later: "позже",
    locked_title: "Подпишись, чтобы открыть",
    locked_sub: "Подпишись на канал и читай всю денежную ленту.",
    value_strip: "Полная лента · рыночные сигналы · узнавай первым",
    youre_in: "Готово!",
    youre_in_sub: "Полная лента открыта. Добро пожаловать.",
    empty_news: "Сейчас нет заголовков. Лимо выжимает свежее.",
    empty_live: "Сейчас нет лайв-матчей.",
    empty_upcoming: "Пока ничего не запланировано.",
    error_title: "Не удалось загрузить ленту",
    error_sub: "Потяни вниз для обновления или повтори позже.",
    retry: "Повторить",
    pull_refresh: "Потяни для обновления",
    refreshing: "Обновляем…",
    market_fng: "Страх и жадность",
    market_mcap: "Капитализация 24ч",
    market_dominance: "Доминация BTC",
    market_coins: "Топ монеты",
    onb_title: "Добро пожаловать в Green Lime Feed",
    onb_sub: "Быстрые денежные новости + лайв-счёт. Следи за деньгами за заголовками.",
    onb_feature_1: "Крипта, казино и киберспорт в одной ленте",
    onb_feature_2: "Счёт лайв и предстоящих матчей",
    onb_feature_3: "Рынки: страх и жадность, монеты, доминация",
    onb_cta: "Подписаться и продолжить",
    onb_skip: "Сначала осмотреться",
    privacy: "Конфиденциальность",
    back: "Назад",
    now: "сейчас",
  },
  es: {
    tagline: "El dinero detrás de los titulares",
    disclaimer: "18+ · Solo informativo. No es consejo financiero ni de apuestas.",
    tab_hot: "Top",
    tab_news: "Noticias",
    tab_live: "En vivo",
    tab_markets: "Mercados",
    chip_all: "Todo",
    chip_crypto: "Cripto",
    chip_casino: "Casino",
    chip_esports: "Esports",
    live: "EN VIVO",
    upcoming: "Próximos",
    updated: "Actualizado",
    subscribe: "Suscríbete al canal",
    join: "Unirse al canal",
    join_keep_reading: "Únete para seguir leyendo",
    maybe_later: "quizás luego",
    locked_title: "Suscríbete para desbloquear",
    locked_sub: "Únete al canal para leer todo el feed del dinero.",
    value_strip: "Feed completo · alertas de mercado · entérate primero",
    youre_in: "¡Listo!",
    youre_in_sub: "Feed completo desbloqueado. Bienvenido al dinero.",
    empty_news: "No hay titulares ahora. Limo está exprimiendo lo último.",
    empty_live: "No hay partidos en vivo ahora.",
    empty_upcoming: "Nada programado todavía.",
    error_title: "No se pudo cargar el feed",
    error_sub: "Desliza para actualizar o inténtalo en un momento.",
    retry: "Reintentar",
    pull_refresh: "Desliza para actualizar",
    refreshing: "Actualizando…",
    market_fng: "Miedo y codicia",
    market_mcap: "Capitalización 24h",
    market_dominance: "Dominancia BTC",
    market_coins: "Top monedas",
    onb_title: "Bienvenido a Green Lime Feed",
    onb_sub: "Noticias del dinero rápidas + marcadores en vivo. Sigue el dinero detrás de los titulares.",
    onb_feature_1: "Cripto, casino y esports en un solo feed",
    onb_feature_2: "Marcadores en vivo y próximos",
    onb_feature_3: "Mercados: miedo y codicia, monedas, dominancia",
    onb_cta: "Suscríbete y continúa",
    onb_skip: "Explorar primero",
    privacy: "Privacidad",
    back: "Atrás",
    now: "ahora",
  },
};

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof (typeof STRINGS)["en"]) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(detectLang());
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* noop */
    }
  };

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t: (key) => STRINGS[lang][key] ?? STRINGS.en[key] ?? String(key),
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/** Pick a localized label from a {en?,ru?,es?} object with graceful fallback. */
export function pickLabel(
  label: { en?: string; ru?: string; es?: string } | string | undefined,
  lang: Lang,
  fallback: string,
): string {
  if (!label) return fallback;
  if (typeof label === "string") return label;
  return label[lang] || label.en || fallback;
}