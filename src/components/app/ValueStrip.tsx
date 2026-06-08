import { useI18n } from "@/lib/i18n";
import { LimeMark } from "./Mascot";

export function ValueStrip() {
  const { t } = useI18n();
  return (
    <div className="animate-rise ring-gradient card-sheen relative flex items-center gap-2.5 overflow-hidden rounded-2xl border border-primary/25 glass p-3.5 shadow-card">
      <div className="bg-aurora pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl glass glow-lime">
        <LimeMark className="h-6 w-6" />
      </div>
      <p className="relative text-sm font-bold text-foreground">{t("value_strip")}</p>
    </div>
  );
}