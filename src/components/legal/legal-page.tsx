import type { ReactNode } from "react";
import { PageTransition } from "@/components/motion/page-transition";
import { SectionHeading } from "@/components/ui/section-heading";
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
 * The shared layout for Privacy and Terms: the title and a note on the status
 * of the text, a contents list in the margin, then each section in turn.
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
      <main id="main" data-nav-theme="light" className="bg-paper text-brand">
        <header className="px-6 pt-24 md:pt-32 pb-12 md:px-10">
          <div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <SectionHeading as="h1" zh={zh}>
                {title}
              </SectionHeading>
              <p className="text-brand-deep text-lede mt-6 max-w-[48ch] leading-relaxed">
                {intro}
              </p>
            </div>
            {art}
          </div>
        </header>

        <div className="px-6 pb-24 md:px-10">
          <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-[14rem_1fr]">
            <nav aria-label="On this page" className="md:sticky md:top-28 md:self-start">
              <p className="eyebrow text-brand-deep">On this page</p>
              <ol className="mt-2 flex flex-col">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="decoration-brand-deep inline-block py-2.5 text-sm underline-offset-4 hover:underline"
                    >
                      <span className="text-brand-deep tabular-nums">{index + 1}.</span>{" "}
                      {section.title}
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
                  className="border-brand/10 scroll-mt-28 border-b pb-10 last:border-b-0"
                >
                  <h2
                    id={`${section.id}-title`}
                    className="font-display flex items-baseline gap-3 text-2xl"
                  >
                    <span className="text-brand-deep text-base tabular-nums">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <p className="mt-3 max-w-[62ch] text-lg leading-relaxed">
                    {section.covers}
                  </p>
                  <p className="text-brand-deep mt-2 text-sm italic">
                    The restaurant&rsquo;s own text for this section is on its way.
                  </p>
                </section>
              ))}

              <p className="text-base leading-relaxed">
                Questions in the meantime? Call us on{" "}
                <a
                  href={CONTACT.phone.href}
                  className="decoration-brand-deep font-semibold underline decoration-2 underline-offset-4"
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
