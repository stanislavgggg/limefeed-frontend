import { Newspaper, Radio, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { haptic } from "@/lib/telegram";

export type Section = "feed" | "live" | "channel";

const ITEMS: { key: Section; icon: typeof Newspaper; label: "nav_feed" | "nav_live" | "nav_channel" }[] = [
  { key: "feed", icon: Newspaper, label: "nav_feed" },
  { key: "live", icon: Radio, label: "nav_live" },
  { key: "channel", icon: Send, label: "nav_channel" },
];

export function BottomNav({
  section,
  onSelect,
}: {
  section: Section;
  onSelect: (s: Section) => void;
}) {
  const { t } = useI18n();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[480px] border-t border-border glass-strong px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5">
      <div className="flex items-stretch justify-around gap-1">
        {ITEMS.map(({ key, icon: Icon, label }) => {
          const active = section === key;
          return (
            <button
              key={key}
              onClick={() => {
                haptic("light");
                onSelect(key);
              }}
              aria-pressed={active}
              aria-label={t(label)}
              className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-bold transition-all active:scale-95 ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl transition-all ${
                  active ? "bg-primary/15 glow-lime scale-105" : ""
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
              </span>
              {t(label)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}