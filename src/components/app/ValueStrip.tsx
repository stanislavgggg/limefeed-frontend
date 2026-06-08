import { useI18n } from "@/lib/i18n";
import { LimeMark } from "./Mascot";

export function ValueStrip() {
  const { t } = useI18n();
  return (
    <div className="animate-rise flex items-center gap-2.5 rounded-2xl border border-primary/25 bg-card/70 p-3 shadow-card">
      <LimeMark className="h-7 w-7 shrink-0" />
      <p className="text-sm font-bold text-foreground">{t("value_strip")}</p>
    </div>
  );
}