import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { haptic } from "@/lib/telegram";
import { postEvent } from "@/lib/funnel";
import { LimeMark } from "../Mascot";
import { StageBackdrop } from "../StageBackdrop";
import stageLocked from "@/assets/stage-locked.jpg";

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
    <article className="animate-rise ring-gradient relative overflow-hidden rounded-2xl border border-primary/30 glass p-4 shadow-card">
      <StageBackdrop
        src={stageLocked}
        imgClassName="opacity-20 blur-[2px]"
        overlayClassName="bg-gradient-to-b from-background/50 via-background/40 to-background/80"
      />
      <div className="bg-aurora pointer-events-none absolute inset-0 opacity-40" />
      {teaser && (
        <p className="relative select-none text-[15px] font-bold leading-snug text-foreground/80 blur-[7px]">
          {teaser}
        </p>
      )}
      <div className="relative mt-3 flex flex-col items-center gap-2 text-center">
        <div className="animate-float grid h-12 w-12 place-items-center rounded-2xl glass glow-lime">
          <LimeMark className="h-8 w-8" />
        </div>
        <p className="font-display text-sm font-extrabold text-foreground">{t("locked_title")}</p>
        <p className="max-w-[16rem] text-xs text-muted-foreground">{t("locked_sub")}</p>
        <button
          onClick={tap}
          className="card-sheen mt-1 w-full rounded-xl bg-gradient-cta py-3 text-sm font-extrabold text-primary-foreground shadow-card glow-lime transition-transform active:scale-95"
        >
          🔓 {t("subscribe")}
        </button>
      </div>
    </article>
  );
}