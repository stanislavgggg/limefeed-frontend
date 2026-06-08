import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { haptic } from "@/lib/telegram";
import { postEvent } from "@/lib/funnel";
import { LimeMark } from "../Mascot";

export function LockedCard({ teaser, onUnlock }: { teaser?: string; onUnlock: () => void }) {
  const { t } = useI18n();
  const viewed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    postEvent("cta_view", { surface: "feed_lock" });
  }, []);

  const tap = () => {
    haptic("medium");
    postEvent("cta_tap", { surface: "feed_lock" });
    onUnlock();
  };

  return (
    <article className="animate-rise relative overflow-hidden rounded-2xl border border-primary/30 bg-card/70 p-4 shadow-card">
      {teaser && (
        <p className="select-none text-[15px] font-bold leading-snug text-foreground blur-[6px]">
          {teaser}
        </p>
      )}
      <div className="relative mt-3 flex flex-col items-center gap-2 text-center">
        <LimeMark className="h-9 w-9" />
        <p className="font-display text-sm font-extrabold text-foreground">{t("locked_title")}</p>
        <p className="max-w-[16rem] text-xs text-muted-foreground">{t("locked_sub")}</p>
        <button
          onClick={tap}
          className="mt-1 w-full rounded-xl bg-gradient-cta py-2.5 text-sm font-extrabold text-primary-foreground shadow-card glow-lime active:scale-95"
        >
          🔓 {t("subscribe")}
        </button>
      </div>
    </article>
  );
}