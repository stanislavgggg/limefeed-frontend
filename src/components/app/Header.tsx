import { useI18n } from "@/lib/i18n";
import { LimoAvatar } from "./Mascot";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ displayName, tagline }: { displayName: string; tagline: string }) {
  const { t } = useI18n();
  return (
    <header className="relative grain overflow-hidden">
      <div className="bg-aurora animate-aurora pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative flex items-center justify-between gap-2 px-4 pb-4 pt-[max(0.85rem,env(safe-area-inset-top))]">
        <div className="flex min-w-0 items-center gap-2.5">
          <LimoAvatar className="animate-float h-11 w-11 shrink-0" />
          <div className="min-w-0 leading-tight">
            <h1 className="text-gradient truncate font-display text-[20px] font-extrabold leading-tight tracking-tight">
              {displayName}
            </h1>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-up opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-up" />
              </span>
              <p className="truncate text-[11px] font-medium text-muted-foreground">
                {tagline || t("tagline")}
              </p>
            </div>
          </div>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}