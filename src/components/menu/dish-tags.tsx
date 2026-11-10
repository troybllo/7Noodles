import type { MenuItem } from "@/lib/menu";

export function Chilli({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`fill-brand ${className}`}>
      <path d="M11.6 1.2c-.5-.3-1.1-.1-1.4.4-.2.4-.1.9.2 1.2-2.6.3-4.4 2.6-5.3 5.3C4.3 10.6 2.8 12.3.9 13.2c-.4.2-.4.8 0 1 3.9 1.9 9.4.2 11.4-4.6.9-2.1.8-4.2-.2-5.8.6-.3.9-1 .6-1.6-.2-.4-.6-.7-1.1-1z" />
    </svg>
  );
}

const SPICE_LABEL = ["", "Mild heat", "Spicy", "Very spicy"] as const;

/** Each badge's look, shared with the legend so the two never disagree. */
export const BADGE = {
  vegan: { label: "Vegan", className: "border-jade/50 text-jade" },
  vegetarian: { label: "Veg", className: "border-jade/50 text-jade" },
  seafood: { label: "Seafood", className: "border-sea/50 text-sea" },
  nuts: { label: "Peanut / sesame", className: "border-bronze/50 text-bronze" },
  mustard: { label: "Mustard", className: "border-bronze/50 text-bronze" },
  adjustable: { label: "Spice adjustable", className: "border-brand/25 text-brand-deep" },
} as const;

export function Badge({
  kind,
  note,
}: {
  kind: keyof typeof BADGE;
  /** Added after the label, and to its accessible name: "can be left off". */
  note?: string | undefined;
}) {
  const { label, className } = BADGE[kind];
  return (
    <span
      className={`bg-paper border px-2.5 py-0.5 text-[0.7rem] leading-5 font-semibold tracking-[0.06em] uppercase ${className}`}
    >
      {label}
      {note ? (
        <span className="font-normal tracking-normal normal-case"> · {note}</span>
      ) : null}
    </span>
  );
}

/**
 * What a diner should know about a dish beyond its name and price: chilli
 * marks for its heat, whether it is vegetarian, vegan or seafood, and the
 * owner's allergen marks — and whether the kitchen can leave them off.
 *
 * Vegan implies vegetarian in the data, so only the stronger tag is shown.
 * Renders nothing for a mild dish with nothing to declare.
 */
export function DishTags({
  item,
  className,
  compact = false,
}: {
  item: MenuItem;
  className?: string;
  /** Shortens the allergen notes for cards and order rows. */
  compact?: boolean;
}) {
  const diet = item.tags.includes("vegan")
    ? (["vegan"] as const)
    : item.tags.filter((tag) => tag === "vegetarian");
  const seafood = item.tags.includes("seafood");
  const { nuts, mustard } = item.allergens;
  const removable = compact ? "optional" : "can be left off";

  if (
    item.spiceLevel === 0 &&
    diet.length === 0 &&
    !seafood &&
    !nuts &&
    !mustard &&
    !item.spiceAdjustable
  ) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-2 ${className ?? ""}`}>
      {item.spiceLevel > 0 ? (
        <span
          className="bg-paper mr-1 flex items-center px-2 py-1"
          role="img"
          aria-label={`${SPICE_LABEL[item.spiceLevel]} (${item.spiceLevel} of 3)`}
          title={SPICE_LABEL[item.spiceLevel]}
        >
          {Array.from({ length: item.spiceLevel }, (_, i) => (
            <Chilli key={i} />
          ))}
        </span>
      ) : null}
      {diet.map((tag) => (
        <Badge key={tag} kind={tag} />
      ))}
      {seafood ? <Badge kind="seafood" /> : null}
      {nuts ? (
        <Badge kind="nuts" note={nuts === "removable" ? removable : undefined} />
      ) : null}
      {mustard ? <Badge kind="mustard" /> : null}
      {item.spiceAdjustable && !compact ? <Badge kind="adjustable" /> : null}
    </div>
  );
}
