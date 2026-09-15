"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { z } from "zod";
import { TapedFrame } from "@/components/hand/taped-frame";
import { Field, INPUT } from "@/components/ui/field";
import { CONTACT } from "@/content/contact";

const email = z.email("Enter the email address you use with us.");

const SCHEMAS = {
  "sign-in": z.object({
    email,
    password: z.string().min(1, "Enter your password."),
  }),
  register: z.object({
    name: z.string().trim().min(1, "Tell us your name."),
    email,
    phone: z
      .string()
      .trim()
      .refine(
        (value) => value.replace(/\D/g, "").length >= 10,
        "Enter a phone number with area code.",
      ),
    password: z.string().min(10, "Use at least ten characters."),
  }),
} as const;

type Mode = keyof typeof SCHEMAS;
type Errors = Record<string, string>;

/** A rough read of how guessable a password is, from its length and variety. */
function strength(password: string): { label: string; score: 0 | 1 | 2 | 3 } {
  if (password.length === 0) return { label: "", score: 0 };
  const variety = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((pattern) =>
    pattern.test(password),
  ).length;
  if (password.length < 10) return { label: "Too short", score: 1 };
  if (password.length >= 14 && variety >= 3) return { label: "Strong", score: 3 };
  return { label: "Good", score: 2 };
}

/**
 * Sign in and registration, checked in place. Accounts arrive with online
 * ordering, so a valid submission explains that instead of pretending to sign
 * anyone in; nothing is sent anywhere.
 */
export function AccountForm({ mode }: { mode: Mode }) {
  const id = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const register = mode === "register";
  const rating = strength(password);

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = SCHEMAS[mode].safeParse(
      Object.fromEntries(new FormData(event.currentTarget)),
    );
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        next[key] ??= issue.message;
      }
      setErrors(next);
      setSubmitted(false);
      const first = Object.keys(next)[0];
      if (first) document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const control = (name: string) => ({
    id: `${id}-${name}`,
    name,
    className: INPUT,
    ...(errors[name]
      ? { "aria-invalid": true, "aria-describedby": `${id}-${name}-error` }
      : {}),
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
      {register ? (
        <Field id={`${id}-name`} label="Name" error={errors.name}>
          <input {...control("name")} autoComplete="name" />
        </Field>
      ) : null}

      <Field id={`${id}-email`} label="Email" error={errors.email}>
        <input {...control("email")} type="email" autoComplete="email" />
      </Field>

      {register ? (
        <Field id={`${id}-phone`} label="Phone" error={errors.phone}>
          <input {...control("phone")} type="tel" inputMode="tel" autoComplete="tel" />
        </Field>
      ) : null}

      <Field id={`${id}-password`} label="Password" error={errors.password}>
        <input
          {...control("password")}
          type="password"
          autoComplete={register ? "new-password" : "current-password"}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Field>
      {register && rating.score > 0 ? (
        <div aria-live="polite" className="-mt-2 flex items-center gap-3">
          <span className="flex gap-1" aria-hidden="true">
            {[1, 2, 3].map((step) => (
              <span
                key={step}
                className={`h-1.5 w-8 rounded-full ${step <= rating.score ? "bg-chili" : "bg-ink/15"}`}
              />
            ))}
          </span>
          <span className="font-hand text-base">Password: {rating.label}</span>
        </div>
      ) : null}

      <button
        type="submit"
        className="bg-ink text-cream mt-2 h-13 rounded-full font-mono text-lg transition-transform hover:-translate-y-0.5 active:translate-y-px"
      >
        {register ? "Create account" : "Sign in"}
      </button>

      <p className="font-hand text-lg">
        {register ? "Already have an account? " : "New here? "}
        <Link
          href={register ? "/account/sign-in" : "/account/register"}
          className="decoration-chili font-bold underline decoration-2 underline-offset-4"
        >
          {register ? "Sign in" : "Create an account"}
        </Link>
      </p>

      <div aria-live="polite">
        {submitted ? (
          <TapedFrame tape="top" tilt={-1} className="text-sm">
            <div className="flex flex-col gap-3 px-5 py-5">
              <p className="font-poster text-xl uppercase">Accounts are on their way</p>
              <p className="font-hand text-lg leading-snug">
                Accounts open together with online ordering, so nothing has been saved
                yet. Until then you can order for pickup without one, or call us on{" "}
                <a href={CONTACT.phone.href} className="font-bold underline">
                  {CONTACT.phone.display}
                </a>
                .
              </p>
              <Link
                href="/order"
                className="bg-chili text-cream inline-flex h-11 items-center self-start rounded-full px-6 font-mono"
              >
                Order for pickup
              </Link>
            </div>
          </TapedFrame>
        ) : null}
      </div>
    </form>
  );
}
