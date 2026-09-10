import { STORY } from "@/content/story";
import { StoryMotion } from "./story-motion";

export function Story() {
  return (
    <StoryMotion>
      <section className="bg-ink text-rice px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden">
            <p
              data-story-eyebrow
              lang="zh"
              className="text-lantern text-title font-medium"
            >
              {STORY.eyebrow}
            </p>
          </div>

          <h2 className="text-display mt-6 font-black">
            {STORY.statement.map((line) => (
              <span key={line} className="block overflow-hidden">
                <span data-story-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <p data-story-lede className="text-agar-glow text-lede mt-10 max-w-2xl">
            {STORY.lede}
          </p>

          <ul className="mt-20 grid gap-10 md:grid-cols-3 md:gap-8">
            {STORY.facts.map((fact) => (
              <li
                key={fact.title}
                data-story-fact
                className="border-agar-glow/40 border-t pt-5"
              >
                <p lang="zh" className="text-lantern text-title font-medium">
                  {fact.zh}
                </p>
                <h3 className="mt-2 text-sm font-semibold tracking-[0.16em] uppercase">
                  {fact.title}
                </h3>
                <p className="text-agar-glow mt-3 text-sm leading-relaxed">{fact.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </StoryMotion>
  );
}
