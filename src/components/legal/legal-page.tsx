import type { ReactNode } from "react";
import { HandUnderline } from "@/components/hand/hand-underline";
import { StampedText } from "@/components/hand/stamped-text";
import { PageTransition } from "@/components/motion/page-transition";
import { CONTACT } from "@/content/contact";

export type LegalSection = {
  id: string;
  title: string;
  /**
   * What this section will cover. Written as a description of the section,
   * not as the policy itself: the text is the restaurant's to supply.
   */
  covers: string;
};

/**
 * The shared layout for Privacy, Terms and Sustainability: a stamped title and
 * a note on the status of the text, a contents list in the margin, and each
 * section on cream paper.
 *
 * Until the restaurant supplies its own text, each section says what it will
 * cover and that the text is on its way. Nothing is written here that reads as
 * a policy the restaurant has not made.
 */
export function LegalPage({
  id,
  title,
  zh,
  intro,
  sections,
  art,
}: {
  id: string;
  title: string;
  zh: string;
  intro: string;
  sections: LegalSection[];
  /** Illustration beside the title. */
  art?: ReactNode;
}) {
  return (
    <PageTransition id={id}>
      <main id="main" data-nav-theme="light" className="paper-cream text-ink">
        <header className="px-6 pt-32 pb-12 md:px-10">
          <div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <p lang="zh" className="font-brush text-chili text-4xl">
                {zh}
              </p>
              <h1 className="font-poster mt-2 text-[clamp(2.5rem,6vw,5rem)] leading-none uppercase">
                <StampedText tone="text-ink" shadow="text-chili">
                  {title}
                </StampedText>
              </h1>
              <p className="font-hand mt-5 max-w-[40ch] text-xl leading-snug">{intro}</p>
            </div>
            {art}
          </div>
        </header>

        <div className="px-6 pb-24 md:px-10">
          <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-[14rem_1fr]">
            <nav aria-label="On this page" className="md:sticky md:top-28 md:self-start">
              <p className="font-hand-caps text-base tracking-[0.06em] uppercase">
                On this page
              </p>
              <ol className="mt-3 flex flex-col gap-2">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="group relative inline-block">
                      <span className="font-mono text-sm">{index + 1}.</span>{" "}
                      {section.title}
                      <HandUnderline
                        seed={index * 9 + 4}
                        className="text-chili absolute inset-x-0 -bottom-1 h-2"
                      />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="flex flex-col gap-10">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-title`}
                  className="border-ink/20 scroll-mt-28 border-b border-dashed pb-10 last:border-b-0"
                >
                  <h2
                    id={`${section.id}-title`}
                    className="font-nav flex items-baseline gap-3 text-2xl font-bold"
                  >
                    <span className="text-chili font-mono text-base">{index + 1}</span>
                    {section.title}
                  </h2>
                  <p className="mt-3 max-w-[62ch] text-lg leading-relaxed">
                    {section.covers}
                  </p>
                  <p className="font-hand text-ink/75 mt-2 text-lg">
                    The restaurant&rsquo;s own text for this section is on its way.
                  </p>
                </section>
              ))}

              <p className="font-hand text-xl leading-snug">
                Questions in the meantime? Call us on{" "}
                <a
                  href={CONTACT.phone.href}
                  className="decoration-chili font-bold underline decoration-2 underline-offset-4"
                >
                  {CONTACT.phone.display}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
