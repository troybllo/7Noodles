import { Panda7 } from "@/components/brand/panda-7";
import { Button } from "@/components/ui/button";

/**
 * Any address the site does not have, and any dish or category that does not
 * exist, with the two ways back.
 */
export default function NotFound() {
  return (
    <main
      id="main"
      data-nav-theme="light"
      className="bg-paper text-brand relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20 text-center"
    >
      <Panda7 pose="spicy" alt="" className="w-44 md:w-56" />
      <h1 className="font-display mt-6 text-[clamp(5rem,16vw,11rem)] leading-none tracking-[-0.05em]">
        404
      </h1>
      <p className="text-brand-deep text-lede mt-4 max-w-[30ch] leading-snug">
        This bowl&rsquo;s empty. The page you were after isn&rsquo;t here.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button href="/menu">See the menu</Button>
        <Button href="/" tone="outline">
          Back home
        </Button>
      </div>
    </main>
  );
}
