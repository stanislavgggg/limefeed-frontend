import { useI18n } from "@/lib/i18n";
import { haptic } from "@/lib/telegram";
import { LimoAvatar } from "./Mascot";
import { Disclaimer } from "./Misc";
import { StageBackdrop } from "./StageBackdrop";
import stageOnboarding from "@/assets/stage-onboarding.jpg";

export function Onboarding({
  displayName,
  ctaLabel,
  onSubscribe,
  onSkip,
}: {
  displayName: string;
  ctaLabel: string;
  onSubscribe: () => void;
  onSkip: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <StageBackdrop src={stageOnboarding} imgClassName="opacity-30 blur-[3px]" />
      <div className="bg-aurora pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex min-h-full max-w-[480px] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
        <LimoAvatar className="h-32 w-32" />
        <h1 className="text-gradient font-display text-2xl font-extrabold">{t("onb_title")}</h1>
        <p className="max-w-xs text-sm text-muted-foreground">{t("onb_sub")}</p>

        <ul className="my-2 w-full space-y-2 text-left">
          {["onb_feature_1", "onb_feature_2", "onb_feature_3"].map((k) => (
            <li
              key={k}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-card/70 px-3 py-2.5 text-sm font-semibold"
            >
              <span className="text-primary">✓</span>
              {t(k as "onb_feature_1")}
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            haptic("medium");
            onSubscribe();
          }}
          className="w-full rounded-2xl bg-gradient-cta py-3.5 font-display text-base font-extrabold text-primary-foreground shadow-card glow-lime active:scale-[0.98]"
        >
          {ctaLabel || t("onb_cta")}
        </button>
        <button onClick={onSkip} className="text-sm font-semibold text-muted-foreground underline">
          {t("onb_skip")}
        </button>
        <Disclaimer className="mt-2" />
        <p className="text-[11px] text-muted-foreground/70">{displayName}</p>
      </div>
    </div>
  );
}