import { Panda7 } from "@/components/brand/panda-7";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/content/contact";

/** What a diner sees when something breaks: a retry, and the phone. */
export function ErrorScreen({ retry }: { retry: () => void }) {
  return (
    <main
      id="main"
      data-nav-theme="light"
      className="bg-paper text-brand flex min-h-dvh flex-col items-center justify-center px-6 pt-28 pb-20 text-center"
    >
      <Panda7 pose="spicy" alt="" className="w-40 md:w-48" sizes="12rem" />
      <h1 className="font-display text-title mt-6">Something went wrong</h1>
      <p className="text-brand-deep text-lede mt-4 max-w-[34ch] leading-snug">
        Our end, not yours. Try again, or call us on {CONTACT.phone.display} and
        we&rsquo;ll take your order by phone.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button onClick={retry}>Try again</Button>
        <Button href={CONTACT.phone.href} tone="outline" arrow={false}>
          Call {CONTACT.phone.display}
        </Button>
      </div>
    </main>
  );
}
