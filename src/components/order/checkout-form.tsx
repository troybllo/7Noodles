"use client";

import Link from "next/link";
import {
  startTransition,
  useActionState,
  useId,
  useState,
  useSyncExternalStore,
} from "react";
import { placeOrder } from "@/app/checkout/actions";
import { CONTACT } from "@/content/contact";
import {
  checkoutSchema,
  fieldErrors,
  type CheckoutErrors,
  type CheckoutFields,
  type CheckoutState,
} from "@/lib/orders/checkout-schema";
import { priceLines, totals } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";
import { formatCad } from "@/lib/money";
import { pickupSlots } from "@/lib/pickup";
import { Field, INPUT } from "@/components/ui/field";
import { TapedFrame } from "@/components/hand/taped-frame";
import { CartLines } from "./cart-lines";
import { Panda7 } from "@/components/brand/panda-7";
import { AllergyNotice } from "@/components/menu/allergy-notice";

/** Pickup times, computed in the browser once it has a clock. None on the server. */
const NO_SLOTS: ReturnType<typeof pickupSlots> = [];
const noSlots = () => NO_SLOTS;
const subscribeNever = () => () => {};

/**
 * Checkout: the diner picks a pickup time and leaves their details, checked
 * here for quick feedback, then the order goes to the server, which prices it
 * again from the menu and sends them on to Stripe to pay (placeOrder). The
 * kitchen sees the order only once the payment is confirmed.
 *
 * If online ordering is paused, the order is read out to be placed by phone
 * instead.
 */
export function CheckoutForm() {
  const { lines } = useCart();
  const id = useId();
  const slots = useSyncExternalStore(subscribeNever, () => cachedSlots(), noSlots);
  const [clientErrors, setClientErrors] = useState<CheckoutErrors>({});
  const [state, action, pending] = useActionState<CheckoutState, FormData>(
    placeOrder,
    {},
  );
  // The server's verdict wins over the browser's, once there is one.
  const errors = { ...clientErrors, ...state.errors };

  const priced = priceLines(lines);
  const sum = totals(lines);

  if (priced.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <Panda7 pose="eating" alt="" className="w-40" />
        <p className="font-display text-2xl">Your order is empty.</p>
        <Link
          href="/order"
          className="bg-brand text-paper inline-flex h-12 items-center rounded-full px-8 text-sm font-semibold"
        >
          Start an order
        </Link>
      </div>
    );
  }

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form);
    const result = checkoutSchema.safeParse({ ...data, note: data.note || undefined });
    if (!result.success) {
      const next = fieldErrors(result.error);
      setClientErrors(next);
      // Move focus to the first field with a problem.
      const first = Object.keys(next)[0];
      if (first) document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setClientErrors({});
    // Only what the dishes are and how many: the server prices them itself.
    form.set(
      "lines",
      JSON.stringify(
        lines.map(({ slug, selection, quantity }) => ({ slug, selection, quantity })),
      ),
    );
    startTransition(() => action(form));
  };

  const describe = (key: keyof CheckoutFields) =>
    errors[key]
      ? { "aria-invalid": true as const, "aria-describedby": `${id}-${key}-error` }
      : {};

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_24rem]">
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        <Field id={`${id}-pickup`} label="Pickup time" error={errors.pickup}>
          <select
            id={`${id}-pickup`}
            name="pickup"
            defaultValue=""
            className={INPUT}
            {...describe("pickup")}
          >
            <option value="" disabled>
              {slots.length === 0 ? "Loading times…" : "Choose a time"}
            </option>
            {slots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id={`${id}-name`} label="Name" error={errors.name}>
            <input
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              className={INPUT}
              {...describe("name")}
            />
          </Field>
          <Field id={`${id}-phone`} label="Phone" error={errors.phone}>
            <input
              id={`${id}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              className={INPUT}
              {...describe("phone")}
            />
          </Field>
        </div>

        <Field id={`${id}-email`} label="Email" error={errors.email}>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            className={INPUT}
            {...describe("email")}
          />
        </Field>

        <Field
          id={`${id}-note`}
          label="Note for the kitchen (optional)"
          error={errors.note}
        >
          <textarea
            id={`${id}-note`}
            name="note"
            rows={3}
            maxLength={300}
            className={`${INPUT} h-auto py-3`}
            {...describe("note")}
          />
        </Field>

        <AllergyNotice legend={false} />

        <p className="text-brand-deep text-sm">{CONTACT.orderPolicy}</p>

        <button
          type="submit"
          disabled={pending}
          className="bg-brand-deep text-paper h-14 rounded-full text-base font-semibold tabular-nums transition-colors hover:bg-[#5e150c] disabled:opacity-60 sm:self-start sm:px-12"
        >
          {pending ? "Opening secure payment…" : `Pay ${formatCad(sum.totalCents)}`}
        </button>
        <p className="text-brand-deep -mt-3 text-xs">
          Card, Apple Pay or Google Pay, on Stripe&rsquo;s secure page. Your order goes to
          the kitchen as soon as it&rsquo;s paid.
        </p>

        <div aria-live="polite">
          {state.message ? (
            <p role="alert" className="text-brand-deep font-semibold">
              {state.message}
            </p>
          ) : null}
          {state.paused ? (
            <TapedFrame tape="top" tilt={-1} className="mt-4 text-sm">
              <div className="bg-paper flex flex-col gap-3 px-6 py-6">
                <p className="font-display text-2xl">We&rsquo;re busy right now</p>
                <p className="leading-relaxed">
                  Online orders are paused while the kitchen catches up, so this order
                  hasn&rsquo;t been sent. Please call it in and we&rsquo;ll have it ready:
                </p>
                <a
                  href={CONTACT.phone.href}
                  className="bg-brand-deep text-paper inline-flex h-12 items-center justify-center self-start rounded-full px-8 font-semibold"
                >
                  Call {CONTACT.phone.display}
                </a>
                <p className="eyebrow text-brand-deep">Your order, to read out</p>
                <ul className="text-sm">
                  {priced.map((line) => (
                    <li key={line.key}>
                      {line.quantity} × {line.item.nameEn} ({line.item.nameZh})
                      {line.choices.length > 0
                        ? ` — ${line.choices.map(({ choice }) => choice.labelEn).join(", ")}`
                        : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </TapedFrame>
          ) : null}
        </div>
      </form>

      <aside aria-label="Order summary" className="lg:order-last">
        {/* The order on a slip of paper taped to the page, slightly askew. */}
        <div className="lg:sticky lg:top-28">
          <TapedFrame tape="top" tilt={1.5} className="text-sm">
            <div className="bg-paper px-6 py-7">
              <h2 className="font-display text-3xl">Your order</h2>
              <CartLines />
            </div>
          </TapedFrame>
        </div>
      </aside>
    </div>
  );
}

let slotCache: { at: number; slots: ReturnType<typeof pickupSlots> } | null = null;

/**
 * Slots are recomputed at most once a minute. useSyncExternalStore needs the
 * same array back between renders, or it re-renders forever.
 */
function cachedSlots() {
  const minute = Math.floor(Date.now() / 60_000);
  if (!slotCache || slotCache.at !== minute) {
    slotCache = { at: minute, slots: pickupSlots(new Date(), CONTACT.hours) };
  }
  return slotCache.slots;
}
