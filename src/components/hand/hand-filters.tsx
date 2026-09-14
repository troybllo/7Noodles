/**
 * SVG filters shared across the site, defined once in the layout.
 *
 * `rough-edges` roughens the outline of whatever uses it — poster lettering,
 * paper cards — as if printed or cut by hand. Reference it with
 * `filter: url(#rough-edges)`.
 */
export function HandFilters() {
  return (
    <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
      <filter id="rough-edges" x="-5%" y="-10%" width="110%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="2.2" />
      </filter>
      <filter id="torn-edge" x="-3%" y="-3%" width="106%" height="106%">
        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" seed="11" />
        <feDisplacementMap in="SourceGraphic" scale="5" />
      </filter>
    </svg>
  );
}
