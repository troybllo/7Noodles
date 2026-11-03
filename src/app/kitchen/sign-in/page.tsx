import type { Metadata } from "next";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Kitchen",
  robots: { index: false, follow: false },
};

export default function KitchenSignInPage() {
  return (
    <main className="bg-brand text-paper flex min-h-svh flex-col items-center justify-center gap-8 px-6">
      <p className="text-4xl font-extrabold tracking-[-0.02em] uppercase">
        Seven Noodles{" "}
        <span lang="zh" className="font-cjk font-black">
          恰小面
        </span>
      </p>
      <p className="eyebrow">Kitchen orders</p>
      <SignInForm />
    </main>
  );
}
