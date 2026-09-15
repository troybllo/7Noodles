"use client";

import Link from "next/link";
import { useId, useState, useSyncExternalStore } from "react";
import { z } from "zod";
import { TapedFrame } from "@/components/hand/taped-frame";
import { CONTACT } from "@/content/contact";
import { priceLines, totals } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";
import { formatCad } from "@/lib/money";
import { pickupSlots } from "@/lib/pickup";
import { CartLines } from "./cart-lines";
import { EmptyBowl } from "./empty-bowl";

const checkoutSchema = z.object({
  pickup: z.string({ error: "Choose a pickup time." }).min(1, "Choose a pickup time."),
  name: z.string().trim().min(1, "Tell us whose order it is."),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value.replace(/\D/g, "").length >= 10,
      "Enter a phone number with area code, so we can reach you about the order.",
    ),
  email: z.email("Enter an email address, for your receipt."),
  note: z.string().trim().max(300, "Keep the note under 300 characters.").optional(),
});

type Fields = z.infer<typeof checkoutSchema>;
type Errors = Partial<Record<keyof Fields, string>>;

/** Pickup times, computed in the browser once it has a clock. None on the server. */
const NO_SLOTS: ReturnType<typeof pickupSlots> = [];
const noSlots = () => NO_SLOTS;
const subscribeNever = () => () => {};

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-hand-caps text-base tracking-[0.06em] uppercase"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="font-hand text-chili text-lg leading-snug">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const INPUT =
  "border-ink/40 bg-cream focus-visible:border-ink h-12 rounded-lg border-2 px-4 text-base outline-none aria-[invalid=true]:border-chili";

/**
 * Checkout, as far as it can go without a payment connection: the diner picks
 * a pickup time and leaves their details, which are checked in place, and the
 * order is then read out for them to place by phone. Nothing is sent anywhere,
 * and the page says so rather than pretending an order went through.
 */
export function CheckoutForm() {
  const { lines } = useCart();
  const id = useId();
  const slots = useSyncExternalStore(subscribeNever, () => cachedSlots(), noSlots);
  const [errors, setErrors] = useState<Errors>({});
  const [ready, setReady] = useState(false);

  const priced = priceLines(lines);
  const sum = totals(lines);

  if (priced.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <EmptyBowl className="text-chili w-44" />
        <p className="font-hand text-2xl">Your order is empty.</p>
        <Link
          href="/order"
          className="bg-ink text-cream inline-flex h-12 items-center rounded-full px-8 font-mono"
        >
          Start an order
        </Link>
      </div>
    );
  }

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = checkoutSchema.safeParse(data);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof Fields;
        next[key] ??= issue.message;
      }
      setErrors(next);
      setReady(false);
      // Move focus to the first field with a problem.
      const first = Object.keys(next)[0];
      if (first) document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setErrors({});
    setReady(true);
  };

  const describe = (key: keyof Fields) =>
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

        <button
          type="submit"
          className="bg-ink text-cream h-14 rounded-full font-mono text-lg transition-transform hover:-translate-y-0.5 active:translate-y-px sm:self-start sm:px-12"
        >
          Place order · {formatCad(sum.totalCents)}
        </button>

        <div aria-live="polite">
          {ready ? (
            <TapedFrame tape="top" tilt={-1} className="mt-2 text-sm">
              <div className="flex flex-col gap-3 px-5 py-6">
                <p className="font-poster text-2xl uppercase">Almost there</p>
                <p className="font-hand text-xl leading-snug">
                  Online payment is still being connected, so this order hasn&rsquo;t been
                  sent. Please call it in and we&rsquo;ll have it ready:
                </p>
                <a
                  href={CONTACT.phone.href}
                  className="bg-chili text-cream inline-flex h-12 items-center justify-center self-start rounded-full px-8 font-mono"
                >
                  Call {CONTACT.phone.display}
                </a>
                <p className="font-hand-caps text-sm tracking-[0.06em] uppercase">
                  Your order, to read out
                </p>
                <ul className="font-mono text-sm">
                  {priced.map((line) => (
                    <li key={line.slug}>
                      {line.quantity} × {line.item.nameEn} ({line.item.nameZh})
                    </li>
                  ))}
                </ul>
              </div>
            </TapedFrame>
          ) : null}
        </div>
      </form>

      <aside aria-label="Order summary" className="lg:order-last">
        <TapedFrame tape="top" tilt={0.8} className="text-sm">
          <div className="px-5 py-6">
            <h2 className="font-poster text-2xl uppercase">Your order</h2>
            <CartLines />
          </div>
        </TapedFrame>
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
