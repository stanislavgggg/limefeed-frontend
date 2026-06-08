import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { pickLabel, useI18n } from "@/lib/i18n";
import { initTelegram, hapticSuccess, getUid } from "@/lib/telegram";
import { relativeTime } from "@/lib/time";
import {
  getConfig,
  getNews,
  getLive,
  getUpcoming,
  getMembership,
  openChannel,
  resolveBranding,
  postEvent,
  type Category,
  type NewsItem,
  type BackendMatch,
} from "@/lib/funnel";

import { Header } from "@/components/app/Header";
import { FilterRail, type Tab } from "@/components/app/FilterRail";
import { NewsCard } from "@/components/app/cards/NewsCard";
import { LiveCard } from "@/components/app/cards/LiveCard";
import { LockedCard } from "@/components/app/cards/LockedCard";
import { PinnedMatchCard } from "@/components/app/cards/PinnedMatchCard";
import { MarketsPanel, MarketStrip } from "@/components/app/MarketsPanel";
import { SubscribeBar } from "@/components/app/SubscribeBar";
import { Interstitial } from "@/components/app/Interstitial";
import { ValueStrip } from "@/components/app/ValueStrip";
import { Onboarding } from "@/components/app/Onboarding";
import { ChannelScreen } from "@/components/app/ChannelScreen";
import { BottomNav, type Section } from "@/components/app/BottomNav";
import { InView } from "@/components/app/InView";
import {
  FeedSkeleton,
  EmptyState,
  ErrorState,
  Footer,
  Disclaimer,
  UnlockCelebration,
} from "@/components/app/Misc";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Green Lime Feed — money news + live scores" },
      {
        name: "description",
        content: "Fast money news and live scores. The money behind the headlines. Informational only.",
      },
      { property: "og:title", content: "Green Lime Feed" },
      {
        property: "og:description",
        content: "Fast money news + live scores. Follow the money behind the headlines.",
      },
    ],
  }),
  component: Index,
});

const ONBOARDED_KEY = "mp_onboarded";
const INTERSTITIAL_KEY = "mp_interstitial_seen";

function Index() {
  const { t, lang } = useI18n();
  const queryClient = useQueryClient();

  const [section, setSection] = useState<Section>("feed");
  const [tab, setTab] = useState<Tab>("hot");
  const [category, setCategory] = useState<Category>("all");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [newsLockReached, setNewsLockReached] = useState(false);
  const [liveStickyShown, setLiveStickyShown] = useState(false);
  const openedCount = useRef(0);
  const wasMember = useRef<boolean | null>(null);

  useEffect(() => {
    initTelegram();
    try {
      if (!window.localStorage.getItem(ONBOARDED_KEY)) setShowOnboarding(true);
    } catch {
      /* noop */
    }
  }, []);

  // ---- Queries (single backend module only) ----
  const config = useQuery({ queryKey: ["config"], queryFn: getConfig, staleTime: 5 * 60_000 });
  const membership = useQuery({
    queryKey: ["membership"],
    queryFn: getMembership,
    refetchOnWindowFocus: true,
  });
  const news = useQuery({
    queryKey: ["news", category],
    queryFn: () => getNews(category, 40),
    refetchInterval: 5 * 60_000,
  });
  const newsAll = useQuery({
    queryKey: ["news", "all"],
    queryFn: () => getNews("all", 40),
    refetchInterval: 5 * 60_000,
    enabled: tab === "hot" || tab === "markets",
  });
  const live = useQuery({
    queryKey: ["live"],
    queryFn: getLive,
    refetchInterval: 60_000,
  });
  const upcoming = useQuery({
    queryKey: ["upcoming"],
    queryFn: getUpcoming,
    refetchInterval: 60_000,
  });

  const cfg = config.data;
  const branding = resolveBranding(cfg, lang);
  const ctaLabel = pickLabel(cfg?.cta.label, lang, t("subscribe"));

  // ---- Gating logic (client-side presentation only) ----
  const uid = getUid();
  const gateEnabled = Boolean(cfg?.cta.gate) || Boolean(membership.data?.gate.enabled);
  const isMember = uid != null && membership.data?.gate.is_member === true;
  const gated = gateEnabled && !isMember;

  // ---- Unlock-on-return: re-check membership on focus/visibility ----
  useEffect(() => {
    const recheck = () => {
      if (document.visibilityState === "visible") {
        queryClient.invalidateQueries({ queryKey: ["membership"] });
      }
    };
    window.addEventListener("focus", recheck);
    document.addEventListener("visibilitychange", recheck);
    return () => {
      window.removeEventListener("focus", recheck);
      document.removeEventListener("visibilitychange", recheck);
    };
  }, [queryClient]);

  // Detect gated -> member transition for the celebratory unlock moment.
  useEffect(() => {
    if (membership.data == null) return;
    const memberNow = uid != null && membership.data.gate.is_member === true;
    if (wasMember.current === false && memberNow) {
      hapticSuccess();
      setCelebrate(true);
      const id = setTimeout(() => setCelebrate(false), 2200);
      return () => clearTimeout(id);
    }
    wasMember.current = memberNow;
  }, [membership.data, uid]);

  // ---- Interstitial trigger: 3 opened items OR ~8 cards scrolled, once/session ----
  const maybeInterstitial = () => {
    if (!gated) return;
    try {
      if (window.sessionStorage.getItem(INTERSTITIAL_KEY)) return;
    } catch {
      /* noop */
    }
    window.sessionStorage.setItem(INTERSTITIAL_KEY, "1");
    setShowInterstitial(true);
  };

  useEffect(() => {
    if (!gated) return;
    let fired = false;
    const onScroll = () => {
      if (fired) return;
      if (window.scrollY > window.innerHeight * 1.6) {
        fired = true;
        maybeInterstitial();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gated]);

  const handleOpenChannel = (surface: string) => openChannel(cfg, surface);

  // ---- Live sticky CTA: reveal after dwell time or scroll, once per visit ----
  useEffect(() => {
    if (section !== "live" || !gated) return;
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setLiveStickyShown(true);
    };
    const timer = setTimeout(show, 6000);
    const onScroll = () => {
      if (window.scrollY > 240) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [section, gated]);

  const onItemOpened = () => {
    openedCount.current += 1;
    if (openedCount.current >= 3) maybeInterstitial();
  };

  // ---- Build the Stream ----
  const liveMatches = live.data?.matches ?? [];
  const upcomingMatches = upcoming.data?.matches ?? [];
  const market = (tab === "markets" ? newsAll.data : tab === "hot" ? newsAll.data : news.data)?.market;
  const updatedAt = news.data?.updated_at ?? newsAll.data?.updated_at;

  const finishOnboarding = (subscribe: boolean) => {
    try {
      window.localStorage.setItem(ONBOARDED_KEY, "1");
    } catch {
      /* noop */
    }
    setShowOnboarding(false);
    if (subscribe) handleOpenChannel("onboarding");
  };

  const pinnedMatch = liveMatches[0] ?? upcomingMatches[0];
  const pinnedIsLive = liveMatches.length > 0;

  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] pb-28">
      {section === "channel" ? (
        <ChannelScreen
          displayName={branding.displayName}
          channel={branding.channel}
          onOpen={() => handleOpenChannel("channel_screen")}
        />
      ) : (
        <>
          <Header displayName={branding.displayName} tagline={branding.tagline} />
          {section === "feed" && (
            <FilterRail tab={tab} setTab={setTab} category={category} setCategory={setCategory} />
          )}

          <main className="space-y-3 px-3 pt-3">
            {gated && <ValueStrip />}

            {updatedAt && (
              <p className="px-1 text-[11px] font-medium text-muted-foreground">
                {t("updated")} {relativeTime(updatedAt, lang)}
              </p>
            )}

            {section === "feed" ? (
              <>
                {tab === "hot" && market && <MarketStrip market={market} />}
                <TabContent
                  tab={tab}
                  category={category}
                  gated={gated}
                  news={news}
                  newsAll={newsAll}
                  liveMatches={liveMatches}
                  market={market}
                  onItemOpened={onItemOpened}
                  onUnlock={() => handleOpenChannel("feed_lock")}
                  onLockReached={() => setNewsLockReached(true)}
                />
              </>
            ) : (
              <LiveSection
                live={live}
                liveMatches={liveMatches}
                upcomingMatches={upcomingMatches}
                pinnedMatch={pinnedMatch}
                pinnedIsLive={pinnedIsLive}
                onPinnedCta={() => handleOpenChannel("live_pinned")}
              />
            )}

            <Disclaimer className="pt-4" />
          </main>

          <Footer privacyUrl={branding.privacyUrl} />
        </>
      )}

      {/* Contextual sticky CTAs (sit above the bottom nav) */}
      {gated && section === "feed" && newsLockReached && tab !== "markets" && (
        <SubscribeBar
          label={ctaLabel}
          surface="feed_lock_sticky"
          onOpen={() => handleOpenChannel("feed_lock_sticky")}
        />
      )}
      {gated && section === "live" && liveStickyShown && (
        <SubscribeBar
          label={ctaLabel}
          surface="live_sticky"
          onOpen={() => handleOpenChannel("live_sticky")}
        />
      )}

      <BottomNav
        section={section}
        onSelect={(s) => {
          if (s === "channel") postEvent("cta_tap", { surface: "nav_channel_tab" });
          setSection(s);
          if (typeof window !== "undefined") window.scrollTo({ top: 0 });
        }}
      />

      {section !== "channel" && gated && showInterstitial && (
        <Interstitial
          label={ctaLabel}
          onOpen={() => {
            handleOpenChannel("interstitial");
            setShowInterstitial(false);
          }}
          onClose={() => setShowInterstitial(false)}
        />
      )}

      {celebrate && <UnlockCelebration />}

      {showOnboarding && (
        <Onboarding
          displayName={branding.displayName}
          ctaLabel={ctaLabel}
          onSubscribe={() => finishOnboarding(true)}
          onSkip={() => finishOnboarding(false)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stream content per tab, with client-side gating presentation.
// ---------------------------------------------------------------------------
type Q<T> = { isLoading: boolean; isError: boolean; data: T | undefined; refetch: () => void };

function TabContent({
  tab,
  category,
  gated,
  news,
  newsAll,
  liveMatches,
  market,
  onItemOpened,
  onUnlock,
  onLockReached,
}: {
  tab: Tab;
  category: Category;
  gated: boolean;
  news: Q<import("@/lib/funnel").NewsResponse>;
  newsAll: Q<import("@/lib/funnel").NewsResponse>;
  liveMatches: BackendMatch[];
  market: import("@/lib/funnel").NewsMarket | undefined;
  onItemOpened: () => void;
  onUnlock: () => void;
  onLockReached: () => void;
}) {
  const { t } = useI18n();

  if (tab === "markets") {
    if (newsAll.isLoading && !market) return <FeedSkeleton count={3} />;
    if (!market) return <EmptyState message={t("empty_news")} />;
    return <MarketsPanel market={market} />;
  }

  // hot + news both render a news feed (hot interleaves live first)
  const source = tab === "hot" ? newsAll : news;
  const items = source.data?.items ?? [];

  if (source.isLoading && items.length === 0) return <FeedSkeleton />;
  if (source.isError && items.length === 0)
    return (
      <ErrorState
        title={t("error_title")}
        sub={t("error_sub")}
        retryLabel={t("retry")}
        onRetry={() => source.refetch()}
      />
    );
  if (items.length === 0 && (tab !== "hot" || liveMatches.length === 0))
    return <EmptyState message={t("empty_news")} />;

  return (
    <div className="space-y-3">
      {tab === "hot" &&
        liveMatches.map((m, i) => (
          <LiveCard key={`hot-l-${m.id ?? i}`} match={m} live index={i} />
        ))}
      <GatedNews
        items={items}
        gated={gated}
        onItemOpened={onItemOpened}
        onUnlock={onUnlock}
        onLockReached={onLockReached}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live section: pinned hero match + score cards (no per-card CTA).
// ---------------------------------------------------------------------------
function LiveSection({
  live,
  liveMatches,
  upcomingMatches,
  pinnedMatch,
  pinnedIsLive,
  onPinnedCta,
}: {
  live: Q<{ matches: BackendMatch[] }>;
  liveMatches: BackendMatch[];
  upcomingMatches: BackendMatch[];
  pinnedMatch: BackendMatch | undefined;
  pinnedIsLive: boolean;
  onPinnedCta: () => void;
}) {
  const { t } = useI18n();

  if (live.isLoading && liveMatches.length === 0 && upcomingMatches.length === 0)
    return <FeedSkeleton />;
  if (live.isError && liveMatches.length === 0)
    return (
      <ErrorState
        title={t("error_title")}
        sub={t("error_sub")}
        retryLabel={t("retry")}
        onRetry={() => live.refetch()}
      />
    );
  if (liveMatches.length === 0 && upcomingMatches.length === 0)
    return <EmptyState message={t("empty_live")} />;

  // Exclude the pinned match from the regular lists to avoid duplication.
  const restLive = pinnedIsLive ? liveMatches.slice(1) : liveMatches;
  const restUpcoming = pinnedIsLive ? upcomingMatches : upcomingMatches.slice(1);

  return (
    <div className="space-y-3">
      {pinnedMatch && (
        <PinnedMatchCard match={pinnedMatch} live={pinnedIsLive} onCta={onPinnedCta} />
      )}
      {restLive.map((m, i) => (
        <LiveCard key={`l-${m.id ?? i}`} match={m} live index={i} />
      ))}
      {restUpcoming.map((m, i) => (
        <LiveCard key={`u-${m.id ?? i}`} match={m} live={false} index={i} />
      ))}
    </div>
  );
}

function GatedNews({
  items,
  gated,
  onItemOpened,
  onUnlock,
  onLockReached,
}: {
  items: NewsItem[];
  gated: boolean;
  onItemOpened: () => void;
  onUnlock: () => void;
  onLockReached: () => void;
}) {
  const { t } = useI18n();
  if (!gated) {
    return (
      <>
        {items.map((item, i) => (
          <div key={item.id} onClickCapture={onItemOpened}>
            <NewsCard item={item} index={i} />
          </div>
        ))}
      </>
    );
  }

  // Free preview: first 2 items, then interleaved locked cards.
  const free = items.slice(0, 2);
  const locked = items.slice(2, 8);
  if (locked.length === 0) {
    return (
      <>
        {free.map((item, i) => (
          <div key={item.id} onClickCapture={onItemOpened}>
            <NewsCard item={item} index={i} />
          </div>
        ))}
      </>
    );
  }
  return (
    <>
      {free.map((item, i) => (
        <div key={item.id} onClickCapture={onItemOpened}>
          <NewsCard item={item} index={i} />
        </div>
      ))}
      <InView onInView={onLockReached} rootMargin="0px 0px -120px 0px" />
      <p className="flex items-center justify-center gap-1.5 px-1 text-[11px] font-semibold text-muted-foreground">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-up" />
        {t("lock_social_proof")}
      </p>
      {locked.map((item) => (
        <LockedCard key={item.id} teaser={item.title} onUnlock={onUnlock} />
      ))}
    </>
  );
}
