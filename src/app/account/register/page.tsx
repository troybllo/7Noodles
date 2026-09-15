import type { Metadata } from "next";
import { AccountForm } from "@/components/account/account-form";
import { AccountShell } from "@/components/account/account-shell";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Seven Noodles account for faster pickup orders.",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <AccountShell
      id="account/register"
      title="Join us"
      lede="Save your details and your favourite bowls for faster pickup."
    >
      <AccountForm mode="register" />
    </AccountShell>
  );
}
