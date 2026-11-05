import { posts } from "../lib/content.mjs";
const esc = (s) =>
  String(s).replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>林煜轩 · 作品与研究</title><link>https://awelynx.github.io/</link><description>作品、研究、写作与生活</description><language>zh-CN</language>${posts
      .filter((p) => p.date)
      .map(
        (p) =>
          `<item><title>${esc(p.title)}</title><link>https://awelynx.github.io${esc(p.url)}</link><guid>https://awelynx.github.io${esc(p.url)}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`,
      )
      .join("")}</channel></rss>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
