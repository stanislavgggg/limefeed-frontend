import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { relativeTime } from "@/lib/time";
import { haptic, openExternal } from "@/lib/telegram";
import { postEvent, type NewsItem } from "@/lib/funnel";

const CAT_KEY: Record<NewsItem["category"], "chip_crypto" | "chip_casino" | "chip_esports"> = {
  crypto: "chip_crypto",
  casino: "chip_casino",
  esports: "chip_esports",
};

export function NewsCard({ item, index = 0 }: { item: NewsItem; index?: number }) {
  const { t, lang } = useI18n();
  const [imgOk, setImgOk] = useState(Boolean(item.image));

  const open = () => {
    haptic("light");
    postEvent("cta_tap", { surface: "feed_item", source: item.source });
    openExternal(item.url);
  };

  return (
    <article
      onClick={open}
      className="animate-rise card-sheen group cursor-pointer rounded-2xl border border-border glass p-3.5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-float active:scale-[0.99]"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="mb-2 flex items-center gap-2 text-[11px]">
        <span className="rounded-md bg-gradient-cta px-1.5 py-0.5 font-bold uppercase tracking-wide text-primary-foreground">
          {t(CAT_KEY[item.category])}
        </span>
        <span className="font-semibold text-muted-foreground">{item.source}</span>
        <span className="text-muted-foreground/70">· {relativeTime(item.published_at, lang)}</span>
      </div>
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[15px] font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {item.title}
          </h3>
          {item.summary && (
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
              {item.summary}
            </p>
          )}
        </div>
        {imgOk && item.image && (
          <div className="ring-gradient h-16 w-16 shrink-0 overflow-hidden rounded-xl">
            <img
              src={item.image}
              alt=""
              loading="lazy"
              onError={() => setImgOk(false)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}
      </div>
    </article>
  );
}