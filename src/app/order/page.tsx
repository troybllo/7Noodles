import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order for pickup",
  description:
    "Order 7 Noodles for pickup on Yonge Street in North York. Freshly pulled noodles, ready when you are.",
};

export default function OrderPage() {
  return (
    <main id="main" data-nav-theme="light" className="px-6 py-32 md:px-10">
      <h1 className="text-display font-black">Order</h1>
    </main>
  );
}
