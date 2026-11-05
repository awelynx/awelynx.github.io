// Run with the bundled Node runtime (sharp) or a local sharp installation.
import { createRequire } from "node:module";
import fs from "node:fs/promises";
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || "sharp");
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#f6f5ef"/><path d="M64 92H1136M64 548H1136" stroke="#c9cdc1"/><text x="65" y="65" font-size="18" letter-spacing="3" fill="#252b26" font-family="sans-serif">YUXUAN LIN / AWELYNX</text><circle cx="940" cy="320" r="170" fill="#d4ef78"/>${Array.from({ length: 28 }, (_, i) => `<ellipse cx="940" cy="320" rx="${35 + i * 5}" ry="${160 - i * 3}" fill="none" stroke="#252b26" stroke-width="1" transform="rotate(-25 940 320)"/>`).join("")}<text x="65" y="240" font-family="Georgia,serif" font-size="98" fill="#252b26" letter-spacing="-4">Thinking in</text><text x="65" y="347" font-family="Georgia,serif" font-style="italic" font-size="110" fill="#252b26" letter-spacing="-4">systems.</text><text x="65" y="447" font-family="Georgia,serif" font-size="83" fill="#252b26" letter-spacing="-3">Building with AI.</text><text x="65" y="588" font-family="sans-serif" font-size="15" letter-spacing="2" fill="#687065">AI APPLICATIONS · SYSTEMS · RESEARCH</text></svg>`;
await fs.writeFile("static/img/social-card.svg", svg);
await sharp(Buffer.from(svg)).png().toFile("static/img/social-card.png");
