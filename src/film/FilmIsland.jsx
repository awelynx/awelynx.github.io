// Mounts the Remotion film in the home hero and drives its frame:
// on load it plays the intro (noise → signature), then the scroll position
// through the pinned section scrubs the rest, forwards and backwards.
import { Player } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
import { DURATION, FPS, FlowFilm, INTRO_END } from "./FlowFilm.jsx";

const WORDS = ["agents", "kernels", "flows"];
const DISPLAY = "'Bricolage Grotesque Variable', sans-serif";

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pick n points uniformly from the inked pixels of a drawing.
function sample(width, height, draw, n, random) {
  const c = document.createElement("canvas");
  c.width = Math.ceil(width);
  c.height = Math.ceil(height);
  const ctx = c.getContext("2d", { willReadFrequently: true });
  draw(ctx);
  const { data } = ctx.getImageData(0, 0, c.width, c.height);
  const step = width > 900 ? 2 : 1;
  const hits = [];
  for (let y = 0; y < c.height; y += step)
    for (let x = 0; x < c.width; x += step)
      if (data[(y * c.width + x) * 4 + 3] > 110) hits.push(x, y);
  const out = new Float32Array(n * 2);
  const count = hits.length / 2;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(random() * count) * 2;
    out[i * 2] = hits[k] + (random() - 0.5) * step;
    out[i * 2 + 1] = hits[k + 1] + (random() - 0.5) * step;
  }
  return out;
}

function gauss(random) {
  const u = 1 - random(),
    v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function buildLayout(w, h) {
  const narrow = w < 720;
  const gutter = Math.max(18, Math.min(56, w * 0.045));
  const small = narrow ? 12.5 : 14;
  // Signature: 348 × 146.4 viewBox.
  const sigW = narrow ? w * 0.84 : Math.min(w * 0.58, h * 0.4 * (348 / 146.4));
  const sigH = sigW * (146.4 / 348);
  const sig = { x: (w - sigW) / 2, y: h * 0.4 - sigH / 2, w: sigW, h: sigH };
  const nameSize = narrow ? w * 0.12 : Math.min(h * 0.085, w * 0.06);
  const name = { top: sig.y + sigH + h * 0.05, size: nameSize };
  // Three words, stacked, set in the display face.
  const size = narrow ? w * 0.19 : Math.min(h * 0.2, w * 0.125);
  const lead = narrow ? size * 2.05 : size * 0.98;
  const top = (h - lead * 2 - size) / 2 - (narrow ? h * 0.03 : 0);
  const lines = WORDS.map((word, i) => ({
    word,
    x: gutter,
    baseline: top + size * 0.82 + i * lead,
  }));
  const capSize = narrow ? 13 : Math.max(15, Math.min(19, w * 0.012));
  const captions = lines.map((l) =>
    narrow
      ? {
          x: gutter,
          y: l.baseline + size * 0.18,
          width: w - gutter * 2,
          size: capSize,
        }
      : {
          x: w * 0.6,
          y: l.baseline - capSize * 2.6,
          width: w * 0.4 - gutter,
          size: capSize,
        },
  );
  return { narrow, gutter, small, sig, name, words: { size, lines }, captions };
}

function loadSignature() {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "/img/signature.svg";
  });
}

async function buildPoints(w, h, layout) {
  const random = rng(20260408);
  const n = layout.narrow
    ? Math.round(Math.min(4200, (w * h) / 110))
    : Math.round(Math.min(8000, (w * h) / 150));
  const img = await loadSignature();
  await document.fonts.load(
    `700 ${Math.round(layout.words.size)}px ${DISPLAY}`,
  );
  const { sig } = layout;
  const sigPts = sample(
    w,
    h,
    (ctx) => ctx.drawImage(img, sig.x, sig.y, sig.w, sig.h),
    n,
    random,
  );
  const wordPts = sample(
    w,
    h,
    (ctx) => {
      ctx.font = `700 ${layout.words.size}px ${DISPLAY}`;
      ctx.letterSpacing = `${-layout.words.size * 0.03}px`;
      ctx.fillStyle = "#000";
      for (const l of layout.words.lines) ctx.fillText(l.word, l.x, l.baseline);
    },
    n,
    random,
  );
  const noise = new Float32Array(n * 2);
  const bend = new Float32Array(n);
  const delay = new Float32Array(n);
  const warm = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    noise[i * 2] = w / 2 + gauss(random) * w * 0.2;
    noise[i * 2 + 1] = h / 2 + gauss(random) * h * 0.22;
    bend[i] = (random() - 0.5) * 0.7;
    delay[i] = random() * 0.3;
    warm[i] = random() < 0.025 ? 1 : 0;
  }
  return { noise, sig: sigPts, words: wordPts, bend, delay, warm };
}

const palettes = {
  light: {
    plate: "#1b3f8b",
    particle: "#eaf2ff",
    warm: "#f2b544",
    ink: "#eaf2ff",
  },
  dark: {
    plate: "#0a1a3d",
    particle: "#d6e4ff",
    warm: "#f2b544",
    ink: "#dfe8f8",
  },
};

export default function FilmIsland({ text }) {
  const root = useRef(null);
  const player = useRef(null);
  const [film, setFilm] = useState(null);

  // Measure the stage and (re)build the particle sets for its size.
  useEffect(() => {
    const stage = root.current.parentElement.closest("[data-film-stage]");
    let cancelled = false;
    let last = "";
    const build = async () => {
      const w = Math.round(stage.clientWidth);
      const h = Math.round(stage.clientHeight);
      const key = `${w}x${h}`;
      if (!w || !h || key === last) return;
      last = key;
      const layout = buildLayout(w, h);
      const points = await buildPoints(w, h, layout);
      if (cancelled) return;
      const dark = matchMedia("(prefers-color-scheme: dark)").matches;
      setFilm({
        w,
        h,
        dpr: Math.min(2, devicePixelRatio || 1),
        layout,
        points,
        palette: palettes[dark ? "dark" : "light"],
      });
    };
    build().catch(() => {});
    let timer;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      // Phones resize the viewport while the toolbar hides; ignore small changes.
      timer = setTimeout(() => {
        const [lw, lh] = last.split("x").map(Number);
        if (
          Math.abs(stage.clientWidth - lw) > 2 ||
          Math.abs(stage.clientHeight - lh) > 120
        )
          build().catch(() => {});
      }, 180);
    });
    ro.observe(stage);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, []);

  // Drive the frame: intro clock + scroll progress, eased toward the target.
  useEffect(() => {
    if (!film) return;
    const section = root.current.closest("[data-film]");
    section.dataset.ready = "true";
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      player.current?.seekTo(INTRO_END);
      return;
    }
    const progress = () => {
      const r = section.getBoundingClientRect();
      const span = r.height - innerHeight;
      return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    };
    let intro = progress() > 0.02 ? INTRO_END : 0;
    let current = intro;
    let previous = performance.now();
    let raf;
    let shown = -1;
    const tick = (now) => {
      const dt = Math.min(64, now - previous);
      previous = now;
      if (intro < INTRO_END)
        intro = Math.min(INTRO_END, intro + (dt / 1000) * FPS * 1.35);
      const target = Math.max(
        intro,
        INTRO_END + progress() * (DURATION - 1 - INTRO_END),
      );
      current += (target - current) * Math.min(1, dt / 90);
      const frame = Math.round(current);
      if (frame !== shown) {
        player.current?.seekTo(frame);
        shown = frame;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [film]);

  return (
    <div ref={root} className="film-player" aria-hidden="true">
      {film && (
        <Player
          ref={player}
          component={FlowFilm}
          inputProps={{
            points: film.points,
            layout: film.layout,
            palette: film.palette,
            text,
            width: film.w,
            height: film.h,
            dpr: film.dpr,
          }}
          durationInFrames={DURATION}
          fps={FPS}
          compositionWidth={film.w}
          compositionHeight={film.h}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          initialFrame={0}
          acknowledgeRemotionLicense
        />
      )}
    </div>
  );
}
