/**
 * Brush strokes as SVG, shared by the brush and ornament generators.
 *
 * A stroke is a closed outline around a Bézier centreline, fat where the brush
 * is pressed and tapering where it lifts, textured by two filters: `dry`, whose
 * bristle streaks run along the stroke, and `core`, a denser inset pass. See
 * scripts/generate-brushes.mjs for why the two layers are needed.
 */

function pointAt([p0, p1, p2, p3], t) {
  const m = 1 - t;
  return [
    m ** 3 * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t ** 3 * p3[0],
    m ** 3 * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t ** 3 * p3[1],
  ];
}

function tangentAt([p0, p1, p2, p3], t) {
  const m = 1 - t;
  return [
    3 * m * m * (p1[0] - p0[0]) +
      6 * m * t * (p2[0] - p1[0]) +
      3 * t * t * (p3[0] - p2[0]),
    3 * m * m * (p1[1] - p0[1]) +
      6 * m * t * (p2[1] - p1[1]) +
      3 * t * t * (p3[1] - p2[1]),
  ];
}

/** Closed outline around a centreline, fat in the middle, tapering at both ends. */
export function outline(
  curve,
  maxWidth,
  { inset = 1, samples = 180, wobble = 7.3 } = {},
) {
  const left = [];
  const right = [];

  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const [x, y] = pointAt(curve, t);
    const [dx, dy] = tangentAt(curve, t);
    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;

    // Asymmetric on purpose. A loaded brush is pressed down at the start, so
    // it reaches full width almost immediately, then thins as it is dragged
    // and lifts off at the end. A symmetric profile reads as a leaf.
    const press = Math.min(1, t / 0.05);
    const drag = 1 - 0.5 * t ** 1.4;
    const lift = t > 0.78 ? Math.max(0.04, (1 - t) / 0.22) ** 0.7 : 1;
    let w = maxWidth * press * drag * lift * (1 - 0.14 * Math.sin(t * wobble));
    w *= inset;

    left.push([x + nx * w * 0.55, y + ny * w * 0.55]);
    right.push([x - nx * w * 0.45, y - ny * w * 0.45]);
  }

  const points = [...left, ...right.reverse()];
  return `M ${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")} Z`;
}

export function filters(seed) {
  return `
    <filter id="dry${seed}" x="-18%" y="-45%" width="136%" height="190%">
      <feTurbulence type="fractalNoise" baseFrequency="0.006 0.45" numOctaves="3" seed="${seed}" result="s"/>
      <feColorMatrix in="s" type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.1 0 0 0 0.05" result="sa"/>
      <feComponentTransfer in="sa" result="st">
        <feFuncA type="table" tableValues="0 0.1 0.55 0.95 1"/>
      </feComponentTransfer>
      <feTurbulence type="fractalNoise" baseFrequency="0.02 0.06" numOctaves="4" seed="${seed + 2}" result="e"/>
      <feDisplacementMap in="SourceGraphic" in2="e" scale="22"
        xChannelSelector="R" yChannelSelector="G" result="rg"/>
      <feComposite in="rg" in2="st" operator="in"/>
    </filter>
    <filter id="core${seed}" x="-18%" y="-45%" width="136%" height="190%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02 0.06" numOctaves="4" seed="${seed + 2}" result="e"/>
      <feDisplacementMap in="SourceGraphic" in2="e" scale="20"
        xChannelSelector="R" yChannelSelector="G"/>
    </filter>`;
}
