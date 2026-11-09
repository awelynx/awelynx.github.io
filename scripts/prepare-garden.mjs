import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const imageDimensions = {};
async function recordDimensions(file, url) {
  if (!/\.(png|jpe?g|gif|svg|webp)$/i.test(file)) return;
  try {
    const metadata = await sharp(file).metadata();
    const width = metadata.autoOrient?.width || metadata.width;
    const height = metadata.autoOrient?.height || metadata.height;
    if (width && height) imageDimensions[url] = { width, height };
  } catch {
    /* Unsupported media keeps its existing browser fallback. */
  }
}
async function exactSource(file) {
  const names = await fs.readdir(path.dirname(file));
  if (!names.includes(path.basename(file)))
    throw new Error(`Source filename casing must match Git exactly: ${file}`);
  return file;
}
async function copyAssets(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await copyAssets(p);
    else if (/\.(png|jpe?g|gif|svg|webp|pdf)$/i.test(p)) {
      const target = path.join("static/content", p);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.copyFile(p, target);
      await recordDimensions(target, "/" + target.slice("static/".length));
    }
  }
}
await fs.rm("static/content", { recursive: true, force: true });
await copyAssets("docs/notes");
await copyAssets("blog");
await fs.mkdir("static/media", { recursive: true });
const { photos } = await import("../src/lib/content.mjs");
for (const p of photos)
  await sharp(await exactSource("plog/2025-07-10-Singapore/" + p.file))
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile("static" + p.url);
for (const [source, name, width] of [
  ["infra.png", "fingoat", 1600],
  ["pacc.png", "pacc", 1600],
  ["PET.png", "imaging", 1600],
  ["Lenet.png", "cuda", 1000],
  ["os.png", "os", 1000],
])
  await sharp(await exactSource("static/index/" + source))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile("static/media/" + name + ".webp");
for (const dir of ["static/index", "static/legacy-assets", "static/media"]) {
  for (const name of await fs.readdir(dir))
    await recordDimensions(
      path.join(dir, name),
      "/" + dir.slice("static/".length) + "/" + name,
    );
}
await fs.mkdir(".astro", { recursive: true });
await fs.writeFile(
  ".astro/image-dimensions.json",
  JSON.stringify(imageDimensions),
);
console.log(
  "Prepared preserved content assets and optimized original photography.",
);
