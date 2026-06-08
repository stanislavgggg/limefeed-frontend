import { createFileRoute } from "@tanstack/react-router";
import { fallbackLive, JSON_HEADERS } from "./_data";

export const Route = createFileRoute("/api/live")({
  server: {
    handlers: {
      GET: async () =>
        new Response(JSON.stringify(fallbackLive), { headers: JSON_HEADERS }),
    },
  },
});