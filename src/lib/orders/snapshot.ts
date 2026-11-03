import type { PricedLine } from "@/lib/cart";
import type { Cents } from "@/lib/money";

/**
 * An order line as stored: everything the kitchen and the receipt need,
 * frozen at the moment of ordering, so a later menu change never rewrites an
 * order already placed.
 */
export type OrderLine = {
  slug: string;
  nameEn: string;
  nameZh: string;
  choices: { option: string; choice: string; choiceZh: string }[];
  quantity: number;
  unitPriceCents: Cents;
  lineTotalCents: Cents;
};

export function snapshot(lines: PricedLine[]): OrderLine[] {
  return lines.map((line) => ({
    slug: line.slug,
    nameEn: line.item.nameEn,
    nameZh: line.item.nameZh,
    choices: line.choices.map(({ option, choice }) => ({
      option: option.labelEn,
      choice: choice.labelEn,
      choiceZh: choice.labelZh,
    })),
    quantity: line.quantity,
    unitPriceCents: line.unitPriceCents,
    lineTotalCents: line.lineTotalCents,
  }));
}

/** The line as one short string, for a text message or a push notification. */
export function describeLine(line: OrderLine): string {
  const choices = line.choices.map((c) => c.choice).join(", ");
  return `${line.quantity}× ${line.nameEn}${choices ? ` (${choices})` : ""}`;
}

/** A short, readable order code for the counter: 7N-0423. Uniqueness is the database's job. */
export function orderCode(random: () => number = Math.random): string {
  return `7N-${String(Math.floor(random() * 10_000)).padStart(4, "0")}`;
}
