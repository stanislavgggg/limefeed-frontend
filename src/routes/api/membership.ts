import { createFileRoute } from "@tanstack/react-router";
import { fallbackMembership, JSON_HEADERS } from "./_data";

export const Route = createFileRoute("/api/membership")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const uid = url.searchParams.get("uid");
        return new Response(
          JSON.stringify({ ...fallbackMembership, uid: uid ? Number(uid) : null }),
          { headers: JSON_HEADERS },
        );
      },
    },
  },
});