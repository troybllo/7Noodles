import type { CSSProperties, ReactNode } from "react";

type TapedFrameProps = {
  children: ReactNode;
  /** Degrees the frame is turned, as a photograph pressed on by hand never sits square. */
  tilt?: number;
  /** Where the strips of tape hold it down. */
  tape?: "corners" | "top" | "none";
  className?: string;
  style?: CSSProperties;
};

/** A strip of masking tape: translucent, a little crooked, torn at both ends. */
function Tape({ className, style }: { className: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 h-[1.6em] w-[5.5em] bg-[rgb(238_226_196/0.78)] shadow-[0_1px_2px_rgb(40_20_10/0.18)] ${className}`}
      style={{
        clipPath:
          "polygon(3% 8%, 9% 0, 17% 10%, 26% 2%, 100% 0, 96% 22%, 100% 44%, 95% 66%, 100% 100%, 88% 92%, 79% 100%, 0 100%, 5% 78%, 0 56%, 4% 34%)",
        ...style,
      }}
    />
  );
}

/**
 * Something pressed onto the page like a photograph in a scrapbook: a cream
 * paper border, a soft shadow, a slight turn, and tape holding it down.
 *
 * The frame is decoration around its content; the content keeps its own
 * semantics and size. Set `font-size` on the frame to scale the tape.
 */
export function TapedFrame({
  children,
  tilt = 0,
  tape = "corners",
  className,
  style,
}: TapedFrameProps) {
  return (
    <div
      className={`bg-cream relative p-[0.45em] shadow-[0_0.35em_0.9em_rgb(40_20_10/0.22)] ${className ?? ""}`}
      style={{ rotate: `${tilt}deg`, ...style }}
    >
      {tape === "corners" ? (
        <>
          <Tape className="-top-[0.7em] -left-[1.6em]" style={{ rotate: "-38deg" }} />
          <Tape className="-right-[1.6em] -bottom-[0.7em]" style={{ rotate: "-36deg" }} />
        </>
      ) : null}
      {tape === "top" ? (
        <Tape
          className="-top-[0.8em] left-1/2 -translate-x-1/2"
          style={{ rotate: "-3deg" }}
        />
      ) : null}
      {children}
    </div>
  );
}
