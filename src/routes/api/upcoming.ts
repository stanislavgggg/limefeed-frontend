import { createFileRoute } from "@tanstack/react-router";
import { fallbackUpcoming, JSON_HEADERS } from "./_data";

export const Route = createFileRoute("/api/upcoming")({
  server: {
    handlers: {
      GET: async () =>
        new Response(JSON.stringify(fallbackUpcoming), { headers: JSON_HEADERS }),
    },
  },
});