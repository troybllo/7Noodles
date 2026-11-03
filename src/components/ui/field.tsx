import type { ReactNode } from "react";

/**
 * A labelled form field: the label above the control and, when there is one,
 * the problem with it beneath in red. The control is passed in, so it keeps
 * its own type, name and autocomplete; give it `aria-describedby="{id}-error"`
 * and `aria-invalid` when `error` is set.
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
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-brand-deep text-sm font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-brand-deep text-sm leading-snug">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const INPUT =
  "border-brand/25 bg-paper focus-visible:border-brand h-12 rounded-xl border px-4 text-base outline-none transition-colors aria-[invalid=true]:border-brand";
