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

/** A labelled frame for a photograph not yet taken: plainly a placeholder, never a fake picture. */
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
