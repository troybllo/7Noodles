/**
 * A carved seal mark (印章).
 *
 * Traditional seals print as a red block with the character reversed out of
 * it, which is why the fill is peach and the glyph is rice rather than the
 * other way round. Sits slightly off-axis because a hand-pressed seal never
 * lands square.
 */
export function Seal({
  character = "恰",
  className,
}: {
  character?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`bg-peach text-rice inline-flex size-11 rotate-[-4deg] items-center justify-center rounded-[3px] text-xl leading-none font-medium select-none ${className ?? ""}`}
      lang="zh"
    >
      {character}
    </span>
  );
}
