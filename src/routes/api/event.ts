import { createFileRoute } from "@tanstack/react-router";
import { JSON_HEADERS } from "./_data";

// Fire-and-forget analytics sink. Accepts and acknowledges; no storage.
export const Route = createFileRoute("/api/event")({
  server: {
    handlers: {
      POST: async () =>
        new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS }),
    },
  },
});