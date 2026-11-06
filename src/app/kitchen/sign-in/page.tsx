import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Kitchen",
  robots: { index: false, follow: false },
};

export default function KitchenSignInPage() {
  return (
    <main className="bg-brand text-paper flex min-h-svh flex-col items-center justify-center gap-8 px-6">
      <Logo className="w-64" title="7 Noodles 恰小面" />
      <h1 className="eyebrow">Kitchen orders</h1>
      <SignInForm />
    </main>
  );
}
