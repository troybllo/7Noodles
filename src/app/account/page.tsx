import type { Metadata } from "next";
import Link from "next/link";
import { AccountShell } from "@/components/account/account-shell";
import { PaperButton } from "@/components/ui/paper-button";

export const metadata: Metadata = {
  title: "Your account",
  description: "Your Seven Noodles account: past orders, favourites and saved details.",
  robots: { index: false },
};

const PREVIEW = [
  { title: "Past orders", note: "Order your usual again in one tap." },
  { title: "Favourites", note: "Keep the bowls you come back for." },
  { title: "Saved details", note: "Your name and phone, filled in at checkout." },
] as const;

/**
 * Signed out, which until accounts arrive is the only state there is: a way
 * to sign in or register, and what an account will hold.
 */
export default function AccountPage() {
  return (
    <AccountShell
      id="account"
      title="Your account"
      lede="Sign in to see your orders and favourites."
    >
      <div className="flex flex-wrap gap-4">
        <PaperButton href="/account/sign-in" tone="ink">
          Sign in
        </PaperButton>
        <Link
          href="/account/register"
          className="border-ink inline-flex h-12 items-center rounded-full border-2 px-8 font-mono transition-transform hover:-translate-y-0.5"
        >
          Create an account
        </Link>
      </div>

      <h2 className="font-hand-caps mt-10 text-lg tracking-[0.06em] uppercase">
        What your account holds
      </h2>
      <ul className="mt-4 flex flex-col gap-4">
        {PREVIEW.map((entry) => (
          <li
            key={entry.title}
            className="border-ink/30 flex flex-col gap-1 rounded-lg border-2 border-dashed px-5 py-4"
          >
            <span className="font-nav text-lg font-bold">{entry.title}</span>
            <span className="font-hand text-ink/80 text-lg leading-snug">
              {entry.note}
            </span>
          </li>
        ))}
      </ul>
    </AccountShell>
  );
}
