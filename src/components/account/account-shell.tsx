import type { ReactNode } from "react";
import { InkArt } from "@/components/brand/ink-art";
import { StampedText } from "@/components/hand/stamped-text";
import { TapedFrame } from "@/components/hand/taped-frame";
import { PageTransition } from "@/components/motion/page-transition";

/**
 * The frame shared by the account pages: the red tiger stalking across cream
 * paper on one side, and the page's content on a taped sheet on the other.
 * On phones the tiger sits small above the sheet.
 */
export function AccountShell({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <PageTransition id={id}>
      <main
        id="main"
        data-nav-theme="light"
        className="paper-cream text-ink relative overflow-hidden px-6 pt-28 pb-24 md:px-10"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h1 className="font-poster text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] uppercase">
              <StampedText tone="text-ink" shadow="text-chili">
                {title}
              </StampedText>
            </h1>
            <p className="font-hand mt-4 max-w-[30ch] text-xl leading-snug">{lede}</p>
            <InkArt
              art="tiger"
              className="mt-6 w-full max-w-[13rem] sm:max-w-[20rem] lg:mt-8 lg:max-w-none"
            />
          </div>

          <TapedFrame tilt={1} className="text-base">
            <div className="px-6 py-8 md:px-10">{children}</div>
          </TapedFrame>
        </div>
      </main>
    </PageTransition>
  );
}
