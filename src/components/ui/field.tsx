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
        <p
          id={`${id}-error`}
          className="text-brand flex items-start gap-1.5 text-sm leading-snug font-semibold"
        >
          <span aria-hidden="true">!</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const INPUT =
  "border-brand/25 bg-paper h-12 border px-4 text-base transition-colors focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand aria-[invalid=true]:border-2 aria-[invalid=true]:border-brand";
