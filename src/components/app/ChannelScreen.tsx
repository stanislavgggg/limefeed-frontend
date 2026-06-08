import { useEffect } from "react";
import { Pin, Send, Sparkles, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { postEvent } from "@/lib/funnel";
import { LimoAvatar } from "./Mascot";
import { StageBackdrop } from "./StageBackdrop";
import stageChannel from "@/assets/stage-channel.jpg";

const PINNED = [
  { title: "channel_pinned_1_title", sub: "channel_pinned_1_sub" },
  { title: "channel_pinned_2_title", sub: "channel_pinned_2_sub" },
  { title: "channel_pinned_3_title", sub: "channel_pinned_3_sub" },
] as const;

export function ChannelScreen({
  displayName,
  channel,
  onOpen,
}: {
  displayName: string;
  channel: string;
  onOpen: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    postEvent("cta_view", { surface: "channel_screen" });
  }, []);

  const handle = channel ? (channel.startsWith("@") ? channel : `@${channel}`) : "";

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-b-3xl">
        <StageBackdrop src={stageChannel} imgClassName="opacity-50" overlayClassName="bg-gradient-to-b from-background/30 via-background/55 to-background" />
        <div className="relative flex flex-col items-center gap-2 px-6 pb-6 pt-8 text-center">
          <LimoAvatar className="animate-float h-24 w-24" />
          <h1 className="text-gradient font-display text-2xl font-extrabold leading-tight">{displayName}</h1>
          {handle && <p className="text-sm font-semibold text-primary">{handle}</p>}
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">{t("channel_desc")}</p>

          {/* Social proof */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[11px] font-bold text-foreground">
              <Users className="h-3.5 w-3.5 text-primary" /> {t("channel_social_members")}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[11px] font-bold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> {t("channel_social_today")}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-up/40 bg-up/15 px-3 py-1.5 text-[11px] font-bold text-up">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-up" /> {t("channel_social_active")}
            </span>
          </div>
        </div>
      </div>

      {/* Pinned posts */}
      <div className="space-y-3 px-3 pt-4">
        <p className="flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          <Pin className="h-3.5 w-3.5" /> {t("channel_pinned_label")}
        </p>
        {PINNED.map((p) => (
          <article
            key={p.title}
            className="card-sheen rounded-2xl border border-border glass p-3.5 shadow-card"
          >
            <h3 className="font-display text-[15px] font-bold leading-snug text-foreground">
              {t(p.title)}
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{t(p.sub)}</p>
          </article>
        ))}
      </div>

      {/* Primary CTA */}
      <div className="px-3 pt-5">
        <button
          onClick={() => {
            postEvent("cta_tap", { surface: "channel_screen" });
            onOpen();
          }}
          className="card-sheen flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-cta py-4 font-display text-base font-extrabold text-primary-foreground shadow-card glow-lime active:scale-[0.98]"
        >
          <Send className="h-5 w-5" /> {t("channel_open_tg")}
        </button>
      </div>
    </div>
  );
}