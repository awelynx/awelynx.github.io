// The home film: a Remotion composition rendered live by @remotion/player.
// Every pixel is a pure function of the frame and the input props, so the
// page can scrub it with the scroll position in both directions.
import { useEffect, useRef } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FPS = 60;
export const DURATION = 600;
// Noise → signature, then the name settles. Played automatically on load.
export const INTRO_END = 240;
// Signature → three words. Scrubbed by scroll.
const SPLIT_START = 280;
const SPLIT_END = 500;

const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const out = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

// Position of particle i at flow time t between two point sets. Straight
// rectified-flow paths, bent by a per-particle sideways term that vanishes at
// both ends so the endpoints stay exact.
function along(from, to, bend, i, t, out) {
  const x0 = from[i * 2],
    y0 = from[i * 2 + 1];
  const dx = to[i * 2] - x0,
    dy = to[i * 2 + 1] - y0;
  const s = Math.sin(Math.PI * t) * bend[i];
  out[0] = x0 + dx * t - dy * s;
  out[1] = y0 + dy * t + dx * s;
}

// Per-particle progress with a stagger, so the cloud arrives as a wave.
const staggered = (u, delay) =>
  inOut(Math.min(1, Math.max(0, (u - delay) / (1 - 0.3))));

function Particles({ points, width, height, dpr, palette }) {
  const frame = useCurrentFrame();
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const { noise, sig, words, bend, delay, warm } = points;
    const n = delay.length;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.lineWidth = width < 720 ? 1.2 : 1.5;
    const lag = 5; // frames of trail
    const a = [0, 0],
      b = [0, 0];
    const place = (i, f, p) => {
      if (f < SPLIT_START) {
        const t = staggered(f / 180, delay[i]);
        along(noise, sig, bend, i, t, p);
        // A faint breath while the signature holds.
        if (f > 180) {
          const w = Math.sin(f * 0.05 + i) * 0.35;
          p[0] += w;
          p[1] += w * 0.6;
        }
      } else {
        const t = staggered(
          (f - SPLIT_START) / (SPLIT_END - SPLIT_START),
          delay[i],
        );
        along(sig, words, bend, i, t, p);
      }
    };
    for (const pass of [0, 1]) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        if (warm[i] !== pass) continue;
        place(i, frame, a);
        place(i, Math.max(0, frame - lag), b);
        ctx.moveTo(b[0], b[1]);
        ctx.lineTo(a[0], a[1]);
      }
      ctx.strokeStyle = pass ? palette.warm : palette.particle;
      ctx.globalAlpha = pass ? 0.95 : 0.78;
      ctx.stroke();
    }
  }, [frame, points, width, height, dpr, palette]);
  return (
    <canvas
      ref={ref}
      width={Math.round(width * dpr)}
      height={Math.round(height * dpr)}
      style={{ position: "absolute", inset: 0, width, height }}
    />
  );
}

function Name({ layout, text, palette }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { name } = layout;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: name.top,
        textAlign: "center",
        color: palette.ink,
        opacity:
          interpolate(frame, [2.5 * fps, 3.4 * fps], [0, 1], clamp) *
          interpolate(
            frame,
            [SPLIT_START, SPLIT_START + 0.6 * fps],
            [1, 0],
            clamp,
          ),
      }}
    >
      <div
        style={{
          fontFamily: "'Bricolage Grotesque Variable', sans-serif",
          fontSize: name.size,
          lineHeight: 1,
          letterSpacing: "-0.035em",
          fontVariationSettings: `"wght" ${interpolate(frame, [2.5 * fps, 3.8 * fps], [250, 640], { ...clamp, easing: out })}, "wdth" ${interpolate(frame, [2.5 * fps, 3.8 * fps], [75, 100], { ...clamp, easing: out })}`,
          translate: `0 ${interpolate(frame, [2.5 * fps, 3.8 * fps], [name.size * 0.25, 0], { ...clamp, easing: out })}px`,
        }}
      >
        {text.name}
      </div>
      <div
        style={{
          marginTop: name.size * 0.32,
          fontSize: Math.max(14, name.size * 0.2),
          letterSpacing: "0.01em",
          opacity: interpolate(frame, [3.2 * fps, 4 * fps], [0, 0.78], clamp),
        }}
      >
        {text.role}
      </div>
    </div>
  );
}

function Captions({ layout, text, palette }) {
  const frame = useCurrentFrame();
  return layout.captions.map((c, i) => (
    <div
      key={i}
      style={{
        position: "absolute",
        left: c.x,
        top: c.y,
        width: c.width,
        fontSize: c.size,
        lineHeight: 1.45,
        color: palette.ink,
        opacity: interpolate(
          frame,
          [SPLIT_END - 40 + i * 14, SPLIT_END + 10 + i * 14],
          [0, 0.88],
          clamp,
        ),
        translate: `0 ${interpolate(frame, [SPLIT_END - 40 + i * 14, SPLIT_END + 10 + i * 14], [12, 0], { ...clamp, easing: out })}px`,
      }}
    >
      {text.captions[i]}
    </div>
  ));
}

// The running annotation in the corner: what the particles are doing now.
function Readout({ layout, text, palette }) {
  const frame = useCurrentFrame();
  const t = staggeredReadout(frame);
  const lines = [
    [0, 50, text.formula[0]],
    [50, 170, text.formula[1]],
    [170, SPLIT_START, text.formula[2]],
    [SPLIT_START, DURATION + 1, text.formula[3]],
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: layout.gutter,
        right: layout.gutter,
        bottom: layout.gutter * 0.75,
        display: "flex",
        flexWrap: layout.narrow ? "wrap" : "nowrap",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: layout.narrow ? "6px 16px" : 24,
        fontSize: layout.small,
        color: palette.ink,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span
        style={{
          position: "relative",
          flex: layout.narrow ? "1 0 100%" : 1,
          minHeight: layout.narrow ? "2.9em" : "1.4em",
        }}
      >
        {lines.map(([from, to, label]) => (
          <span
            key={label}
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              right: 0,
              whiteSpace: layout.narrow ? "normal" : "nowrap",
              opacity: interpolate(
                frame,
                [from, from + 12, to - 12, to],
                [0, 0.8, 0.8, 0],
                clamp,
              ),
            }}
          >
            {label}
          </span>
        ))}
      </span>
      <span style={{ opacity: 0.8 }}>t = {t.toFixed(2)}</span>
      <span
        style={{
          opacity: interpolate(
            frame,
            [INTRO_END - 30, INTRO_END, SPLIT_START + 20, SPLIT_START + 50],
            [0, 0.8, 0.8, 0],
            clamp,
          ),
        }}
      >
        {text.hint}
      </span>
    </div>
  );
}

// t runs 0 → 1 while noise becomes the signature, then 1 → 2 for the words.
const staggeredReadout = (f) =>
  f < SPLIT_START
    ? inOut(Math.min(1, f / 180))
    : 1 +
      inOut(
        Math.min(1, Math.max(0, (f - SPLIT_START) / (SPLIT_END - SPLIT_START))),
      );

export function FlowFilm({
  points,
  layout,
  text,
  palette,
  width,
  height,
  dpr,
}) {
  return (
    <AbsoluteFill style={{ background: palette.plate, overflow: "hidden" }}>
      <Particles
        points={points}
        width={width}
        height={height}
        dpr={dpr}
        palette={palette}
      />
      <Name layout={layout} text={text} palette={palette} />
      <Captions layout={layout} text={text} palette={palette} />
      <Readout layout={layout} text={text} palette={palette} />
    </AbsoluteFill>
  );
}
