import type { ReactNode } from "react";

/**
 * A labelled form field: a handwritten label above the control and, when
 * there is one, the problem with it written beneath in red. The control is
 * passed in, so it keeps its own type, name and autocomplete; give it
 * `aria-describedby="{id}-error"` and `aria-invalid` when `error` is set.
 */
export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-hand-caps text-base tracking-[0.06em] uppercase"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="font-hand text-chili text-lg leading-snug">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const INPUT =
  "border-ink/40 bg-cream focus-visible:border-ink h-12 rounded-lg border-2 px-4 text-base outline-none aria-[invalid=true]:border-chili";
