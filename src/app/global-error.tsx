"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/feedback/error-screen";
import { inter, notoSansSc, oilvare } from "./fonts";
import "./globals.css";

/** Replaces the root layout when it fails, so it brings its own html, body and fonts. */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => console.error(error), [error]);
  return (
    <html
      lang="en-CA"
      className={[inter, oilvare, notoSansSc].map((f) => f.variable).join(" ")}
    >
      <body>
        <title>Something went wrong | 7 Noodles</title>
        <ErrorScreen retry={retry} />
      </body>
    </html>
  );
}
