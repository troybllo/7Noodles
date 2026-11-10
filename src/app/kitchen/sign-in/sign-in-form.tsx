"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "../actions";

export function SignInForm() {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, {});
  return (
    <form action={action} className="flex w-full max-w-xs flex-col gap-4">
      <label htmlFor="pin" className="text-sm font-semibold">
        Staff PIN
      </label>
      <input
        id="pin"
        name="pin"
        type="password"
        inputMode="numeric"
        autoComplete="current-password"
        pattern="[0-9]*"
        required
        autoFocus
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "pin-error" : undefined}
        className="bg-paper text-brand h-14 rounded-xl px-4 text-center text-2xl tracking-[0.5em] outline-none"
      />
      {state.error ? (
        <p id="pin-error" role="alert" className="text-sm font-semibold">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-paper text-brand h-14 text-sm font-bold tracking-[0.14em] uppercase disabled:opacity-60"
      >
        {pending ? "Checking…" : "Open the board"}
      </button>
    </form>
  );
}
