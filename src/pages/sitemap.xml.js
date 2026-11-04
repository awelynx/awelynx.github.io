import { posts, legacy, archiveCanonical } from "../lib/content.mjs";
import { projects } from "../data/portfolio.js";
export function GET() {
  const urls = [
    "/",
    "/work/",
    "/writing/",
    "/life/",
    "/about/",
    "/archive/",
    "/archive/cv/",
    ...posts.map((p) => p.url),
    ...projects.map((p) => `/work/${p.slug}/`),
    "/en/",
    "/en/work/",
    "/en/about/",
    ...projects.map((p) => `/en/work/${p.slug}/`),
    ...legacy.articles
      .filter((p) => !archiveCanonical.has(p.archive))
      .map((p) => p.archive),
    ...legacy.extras.map((p) => p.archive),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>https://lynxarv.github.io${encodeURI(u)}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
