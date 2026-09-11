import { PhotoSlot } from "@/components/media/photo-slot";
import { ABOUT } from "@/content/about";
import { ContactPanels } from "./contact-panels";

/**
 * Three bands, following the brand-book spread the client referenced: dark
 * imagery with the mark centred over it, a light band of set text, then the
 * panel grid.
 */
export function AboutContact() {
  return (
    <section id="about" data-nav-theme="dark" className="relative z-10 w-full">
      {/* Band one — the mark over the room. */}
      <div className="bg-ink-deep relative isolate flex min-h-[80svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-2">
          <PhotoSlot label="Room from the doorway, low light" tone="bg-ink-soft" />
          <PhotoSlot label="Pass and kitchen, steam, night" tone="bg-ink" />
        </div>
        <div className="from-ink/70 absolute inset-0 z-0 bg-gradient-to-b to-transparent" />

        <p
          aria-hidden="true"
          lang="zh"
          className="text-agar-glow/50 absolute top-24 left-4 z-10 hidden text-xs tracking-[0.4em] xl:block"
          style={{ writingMode: "vertical-rl" }}
        >
          {ABOUT.vertical}
        </p>

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <p
            lang="zh"
            className="font-brush text-rice text-[clamp(3.5rem,12vw,10rem)] leading-none"
          >
            {ABOUT.nameZh}
          </p>
          <p className="text-rice text-xs font-semibold tracking-[0.55em] uppercase">
            {ABOUT.nameEn}
          </p>
        </div>
      </div>

      {/* Band two — the written detail. */}
      <div className="bg-rice text-ink px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1700px] gap-10 md:grid-cols-4">
          <h2 className="text-title font-black">{ABOUT.heading}</h2>

          {ABOUT.columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h3 className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase">
                {column.title}
              </h3>
              <p className="text-agar-text text-sm leading-relaxed whitespace-pre-line">
                {column.body}
              </p>
            </div>
          ))}
        </div>

        {/*
          Markup only. The fields are disabled and there is no submit control,
          because the form cannot send yet — a form that looks live and quietly
          drops messages is worse than no form. Wiring lands with Resend in the
          backend phase.
        */}
        <div className="border-paper mx-auto mt-16 max-w-[1700px] border-t pt-10">
          <div className="grid gap-8 md:grid-cols-4">
            <h3 className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase">
              {ABOUT.form.title}
            </h3>
            <div className="flex flex-col gap-4 md:col-span-2">
              {ABOUT.form.fields.map((field) => (
                <label key={field} className="flex flex-col gap-1">
                  <span className="text-agar-text text-[0.6rem] tracking-[0.2em] uppercase">
                    {field}
                  </span>
                  <span
                    aria-hidden="true"
                    className="border-paper h-9 border-b"
                    data-placeholder-field
                  />
                </label>
              ))}
            </div>
            <p className="text-agar-text max-w-[26ch] text-xs leading-relaxed">
              {ABOUT.form.note}
            </p>
          </div>
        </div>
      </div>

      {/* Band three — the practical detail, on the showcase mechanic. */}
      <ContactPanels />
    </section>
  );
}
