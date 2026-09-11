type PhotoSlotProps = {
  /** What this frame will hold, so the shot list can be read off the build. */
  label: string;
  /** Background class. Defaults to the neutral raised ink panel. */
  tone?: string;
  /** Label colour, for grounds the default would disappear against. */
  labelTone?: string;
  className?: string;
};

/**
 * A frame reserved for photography that has not been shot yet.
 *
 * Deliberately looks like a placeholder rather than pretending to be a
 * picture: the layout can be judged now, and nobody mistakes an empty frame
 * for a finished section. Every one of these is a line on the shot list.
 *
 * Replaced by next/image once the shoot lands.
 */
export function PhotoSlot({
  label,
  tone = "bg-ink-soft",
  labelTone = "text-agar-glow",
  className,
}: PhotoSlotProps) {
  return (
    <div
      className={`relative flex h-full w-full items-end ${tone} ${className ?? ""}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 14px, rgba(242,238,229,0.035) 14px 28px)",
      }}
    >
      <p className={`${labelTone} p-4 text-[0.65rem] tracking-[0.18em] uppercase`}>
        {label}
      </p>
    </div>
  );
}
