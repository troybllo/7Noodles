import Link from "next/link";
import { priceLines, totals } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";
import { formatCad } from "@/lib/money";
import { QuantityStepper } from "./quantity-stepper";

/**
 * The order's lines with steppers, then subtotal, HST and total, as the drawer
 * and checkout both show them. `onNavigate` lets the drawer close when a dish
 * name is followed.
 *
 * Only for use inside client components; it reads the cart.
 */
export function CartLines({
  editable = true,
  onNavigate,
}: {
  editable?: boolean;
  onNavigate?: () => void;
}) {
  const { lines, set } = useCart();
  const priced = priceLines(lines);
  const sum = totals(lines);

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col">
        {priced.map((line) => (
          <li
            key={line.key}
            className="border-brand/15 flex items-start justify-between gap-4 border-b py-4"
          >
            <div className="min-w-0">
              <Link
                href={`/menu/${line.category.slug}/${line.slug}`}
                {...(onNavigate ? { onClick: onNavigate } : {})}
                className="font-display text-brand block text-lg leading-snug hover:underline"
              >
                {line.item.nameEn}
              </Link>
              <span lang="zh" className="font-cjk text-brand-deep block text-sm">
                {line.item.nameZh}
              </span>
              {line.choices.length > 0 ? (
                <span className="text-brand-deep mt-1 block text-sm">
                  {line.choices.map(({ choice }) => choice.labelEn).join(" · ")}
                </span>
              ) : null}
              {editable ? (
                <div className="mt-3">
                  <QuantityStepper
                    size="sm"
                    quantity={line.quantity}
                    onChange={(next) => set(line.key, next)}
                    label={line.item.nameEn}
                  />
                </div>
              ) : (
                <span className="text-brand-deep mt-1 block text-sm tabular-nums">
                  × {line.quantity}
                </span>
              )}
            </div>
            <span className="shrink-0 tabular-nums">
              {formatCad(line.lineTotalCents)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-5 flex flex-col gap-1.5 text-sm tabular-nums">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatCad(sum.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>HST (13%)</dt>
          <dd>{formatCad(sum.taxCents)}</dd>
        </div>
        <div className="border-brand/30 mt-2 flex justify-between border-t pt-3 text-lg font-semibold">
          <dt>Total</dt>
          <dd>{formatCad(sum.totalCents)}</dd>
        </div>
      </dl>
    </div>
  );
}
