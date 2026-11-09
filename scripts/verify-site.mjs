import fs from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
const root = path.resolve("build");
const base = process.env.SITE_BASE_URL || "/";
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name),
      ),
    )
  ).flat();
}
const files = await walk(root);
await fs.access(path.join(root, ".nojekyll"));
for (const retired of ["Doc", "CV"]) {
  if (
    files.some((file) => {
      const relative = path.relative(root, file);
      return (
        relative.startsWith(retired + path.sep) ||
        relative === retired + ".html"
      );
    })
  )
    throw new Error(`Retired URL must not be published: /${retired}/`);
}
const htmlFiles = files.filter((f) => f.endsWith(".html"));
const missing = new Set();
let checked = 0;
let reservedImages = 0;
for (const file of htmlFiles) {
  const html = await fs.readFile(file, "utf8");
  if (
    file.includes(path.sep + "writing" + path.sep) &&
    html.includes('class="katex-error"')
  )
    missing.add("Invalid rendered formula: " + path.relative(root, file));
  if (file.includes(path.sep + "writing" + path.sep)) {
    const $ = load(html);
    $(".prose img[src^='/']").each((_, image) => {
      if (
        Number($(image).attr("width")) > 0 &&
        Number($(image).attr("height")) > 0
      )
        reservedImages++;
      else
        missing.add(
          "Image missing reserved dimensions: " +
            path.relative(root, file) +
            " → " +
            $(image).attr("src"),
        );
    });
  }
  for (const match of html.matchAll(/(?:href|src)="([^"#?]+)[^\"]*"/g)) {
    const url = match[1].replaceAll("&amp;", "&");
    if (!url.startsWith(base) || url.startsWith("//")) continue;
    const relative = decodeURIComponent(url.slice(base.length));
    const target = path.resolve(root, relative);
    if (!target.startsWith(root + path.sep) && target !== root)
      throw new Error("Path escaped build: " + url);
    let exists = false;
    for (const candidate of [
      target,
      path.join(target, "index.html"),
      target + ".html",
    ])
      try {
        if ((await fs.stat(candidate)).isFile()) {
          exists = true;
          break;
        }
      } catch {}
    if (!exists) missing.add(`${path.relative(root, file)} → ${url}`);
    checked++;
  }
}
const home = await fs.readFile(path.join(root, "index.html"), "utf8");
for (const expected of [
  "data-film",
  "/work/",
  "/writing/",
  "/life/",
  "/about/",
  "/about/#research",
]) {
  if (!home.includes(expected)) missing.add("Home missing " + expected);
}
// Folded routes must stay redirects, never pages of their own.
for (const folded of ["research", "life/singapore"]) {
  const html = await fs.readFile(path.join(root, folded, "index.html"), "utf8");
  if (!html.includes('http-equiv="refresh"'))
    missing.add("Folded route is not a redirect: /" + folded + "/");
}
// Every CJK character on a page must be in the Site Song subset.
const subset = new Set(await fs.readFile(".astro/site-song-chars.txt", "utf8"));
const uncovered = new Set();
for (const file of htmlFiles)
  for (const ch of load(await fs.readFile(file, "utf8")).text())
    if (/[⺀-鿿豈-﫿＀-￯]/u.test(ch) && !subset.has(ch)) uncovered.add(ch);
if (uncovered.size)
  missing.add("Site Song subset lacks: " + [...uncovered].join(""));
if (missing.size) {
  console.error([...missing].join("\n"));
  process.exit(1);
}
console.log(
  `Verified ${checked} internal links/assets across ${htmlFiles.length} rendered pages; ${reservedImages} local reading images reserve their dimensions.`,
);
