import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Find 7 Noodles at 4664 Yonge St Unit 13, North York. Opening hours, directions and how to reach us.",
};

export default function ContactPage() {
  return (
    <main id="main" className="px-6 py-32 md:px-10">
      <h1 className="text-display font-black">Contact</h1>
    </main>
  );
}
