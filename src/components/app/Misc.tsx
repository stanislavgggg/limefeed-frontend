import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { LimoAvatar } from "./Mascot";

export function Disclaimer({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  return (
    <p className={`text-center text-[11px] font-medium text-muted-foreground ${className}`}>
      {t("disclaimer")}
    </p>
  );
}

export function Footer({ privacyUrl }: { privacyUrl?: string }) {
  const { t } = useI18n();
  return (
    <footer className="space-y-2 px-4 py-6 text-center">
      <Disclaimer />
      <div className="flex items-center justify-center gap-3 text-[11px] font-semibold text-muted-foreground">
        {privacyUrl ? (
          <a href={privacyUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {t("privacy")}
          </a>
        ) : (
          <Link to="/privacy" className="underline">
            {t("privacy")}
          </Link>
        )}
      </div>
    </footer>
  );
}

export function CardSkeleton() {
  return (
    <div className="skeleton-shimmer rounded-2xl border border-border glass p-3.5">
      <div className="mb-2.5 h-3 w-24 rounded bg-muted/60" />
      <div className="flex gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted/60" />
          <div className="h-3 w-1/2 rounded bg-muted/50" />
        </div>
        <div className="h-16 w-16 shrink-0 rounded-xl bg-muted/50" />
      </div>
    </div>
  );
}

export function FeedSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <LimoAvatar className="animate-float h-24 w-24 opacity-90" />
      <p className="max-w-[16rem] text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function ErrorState({
  title,
  sub,
  retryLabel,
  onRetry,
}: {
  title: string;
  sub: string;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <LimoAvatar className="animate-float h-24 w-24 opacity-90" />
      <div>
        <p className="font-display text-base font-bold text-foreground">{title}</p>
        <p className="mt-1 max-w-[18rem] text-sm text-muted-foreground">{sub}</p>
      </div>
      <button
        onClick={onRetry}
        className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-foreground active:scale-95"
      >
        {retryLabel}
      </button>
    </div>
  );
}

export function UnlockCelebration() {
  const { t } = useI18n();
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute h-40 w-40 animate-burst rounded-full bg-gradient-cta opacity-60 blur-2xl" />
      <div className="animate-rise relative rounded-3xl border border-primary/40 bg-card/95 px-8 py-6 text-center shadow-card glow-lime">
        <p className="text-gradient font-display text-2xl font-extrabold">{t("youre_in")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("youre_in_sub")}</p>
      </div>
    </div>
  );
}