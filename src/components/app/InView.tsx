import { useEffect, useRef } from "react";

/** Fires `onInView` once when the sentinel scrolls into the viewport. */
export function InView({ onInView, rootMargin = "0px" }: { onInView: () => void; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !fired.current) {
            fired.current = true;
            onInView();
            io.disconnect();
          }
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onInView, rootMargin]);

  return <div ref={ref} aria-hidden className="h-px w-full" />;
}