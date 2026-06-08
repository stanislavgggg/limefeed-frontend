import { LANGS, useI18n, type Lang } from "@/lib/i18n";
import { haptic } from "@/lib/telegram";

const LABEL: Record<Lang, string> = { en: "EN", ru: "RU", es: "ES" };

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border bg-card/60 p-0.5 backdrop-blur">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => {
            haptic("light");
            setLang(l);
          }}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
            lang === l
              ? "bg-gradient-cta text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {LABEL[l]}
        </button>
      ))}
    </div>
  );
}