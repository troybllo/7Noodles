/** Two rising tones, loud enough for a kitchen. Web Audio, so there is no sound file to load. */
export function chime(context: AudioContext) {
  const now = context.currentTime;
  [880, 1320].forEach((frequency, i) => {
    const start = now + i * 0.22;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "triangle";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.9, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
    osc.connect(gain).connect(context.destination);
    osc.start(start);
    osc.stop(start + 0.55);
  });
}
