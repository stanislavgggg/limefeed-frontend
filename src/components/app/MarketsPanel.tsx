import { useI18n } from "@/lib/i18n";
import { formatPct, formatPrice } from "@/lib/time";
import type { NewsMarket } from "@/lib/funnel";

function Gauge({ value, label }: { value: number; label: string }) {
  const { t } = useI18n();
  const clamped = Math.max(0, Math.min(100, value));
  const angle = -90 + (clamped / 100) * 180;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-44">
        <defs>
          <linearGradient id="fng-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--down)" />
            <stop offset="50%" stopColor="var(--lime)" />
            <stop offset="100%" stopColor="var(--teal)" />
          </linearGradient>
        </defs>
        <path
          d="M10 60 A50 50 0 0 1 110 60"
          fill="none"
          stroke="url(#fng-g)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <g transform={`rotate(${angle} 60 60)`}>
          <line x1="60" y1="60" x2="60" y2="20" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="60" cy="60" r="4" fill="var(--foreground)" />
      </svg>
      <div className="-mt-1 text-center">
        <p className="text-gradient font-display text-3xl font-extrabold leading-none">{clamped}</p>
        <p className="text-xs font-semibold text-muted-foreground">
          {t("market_fng")} · {label}
        </p>
      </div>
    </div>
  );
}

function Stat({ title, value, positive }: { title: string; value: string; positive?: boolean | null }) {
  const color =
    positive == null ? "text-foreground" : positive ? "text-up" : "text-down";
  return (
    <div className="flex-1 rounded-2xl border border-border bg-card/70 p-3 text-center shadow-card">
      <p className="text-[11px] font-semibold text-muted-foreground">{title}</p>
      <p className={`mt-1 font-display text-lg font-extrabold ${color}`}>{value}</p>
    </div>
  );
}

export function MarketsPanel({ market }: { market: NewsMarket | undefined }) {
  const { t } = useI18n();
  if (!market) return null;

  return (
    <div className="space-y-3">
      <div className="relative grain overflow-hidden rounded-3xl border border-primary/25 bg-card/70 p-4 shadow-card">
        <div className="bg-aurora pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative flex flex-col items-center">
          {market.fng ? (
            <Gauge value={market.fng.value} label={market.fng.label} />
          ) : (
            <p className="py-6 text-sm text-muted-foreground">{t("market_fng")}: —</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Stat
          title={t("market_mcap")}
          value={formatPct(market.mcap_change_24h)}
          positive={market.mcap_change_24h == null ? null : market.mcap_change_24h >= 0}
        />
        <Stat
          title={t("market_dominance")}
          value={market.btc_dominance == null ? "—" : `${market.btc_dominance.toFixed(1)}%`}
        />
      </div>

      {market.coins?.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card/70 shadow-card">
          <p className="border-b border-border px-4 py-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t("market_coins")}
          </p>
          <ul>
            {market.coins.map((c) => {
              const up = c.change_24h == null ? null : c.change_24h >= 0;
              return (
                <li
                  key={c.symbol}
                  className="flex items-center gap-3 border-b border-border/60 px-4 py-2.5 last:border-0"
                >
                  {c.image ? (
                    <img src={c.image} alt="" loading="lazy" className="h-6 w-6 rounded-full" />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-bold">
                      {c.symbol.slice(0, 3)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{c.symbol.toUpperCase()}</p>
                    {c.name && <p className="truncate text-[11px] text-muted-foreground">{c.name}</p>}
                  </div>
                  <span className="font-display text-sm font-bold tabular-nums">{formatPrice(c.price)}</span>
                  <span
                    className={`w-16 text-right font-display text-sm font-bold tabular-nums ${
                      up == null ? "text-muted-foreground" : up ? "text-up" : "text-down"
                    }`}
                  >
                    {formatPct(c.change_24h)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Compact horizontal coin ticker for the Hot tab. */
export function MarketStrip({ market }: { market: NewsMarket | undefined }) {
  if (!market?.coins?.length) return null;
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {market.fng && (
        <div className="shrink-0 rounded-xl border border-primary/30 bg-card/70 px-3 py-1.5 text-center">
          <p className="text-[10px] font-semibold text-muted-foreground">F&amp;G</p>
          <p className="text-gradient font-display text-sm font-extrabold">{market.fng.value}</p>
        </div>
      )}
      {market.coins.slice(0, 8).map((c) => {
        const up = c.change_24h == null ? null : c.change_24h >= 0;
        return (
          <div key={c.symbol} className="shrink-0 rounded-xl border border-border bg-card/70 px-3 py-1.5 text-center">
            <p className="text-[10px] font-bold">{c.symbol.toUpperCase()}</p>
            <p
              className={`font-display text-sm font-bold tabular-nums ${
                up == null ? "text-muted-foreground" : up ? "text-up" : "text-down"
              }`}
            >
              {formatPct(c.change_24h)}
            </p>
          </div>
        );
      })}
    </div>
  );
}