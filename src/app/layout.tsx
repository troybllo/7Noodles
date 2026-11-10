import type { Metadata, Viewport } from "next";
import { clientEnv } from "@/env";
import { InkOrigin } from "@/components/motion/ink-origin";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { AddedNote } from "@/components/order/added-note";
import { CartDrawer } from "@/components/order/cart-drawer";
import { MobileActionBar } from "@/components/order/mobile-action-bar";
import { CartProvider } from "@/lib/cart-store";
import { SiteFooter } from "@/components/nav/site-footer";
import { SiteOnly } from "@/components/nav/site-only";
import { TopNav } from "@/components/nav/top-nav";
import { SITE_NAME, SITE_NAME_FULL } from "@/lib/seo";
import { inter, notoSansSc, oilvare } from "./fonts";
import "./globals.css";

const DESCRIPTION =
  "Sichuan and Chongqing noodles, wontons and Leshan fried skewers on Yonge Street in North York, Toronto. Order online for pickup.";

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `Sichuan Noodles in North York | ${SITE_NAME_FULL}`,
    template: `%s | ${SITE_NAME_FULL}`,
  },
  description: DESCRIPTION,
  // Each page sets its own canonical; a canonical here would be inherited by
  // every page that forgot to, pointing them all at the home page.
  openGraph: {
    type: "website",
    siteName: SITE_NAME_FULL,
    locale: "en_CA",
    alternateLocale: ["zh_CN"],
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  // Set GOOGLE_SITE_VERIFICATION to the code Search Console gives you.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#862218",
  // Lets the page run under the notch and home indicator; fixed bars pad
  // themselves with env(safe-area-inset-*).
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-CA"
      suppressHydrationWarning
      className={[inter, oilvare, notoSansSc]
        .map((font) => font.variable)
        .concat("h-full antialiased")
        .join(" ")}
    >
      <head>
        {/* The page-transition mask: loaded early so the first transition never blanks. */}
        <link rel="preload" as="image" href="/brushes/ink-bloom.png" />
        {/* Before first paint: lets CSS hide what the hero is about to animate in (globals.css, html.js). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="bg-paper text-brand flex min-h-full flex-col font-sans">
        <SmoothScroll />
        <InkOrigin />
        <CartProvider>
          <SiteOnly>
            <TopNav />
          </SiteOnly>
          <div className="flex min-h-full flex-col">{children}</div>
          <SiteOnly>
            <SiteFooter />
            <MobileActionBar />
            <CartDrawer />
            <AddedNote />
          </SiteOnly>
        </CartProvider>
      </body>
    </html>
  );
}
