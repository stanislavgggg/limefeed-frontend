import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { postEvent } from "@/lib/funnel";
import { LimoAvatar } from "./Mascot";

export function Interstitial({
  label,
  onOpen,
  onClose,
}: {
  label: string;
  onOpen: () => void;
  onClose: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    postEvent("cta_view", { surface: "interstitial" });
  }, []);

  const tap = () => {
    postEvent("cta_tap", { surface: "interstitial" });
    onOpen();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 px-6 backdrop-blur-md">
      <div className="bg-aurora pointer-events-none absolute inset-0" />
      <div className="animate-rise relative w-full max-w-sm text-center">
        <LimoAvatar className="mx-auto h-28 w-28" />
        <h2 className="text-gradient mt-3 font-display text-2xl font-extrabold">
          {t("join_keep_reading")}
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{t("value_strip")}</p>
        <button
          onClick={tap}
          className="mt-6 w-full rounded-2xl bg-gradient-cta py-3.5 font-display text-base font-extrabold text-primary-foreground shadow-card glow-lime active:scale-[0.98]"
        >
          {label || t("subscribe")}
        </button>
        <button onClick={onClose} className="mt-3 text-xs font-medium text-muted-foreground underline">
          {t("maybe_later")}
        </button>
      </div>
    </div>
  );
}