import type { Metadata, Viewport } from "next";
import { clientEnv } from "@/env";
import { InkOrigin } from "@/components/motion/ink-origin";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { TopNav } from "@/components/nav/top-nav";
import {
  archivo,
  courierPrime,
  fredoka,
  hanRounded,
  kalam,
  maShanZheng,
  quicksand,
  titanOne,
  zcoolKuaiLe,
} from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "7 Noodles",
    template: "%s | 7 Noodles",
  },
  description:
    "Sichuan and Chongqing noodles, wontons and Leshan fried skewers on Yonge Street in North York.",
};

export const viewport: Viewport = {
  themeColor: "#12100e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={[
        archivo,
        maShanZheng,
        quicksand,
        hanRounded,
        titanOne,
        kalam,
        courierPrime,
        fredoka,
        zcoolKuaiLe,
      ]
        .map((font) => font.variable)
        .concat("h-full antialiased")
        .join(" ")}
    >
      <body className="bg-rice text-ink flex min-h-full flex-col font-sans">
        <SmoothScroll />
        <InkOrigin />
        <TopNav />
        <div className="flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
