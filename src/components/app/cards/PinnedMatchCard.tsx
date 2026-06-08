import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { haptic } from "@/lib/telegram";
import { postEvent, type BackendMatch } from "@/lib/funnel";
import { StageBackdrop } from "../StageBackdrop";
import stageInterstitial from "@/assets/stage-interstitial.jpg";

export function PinnedMatchCard({
  match,
  live,
  onCta,
}: {
  match: BackendMatch;
  live: boolean;
  onCta: () => void;
}) {
  const { t } = useI18n();
  const viewed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    postEvent("cta_view", { surface: "live_pinned", game: match.game });
  }, [match.game]);

  const tap = () => {
    haptic("medium");
    postEvent("cta_tap", { surface: "live_pinned", game: match.game });
    onCta();
  };

  return (
    <article
      onClick={tap}
      className="animate-rise ring-gradient relative cursor-pointer overflow-hidden rounded-2xl border border-primary/30 p-4 shadow-card transition-transform active:scale-[0.99]"
    >
      <StageBackdrop
        src={stageInterstitial}
        imgClassName="opacity-40 blur-[2px]"
        overlayClassName="bg-gradient-to-br from-background/70 via-background/55 to-background/85"
      />
      <div className="relative mb-2 flex items-center justify-between text-[11px]">
        <span className="rounded-md bg-primary/20 px-2 py-0.5 font-bold uppercase tracking-wide text-primary">
          {t("live_pinned_label")}
        </span>
        {live && (
          <span className="flex items-center gap-1 rounded-md bg-up/20 px-2 py-0.5 font-bold uppercase tracking-wide text-up">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-up" />
            {t("live")}
          </span>
        )}
      </div>
      <div className="relative flex items-center justify-between gap-2">
        <span className="flex-1 truncate text-right font-display text-base font-extrabold">{match.team1}</span>
        <span className="ring-gradient shrink-0 rounded-xl bg-background/70 px-3 py-1.5 font-display text-lg font-extrabold tabular-nums">
          {match.score1 ?? "–"} <span className="text-muted-foreground">:</span> {match.score2 ?? "–"}
        </span>
        <span className="flex-1 truncate font-display text-base font-extrabold">{match.team2}</span>
      </div>
      <p className="relative mt-3 text-center font-display text-sm font-extrabold text-primary">
        {t("live_pinned_cta")}
      </p>
    </article>
  );
}