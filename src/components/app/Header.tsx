import { useI18n } from "@/lib/i18n";
import { LimeMark } from "./Mascot";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ displayName, tagline }: { displayName: string; tagline: string }) {
  const { t } = useI18n();
  return (
    <header className="relative grain overflow-hidden">
      <div className="bg-aurora pointer-events-none absolute inset-0" />
      <div className="relative flex items-center justify-between gap-3 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <LimeMark className="h-8 w-8 shrink-0" />
          <div className="leading-tight">
            <h1 className="text-gradient font-display text-xl font-extrabold tracking-tight">
              {displayName}
            </h1>
            <p className="text-[11px] font-medium text-muted-foreground">
              {tagline || t("tagline")}
            </p>
          </div>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}