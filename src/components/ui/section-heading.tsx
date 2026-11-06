import type { ReactNode } from "react";

type SectionHeadingProps = {
  /** The small label above: "Our menu", "01 — Noodles". */
  eyebrow?: string;
  children: ReactNode;
  /** Chinese for the heading, set small and vertical beside it. */
  zh?: string;
  /** `display` for page titles, `title` for sections within a page. */
  size?: "hero" | "display" | "title";
  align?: "start" | "center";
  as?: "h1" | "h2" | "h3";
  /** The ground it sits on, which sets the colour of the Chinese mark. */
  tone?: "light" | "dark";
  className?: string;
};

const SIZE = {
  hero: "text-hero",
  display: "text-display",
  title: "text-title",
} as const;

/** A section's heading: an eyebrow with its Chinese label, then the title in the display face. */
export function SectionHeading({
  eyebrow,
  children,
  zh,
  size = "display",
  align = "start",
  as: Tag = "h2",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={`flex gap-4 sm:gap-6 ${align === "center" ? "justify-center text-center" : ""} ${className ?? ""}`}
    >
      <div className={align === "center" ? "flex flex-col items-center" : ""}>
        {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
        <Tag className={`font-display text-balance ${SIZE[size]}`}>{children}</Tag>
      </div>
      {zh ? (
        <span
          lang="zh"
          aria-hidden="true"
          className={`font-cjk mt-1 shrink-0 text-xl leading-[1.15] font-bold [writing-mode:vertical-rl] ${tone === "dark" ? "text-paper" : "text-brand"}`}
        >
          {zh}
        </span>
      ) : null}
    </div>
  );
}
