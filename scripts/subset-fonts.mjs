import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

// LXGW Neo ZhiSong ships as one 10 MB TTF. The site serves a subset holding only
// the CJK characters its own text uses. The IPA Font License forbids reusing the
// original name for a derived font, so the subset is published as "Site Song".
const release = {
  url: "https://github.com/lxgw/LxgwNeoZhiSong/releases/download/v1.070/LXGWNeoZhiSong.ttf",
  sha256: "c42000b59caffe8ccfcd1c90aa2841dcafa866cf24769cc1b10c3708c671f207",
};
const cache = path.resolve("node_modules/.cache/lxgw-neo-zhisong/v1.070.ttf");
// Same ranges as the @font-face unicode-range in site.css.
const songRange = /[⺀-鿿豈-﫿︰-﹏＀-￯\u{20000}-\u{2fa1f}]/u;
const charsFile = path.resolve(".astro/site-song-chars.txt");

async function original() {
  let buffer = await fs.readFile(cache).catch(() => null);
  if (!buffer) {
    const response = await fetch(release.url);
    if (!response.ok)
      throw new Error(
        `Font download failed: ${response.status} ${release.url}`,
      );
    buffer = Buffer.from(await response.arrayBuffer());
  }
  const digest = createHash("sha256").update(buffer).digest("hex");
  if (digest !== release.sha256)
    throw new Error(`Unexpected LXGW Neo ZhiSong checksum: ${digest}`);
  await fs.mkdir(path.dirname(cache), { recursive: true });
  await fs.writeFile(cache, buffer);
  return buffer;
}
async function walk(dir) {
  const entries = await fs
    .readdir(dir, { withFileTypes: true })
    .catch(() => []);
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name),
      ),
    )
  ).flat();
}
const sources = (
  await Promise.all(["src", "content", "docs", "blog", "plog"].map(walk))
)
  .flat()
  .filter((f) => /\.(astro|mjs|jsx?|json|mdx?|css)$/.test(f));
const chars = new Set();
for (const file of sources)
  for (const ch of await fs.readFile(file, "utf8"))
    if (songRange.test(ch)) chars.add(ch);
const text = [...chars].sort().join("");
await original();
await fs.mkdir(path.dirname(charsFile), { recursive: true });
await fs.writeFile(charsFile, text);
const out = "static/fonts/site-song.woff2";
// fontTools (pip install fonttools brotli) subsets and renames the font.
execFileSync(
  "python3",
  ["scripts/subset_font.py", cache, charsFile, out, "Site Song"],
  { stdio: "inherit" },
);
const woff2 = await fs.readFile(out);
console.log(
  `Site Song: ${chars.size} characters, ${(woff2.length / 1024).toFixed(0)} KB`,
);
