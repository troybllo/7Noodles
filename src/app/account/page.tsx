import type { Metadata } from "next";
import { AccountShell } from "@/components/account/account-shell";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-wrap gap-3">
        <Button href="/account/sign-in">Sign in</Button>
        <Button href="/account/register" tone="outline">
          Create an account
        </Button>
      </div>

      <h2 className="eyebrow text-brand-deep mt-10">What your account holds</h2>
      <ul className="mt-4 flex flex-col gap-4">
        {PREVIEW.map((entry) => (
          <li
            key={entry.title}
            className="border-brand/30 flex flex-col gap-1 rounded-sm border-2 border-dashed px-5 py-4"
          >
            <span className="font-display text-lg">{entry.title}</span>
            <span className="text-brand-deep text-sm leading-snug">{entry.note}</span>
          </li>
        ))}
      </ul>
    </AccountShell>
  );
}
