import { Badge, Chilli } from "./dish-tags";

/**
 * The owner asked for this at the top of the menu: tell us about allergies
 * before ordering. Shown on the menu, the order page and at checkout, with the
 * key to the marks used on every dish.
 */
export function AllergyNotice({
  legend = true,
  className,
}: {
  legend?: boolean;
  className?: string;
}) {
  const detail = (
    <>
      <p className="text-brand leading-relaxed">
        Our &ldquo;nuts&rdquo; are always peanut or sesame. On noodles they can be left
        off. Our skewer seasoning and the popcorn chicken always contain peanut.
      </p>
      {legend ? (
        <div className="text-brand-deep mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span className="flex items-center gap-1">
            <Chilli className="size-3.5" /> Mild
          </span>
          <span className="flex items-center gap-1">
            <Chilli className="size-3.5" />
            <Chilli className="size-3.5" /> Spicy
          </span>
          <span className="flex items-center gap-1">
            <Chilli className="size-3.5" />
            <Chilli className="size-3.5" />
            <Chilli className="size-3.5" /> Very spicy
          </span>
          <Badge kind="vegetarian" />
          <Badge kind="vegan" />
          <Badge kind="seafood" />
          <Badge kind="nuts" />
        </div>
      ) : null}
    </>
  );

  // The ask itself is always in view. On phones the detail and the key to
  // the marks fold away under it, so the dishes start on the first screen.
  return (
    <aside
      aria-label="Allergies"
      className={`bg-paper shadow-lift rotate-[-0.6deg] px-5 py-4 text-sm sm:px-6 ${className ?? ""}`}
    >
      <p className="text-brand leading-relaxed">
        <strong className="font-semibold">
          Allergies? Please tell us before you order.
        </strong>{" "}
        <span lang="zh" className="font-cjk text-brand-deep">
          如有过敏请提前告知。
        </span>
      </p>
      <details className="group mt-1 md:hidden">
        <summary className="text-brand-deep flex min-h-11 cursor-pointer list-none items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase [&::-webkit-details-marker]:hidden">
          {legend ? "Nuts, and the key to the marks" : "About nuts"}
          <span
            aria-hidden="true"
            className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-open:rotate-90"
          >
            →
          </span>
        </summary>
        <div className="pb-1">{detail}</div>
      </details>
      <div className="mt-2 hidden md:block">{detail}</div>
    </aside>
  );
}
