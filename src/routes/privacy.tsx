import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Disclaimer } from "@/components/app/Misc";
import { LimeMark } from "@/components/app/Mascot";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Green Lime Feed" },
      {
        name: "description",
        content: "How Green Lime Feed handles your data. Informational news only.",
      },
      { property: "og:title", content: "Privacy — Green Lime Feed" },
      {
        property: "og:description",
        content: "How Green Lime Feed handles your data. Informational news only.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useI18n();
  return (
    <main className="mx-auto min-h-screen max-w-[480px] px-5 py-8">
      <div className="mb-6 flex items-center gap-2">
        <LimeMark className="h-7 w-7" />
        <h1 className="text-gradient font-display text-xl font-extrabold">{BRAND.wordmark}</h1>
      </div>

      <article className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-lg font-bold text-foreground">{t("privacy")}</h2>
        <p>
          Green Lime Feed is an informational news and live-scores Mini App. We do not provide
          financial or betting advice and never ask you to buy, sell, bet or deposit.
        </p>
        <p>
          We use anonymous, aggregate analytics (such as how often the subscribe button is viewed
          and tapped) to improve the product. When opened inside Telegram, your Telegram user id may
          be used solely to check channel membership and tailor your feed access. We do not sell your
          data.
        </p>
        <p>
          Language preference is stored locally on your device. News links open their original
          sources, which have their own privacy policies.
        </p>
        <Disclaimer className="pt-2" />
      </article>

      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-foreground"
      >
        ← {t("back")}
      </Link>
    </main>
  );
}