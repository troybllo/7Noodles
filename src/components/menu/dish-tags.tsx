import type { MenuItem } from "@/lib/menu";

function Chilli() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="fill-peach-text size-3.5">
      <path d="M11.6 1.2c-.5-.3-1.1-.1-1.4.4-.2.4-.1.9.2 1.2-2.6.3-4.4 2.6-5.3 5.3C4.3 10.6 2.8 12.3.9 13.2c-.4.2-.4.8 0 1 3.9 1.9 9.4.2 11.4-4.6.9-2.1.8-4.2-.2-5.8.6-.3.9-1 .6-1.6-.2-.4-.6-.7-1.1-1z" />
    </svg>
  );
}

const TAG_LABEL: Record<MenuItem["tags"][number], string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
};

/**
 * What is known about a dish beyond its name and price: chilli marks for its
 * spice level, and its dietary tags.
 *
 * Vegan implies vegetarian in the data, so only the stronger tag is shown.
 * Renders nothing at all for a mild dish with no tags.
 */
export function DishTags({ item, className }: { item: MenuItem; className?: string }) {
  const tags = item.tags.includes("vegan")
    ? (["vegan"] as const)
    : item.tags.filter((tag) => tag === "vegetarian");

  if (item.spiceLevel === 0 && tags.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs ${className ?? ""}`}
    >
      {item.spiceLevel > 0 ? (
        <span className="flex items-center gap-1.5">
          <span className="flex" aria-hidden="true">
            {Array.from({ length: item.spiceLevel }, (_, i) => (
              <Chilli key={i} />
            ))}
          </span>
          <span className="text-ink">
            {item.spiceLevel >= 3 ? "Very spicy" : "Spicy"}
          </span>
        </span>
      ) : null}
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-ink border-ink/25 border px-2 py-0.5 tracking-[0.08em] uppercase"
        >
          {TAG_LABEL[tag]}
        </span>
      ))}
    </div>
  );
}
