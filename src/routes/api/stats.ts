import { createFileRoute } from "@tanstack/react-router";
import { fallbackStats, JSON_HEADERS } from "./_data";

export const Route = createFileRoute("/api/stats")({
  server: {
    handlers: {
      GET: async () =>
        new Response(JSON.stringify(fallbackStats), { headers: JSON_HEADERS }),
    },
  },
});