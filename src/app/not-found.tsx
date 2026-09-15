import Link from "next/link";
import { PaintedLantern } from "@/components/brand/painted-lantern";
import { StampedText } from "@/components/hand/stamped-text";
import { PaperButton } from "@/components/ui/paper-button";

/**
 * Any address the site does not have, and any dish or category that does not
 * exist: a swinging lantern, a stamped 404 and the two ways back.
 */
export default function NotFound() {
  return (
    <main
      id="main"
      data-nav-theme="dark"
      className="paper-ink text-cream relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20 text-center"
    >
      <PaintedLantern sizes="10rem" className="w-28 md:w-40" />
      <h1 className="font-poster mt-6 text-[clamp(5rem,16vw,11rem)] leading-none">
        <StampedText>404</StampedText>
      </h1>
      <p className="font-hand mt-4 max-w-[28ch] text-[clamp(1.4rem,3vw,2rem)] leading-snug">
        This bowl&rsquo;s empty. The page you were after isn&rsquo;t here.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <PaperButton href="/menu">See the menu</PaperButton>
        <Link
          href="/"
          className="border-cream inline-flex h-12 items-center rounded-full border-2 px-8 font-mono"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
