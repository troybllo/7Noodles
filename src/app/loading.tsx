import { Logo } from "@/components/brand/logo";

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
      className="bg-paper text-brand flex min-h-[100dvh] [animation:reveal-late_300ms_ease-out_450ms_forwards] flex-col items-center justify-center gap-5 opacity-0"
    >
      <Logo variant="mark" title={null} className="w-20 motion-safe:animate-pulse" />
      <p className="text-xl">Warming the broth…</p>
    </div>
  );
}
