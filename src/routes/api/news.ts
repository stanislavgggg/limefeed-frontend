import { createFileRoute } from "@tanstack/react-router";
import { fallbackNews, JSON_HEADERS } from "./_data";

export const Route = createFileRoute("/api/news")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const category = url.searchParams.get("category") ?? "all";
        const limit = Math.min(Number(url.searchParams.get("limit")) || 40, 100);
        const items =
          category === "all"
            ? fallbackNews.items
            : fallbackNews.items.filter((i) => i.category === category);
        return new Response(
          JSON.stringify({ ...fallbackNews, items: items.slice(0, limit) }),
          { headers: JSON_HEADERS },
        );
      },
    },
  },
});