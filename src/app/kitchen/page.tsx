import type { Metadata } from "next";
import { Board } from "./board";

export const metadata: Metadata = {
  title: "Kitchen",
  robots: { index: false, follow: false },
};

/** The kitchen's order board. Behind the staff PIN (src/proxy.ts). */
export default function KitchenPage() {
  return <Board vapidKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ""} />;
}
