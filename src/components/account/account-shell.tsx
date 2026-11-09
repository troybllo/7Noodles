import type { ReactNode } from "react";
import { Panda7 } from "@/components/brand/panda-7";
import { TapedFrame } from "@/components/hand/taped-frame";
import { PageTransition } from "@/components/motion/page-transition";

/**
 * The frame shared by the account pages: the title and Panda 7 on one
 * side, and the page's content on a sheet of paper taped down on the other.
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
        className="bg-paper text-brand relative overflow-hidden px-6 pt-32 pb-24 md:px-10"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h1 className="font-display text-display">{title}</h1>
            <p className="text-brand-deep text-lede mt-5 max-w-[34ch] leading-relaxed">
              {lede}
            </p>
            <Panda7
              alt=""
              className="mt-10 hidden w-48 lg:block"
              sizes="12rem"
            />
          </div>

          <TapedFrame tilt={1} className="text-base">
            <div className="bg-paper px-6 py-8 md:px-10">{children}</div>
          </TapedFrame>
        </div>
      </main>
    </PageTransition>
  );
}
