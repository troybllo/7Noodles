import type { Metadata } from "next";
import { AccountForm } from "@/components/account/account-form";
import { AccountShell } from "@/components/account/account-shell";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Seven Noodles account.",
  robots: { index: false },
};

export default function SignInPage() {
  return (
    <AccountShell
      id="account/sign-in"
      title="Sign in"
      lede="Welcome back. Your usual order is a few taps away."
    >
      <AccountForm mode="sign-in" />
    </AccountShell>
  );
}
