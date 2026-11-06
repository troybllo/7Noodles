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
  return (
    <aside
      aria-label="Allergies"
      className={`bg-paper shadow-lift rotate-[-0.6deg] px-5 py-4 text-sm sm:px-6 ${className ?? ""}`}
    >
      <p className="text-brand leading-relaxed">
        <strong className="font-semibold">
          Allergies? Please tell us before you order.
        </strong>{" "}
        Our &ldquo;nuts&rdquo; are always peanut or sesame. On noodles they can be left
        off. Our skewer seasoning and the popcorn chicken always contain peanut.{" "}
        <span lang="zh" className="font-cjk text-brand-deep">
          如有过敏请提前告知。
        </span>
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
    </aside>
  );
}
