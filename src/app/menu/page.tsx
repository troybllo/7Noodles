import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Sichuan and Chongqing noodles, wontons, Leshan fried skewers, cold appetisers and desserts at 7 Noodles in North York.",
};

export default function MenuPage() {
  return (
    <main id="main" data-nav-theme="light" className="px-6 py-32 md:px-10">
      <h1 className="text-display font-black">Menu</h1>
    </main>
  );
}
