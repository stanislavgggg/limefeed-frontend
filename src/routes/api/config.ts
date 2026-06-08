import { createFileRoute } from "@tanstack/react-router";
import { fallbackConfig, JSON_HEADERS } from "./_data";

export const Route = createFileRoute("/api/config")({
  server: {
    handlers: {
      GET: async () =>
        new Response(JSON.stringify(fallbackConfig), { headers: JSON_HEADERS }),
    },
  },
});