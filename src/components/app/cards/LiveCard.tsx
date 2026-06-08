import { useI18n } from "@/lib/i18n";
import { relativeTime } from "@/lib/time";
import { haptic } from "@/lib/telegram";
import { postEvent, type BackendMatch } from "@/lib/funnel";

export function LiveCard({
  match,
  live,
  index = 0,
  onCta,
}: {
  match: BackendMatch;
  live: boolean;
  index?: number;
  onCta: () => void;
}) {
  const { t, lang } = useI18n();

  const tap = () => {
    haptic("medium");
    postEvent("cta_tap", { surface: "live_match", game: match.game });
    onCta();
  };

  return (
    <article
      className={`animate-rise card-sheen rounded-2xl border p-3.5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float ${
        live ? "border-up/40 glass glow-lime" : "border-border glass"
      }`}
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="mb-2 flex items-center justify-between text-[11px]">
        <span className="font-semibold text-muted-foreground">
          {match.game}
          {match.league ? ` · ${match.league}` : ""}
        </span>
        {live ? (
          <span className="flex items-center gap-1 rounded-md bg-up/20 px-2 py-0.5 font-bold uppercase tracking-wide text-up">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-up" />
            {t("live")}
          </span>
        ) : (
          <span className="rounded-md bg-secondary px-1.5 py-0.5 font-semibold text-muted-foreground">
            {match.begin_at ? relativeTime(match.begin_at, lang) : t("upcoming")}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="flex-1 truncate text-right font-display text-sm font-bold">{match.team1}</span>
        <span className="ring-gradient shrink-0 rounded-xl bg-background/70 px-3 py-1.5 font-display text-base font-extrabold text-foreground tabular-nums">
          {match.score1 ?? "–"} <span className="text-muted-foreground">:</span> {match.score2 ?? "–"}
        </span>
        <span className="flex-1 truncate font-display text-sm font-bold">{match.team2}</span>
      </div>
      <button
        onClick={tap}
        className="mt-3 w-full rounded-xl bg-secondary py-2.5 text-xs font-bold text-foreground transition-all hover:bg-primary/15 hover:text-primary active:scale-95"
      >
        {t("join")}
      </button>
    </article>
  );
}