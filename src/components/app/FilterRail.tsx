import { useI18n } from "@/lib/i18n";
import { haptic } from "@/lib/telegram";
import type { Category } from "@/lib/funnel";

export type Tab = "hot" | "news" | "live" | "markets";
export const TABS: Tab[] = ["hot", "news", "live", "markets"];

const TAB_KEY: Record<Tab, "tab_hot" | "tab_news" | "tab_live" | "tab_markets"> = {
  hot: "tab_hot",
  news: "tab_news",
  live: "tab_live",
  markets: "tab_markets",
};
const TAB_ICON: Record<Tab, string> = { hot: "🔥", news: "📰", live: "🟢", markets: "📈" };

const SUBCHIPS: { key: Category; label: "chip_all" | "chip_crypto" | "chip_casino" | "chip_esports" }[] = [
  { key: "all", label: "chip_all" },
  { key: "crypto", label: "chip_crypto" },
  { key: "casino", label: "chip_casino" },
  { key: "esports", label: "chip_esports" },
];

export function FilterRail({
  tab,
  setTab,
  category,
  setCategory,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  category: Category;
  setCategory: (c: Category) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="flex gap-1.5 px-3 pb-2 pt-2">
        {TABS.map((tb) => {
          const active = tab === tb;
          return (
            <button
              key={tb}
              onClick={() => {
                haptic("light");
                setTab(tb);
              }}
              aria-pressed={active}
              className={`flex-1 rounded-xl px-2 py-2 text-sm font-bold transition-all active:scale-95 ${
                active
                  ? "bg-gradient-cta text-primary-foreground shadow-card glow-lime"
                  : "bg-card/60 text-muted-foreground"
              }`}
            >
              <span className="mr-1">{TAB_ICON[tb]}</span>
              {t(TAB_KEY[tb])}
            </button>
          );
        })}
      </div>
      {tab === "news" && (
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-3 pb-2">
          {SUBCHIPS.map((c) => {
            const active = category === c.key;
            return (
              <button
                key={c.key}
                onClick={() => {
                  haptic("light");
                  setCategory(c.key);
                }}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card/40 text-muted-foreground"
                }`}
              >
                {t(c.label)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}