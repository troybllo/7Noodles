import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Seven Noodles handles the information you share when you order or get in touch.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      id="privacy"
      title="Privacy Policy"
      zh="隐私"
      intro="How we handle what you share with us when you order, register or get in touch. It will be published here before online ordering opens."
      sections={[
        {
          id: "what-we-collect",
          title: "What we collect",
          covers:
            "The details you give us at checkout or when you register, such as your name, phone number and email, and what you order.",
        },
        {
          id: "how-we-use-it",
          title: "How we use it",
          covers:
            "Preparing your order, contacting you about it, and, only if you ask, keeping your details for next time.",
        },
        {
          id: "payments",
          title: "Payments",
          covers:
            "Who processes card payments once online ordering opens, and what card information we do and do not see.",
        },
        {
          id: "cookies",
          title: "Cookies and this browser",
          covers:
            "What this site keeps in your browser, such as your order in progress, and how to clear it.",
        },
        {
          id: "your-choices",
          title: "Your choices",
          covers:
            "How to see, correct or delete the information we hold about you, under Canadian privacy law.",
        },
      ]}
    />
  );
}
