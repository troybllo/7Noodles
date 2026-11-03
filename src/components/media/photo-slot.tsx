type PhotoSlotProps = {
  /** What this frame will hold, so the shot list can be read off the build. */
  label: string;
  /** Background class. Defaults to the raised dark panel. */
  tone?: string;
  /** Label colour, for grounds the default would disappear against. */
  labelTone?: string;
  /** For small frames: the label is left off below the `sm` breakpoint. */
  compact?: boolean;
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
  tone = "bg-brand-deep",
  labelTone = "text-paper",
  compact = false,
  className,
}: PhotoSlotProps) {
  return (
    <div
      className={`relative flex h-full w-full items-end ${tone} ${className ?? ""}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 14px, rgba(244,239,230,0.035) 14px 28px)",
      }}
    >
      <p
        className={`${labelTone} ${compact ? "hidden sm:block" : ""} p-4 text-[0.65rem] tracking-[0.18em] uppercase`}
      >
        {label}
      </p>
    </div>
  );
}
