import type { Metadata, Viewport } from "next";
import { clientEnv } from "@/env";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteNav } from "@/components/nav/site-nav";
import { archivo } from "./fonts";
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
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="bg-rice text-ink flex min-h-full flex-col font-sans">
        <SmoothScroll />
        <SiteNav />
        <div className="flex min-h-full flex-col lg:pl-36 xl:pl-44">{children}</div>
      </body>
    </html>
  );
}
