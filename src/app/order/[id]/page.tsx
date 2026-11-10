import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatCad } from "@/lib/money";
import { getOrder } from "@/lib/orders/repo";
import { formatDayAndClock } from "@/lib/time";
import { CONTACT } from "@/content/contact";
import { OrderStatusTracker } from "./status-tracker";

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
};

/** Where Stripe sends the customer after paying, and the link to keep. */
export default async function OrderPage({ params }: PageProps<"/order/[id]">) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <main
      id="main"
      data-nav-theme="light"
      className="bg-paper text-brand px-6 pt-24 md:pt-32 pb-24 md:px-10"
    >
      <div className="mx-auto grid max-w-[1000px] gap-12 lg:grid-cols-[1fr_22rem]">
        <div>
          <p className="eyebrow">Order {order.code}</p>
          <h1 className="font-display text-display mt-4">
            Thank you, {order.customerName.split(" ")[0]}
          </h1>
          <p className="mt-6 text-lg">
            Pickup <strong>{formatDayAndClock(order.pickupAt)}</strong> at{" "}
            {CONTACT.address.street}, {CONTACT.address.locality}. Give your order code at
            the counter.
          </p>
          <OrderStatusTracker id={order.id} initial={order.status} />
          <p className="text-brand-deep mt-10 text-sm">
            Something wrong? Call us on{" "}
            <a href={CONTACT.phone.href} className="underline">
              {CONTACT.phone.display}
            </a>{" "}
            and give your order code. A receipt from Stripe is in your email.
          </p>
        </div>

        <aside aria-label="Your order" className="border-brand/20 h-fit border p-6">
          <h2 className="font-display text-2xl">Your order</h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            {order.lines.map((line, i) => (
              <li key={i} className="flex justify-between gap-4">
                <span>
                  {line.quantity}× {line.nameEn}
                  {line.choices.length > 0 ? (
                    <span className="text-brand-deep block">
                      {line.choices.map((c) => c.choice).join(" · ")}
                    </span>
                  ) : null}
                </span>
                <span className="tabular-nums">{formatCad(line.lineTotalCents)}</span>
              </li>
            ))}
          </ul>
          <dl className="border-brand/20 mt-4 flex flex-col gap-1 border-t pt-4 text-sm tabular-nums">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatCad(order.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>HST (13%)</dt>
              <dd>{formatCad(order.taxCents)}</dd>
            </div>
            <div className="mt-1 flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatCad(order.totalCents)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
