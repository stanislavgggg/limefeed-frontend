import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { postEvent } from "@/lib/funnel";

export function SubscribeBar({ label, onOpen }: { label: string; onOpen: () => void }) {
  const { t } = useI18n();
  const viewed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    postEvent("cta_view", { surface: "sticky" });
  }, []);

  const tap = () => {
    postEvent("cta_tap", { surface: "sticky" });
    onOpen();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <button
        onClick={tap}
        className="animate-pulse-dot relative w-full overflow-hidden rounded-2xl bg-gradient-cta py-3.5 font-display text-base font-extrabold text-primary-foreground shadow-card glow-lime active:scale-[0.98]"
        style={{ animationDuration: "2.6s" }}
      >
        <span className="animate-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)]" />
        <span className="relative">{label || t("subscribe")}</span>
      </button>
    </div>
  );
}