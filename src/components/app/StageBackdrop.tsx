/**
 * Cinematic, blurred thematic backdrop used across funnel stages.
 * Renders a juicy AI image dimmed under a gradient so foreground text stays legible.
 */
export function StageBackdrop({
  src,
  imgClassName = "opacity-25 blur-[2px]",
  overlayClassName = "bg-gradient-to-b from-background/60 via-background/35 to-background/90",
}: {
  src: string;
  imgClassName?: string;
  overlayClassName?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        src={src}
        alt=""
        width={1024}
        height={1024}
        loading="lazy"
        className={`h-full w-full scale-110 object-cover ${imgClassName}`}
      />
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}