import { PaintedLantern } from "@/components/brand/painted-lantern";

/**
 * Shown while a page is still on its way. Every page here is prerendered, so
 * this is rare; it appears only after a short pause, so a quick navigation
 * never flashes it.
 */
export default function Loading() {
  return (
    <div
      role="status"
      data-nav-theme="light"
      className="paper-cream text-ink flex min-h-[100dvh] [animation:reveal-late_300ms_ease-out_450ms_forwards] flex-col items-center justify-center gap-4 opacity-0"
    >
      <PaintedLantern sizes="6rem" className="w-20" />
      <p className="font-hand text-2xl">Warming the broth…</p>
    </div>
  );
}
