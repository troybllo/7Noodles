type PhotoSlotProps = {
  /** What this frame will hold, so the shot list can be read off the build. */
  label: string;
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
export function PhotoSlot({ label, className }: PhotoSlotProps) {
  return (
    <div
      className={`bg-ink-soft relative flex h-full w-full items-end ${className ?? ""}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 14px, rgba(242,238,229,0.028) 14px 28px)",
      }}
    >
      <p className="text-agar-glow p-4 text-[0.65rem] tracking-[0.18em] uppercase">
        {label}
      </p>
    </div>
  );
}
