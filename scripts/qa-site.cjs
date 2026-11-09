const { chromium } = require("playwright");
const { default: AxeBuilder } = require("@axe-core/playwright");
const fs = require("node:fs/promises");
const assert = require("node:assert/strict");
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3091/";
const a11y = process.argv.includes("--a11y");
(async () => {
  const { posts } = await import("../src/lib/content.mjs");
  await fs.mkdir("output/playwright/archive", { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.CHROME_EXECUTABLE ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const badResponses = [];
  page.on("response", (r) => {
    if (
      r.url().startsWith(base) &&
      r.status() >= 400 &&
      !/\/(Doc|CV)\//.test(r.url())
    )
      badResponses.push({ url: r.url(), status: r.status() });
  });
  const checks = [];
  const axe = [];
  const major = [
    "",
    "work/",
    "work/fingoat/",
    "work/pacc/",
    "work/probabilistic-imaging/",
    "work/cuda-lenet/",
    "work/linux-kernel/",
    "work/aid3/",
    "writing/",
    "life/",
    "about/",
    "writing/notes/hpc/cuda/",
    "writing/notes/algo/flow-based-model/",
  ];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of major) {
      const response = await page.goto(new URL(route, base).href, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200, route);
      await page.evaluate(() => document.fonts.ready);
      if (route.includes("/hpc/cuda"))
        await page.waitForFunction(
          () => document.querySelectorAll(".mermaid-wrap").length > 0,
          { timeout: 20000 },
        );
      const result = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        h1: document.querySelectorAll("main h1").length,
        broken: [...document.images]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.src),
      }));
      checks.push({ route, width, ...result });
      assert.ok(
        result.scroll <= width + 1,
        `Overflow ${width} ${route}: ${result.scroll}`,
      );
      assert.equal(result.h1, 1, route);
      assert.deepEqual(result.broken, [], route);
      if (route === "" || route === "life/") {
        await page.evaluate(async () => {
          for (const img of document.images) {
            img.loading = "eager";
            try {
              await img.decode();
            } catch {}
          }
        });
      }
      await page.screenshot({
        path: `output/playwright/archive/${route.replaceAll("/", "-") || "home"}-${width}.png`,
        fullPage: route === "" || route === "work/",
      });
      if (a11y) {
        const r = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        axe.push({
          route,
          width,
          violations: r.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes
              .map((n) => ({ target: n.target, summary: n.failureSummary }))
              .slice(0, 6),
          })),
        });
      }
    }
  }
  if (!a11y) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base, { waitUntil: "networkidle" });
    const menu = page.getByRole("button", { name: "打开导航" });
    await menu.click();
    await page
      .getByRole("navigation", { name: "移动端导航" })
      .getByRole("link", { name: /写作/ })
      .click();
    await page.waitForURL("**/writing/");
    checks.push({ interaction: "mobile navigation", pass: true });
    await page.goto(new URL("writing/?q=CUDA&type=notes", base).href, {
      waitUntil: "networkidle",
    });
    await page.waitForFunction(() =>
      document
        .querySelector("[data-result-count]")
        .textContent.startsWith("找到"),
    );
    let visible = await page.locator("[data-entry]:visible").count();
    assert.ok(visible > 0 && visible < posts.length);
    assert.equal(
      await page.locator("[data-entry][data-type=articles]:visible").count(),
      0,
    );
    checks.push({ interaction: "query/type restored", visible, pass: true });
    const search = page.getByRole("searchbox");
    await search.fill("zzzznoentry999");
    await page.waitForTimeout(180);
    assert.equal(await page.locator("[data-entry]:visible").count(), 0);
    assert.ok(await page.getByRole("button", { name: "清除筛选" }).isVisible());
    await page.getByRole("button", { name: "清除筛选" }).click();
    await page.waitForTimeout(180);
    assert.equal(
      await page.locator("[data-entry]:visible").count(),
      posts.length,
    );
    checks.push({ interaction: "search empty/reset", pass: true });
    await search.fill("归一化");
    await page.waitForTimeout(180);
    assert.ok((await page.locator("[data-entry]:visible").count()) > 0);
    checks.push({ interaction: "Chinese full-text search", pass: true });
    await page.goto(new URL("life/", base).href, {
      waitUntil: "networkidle",
    });
    const opener = page.locator('[data-photo="0"]');
    await opener.click();
    assert.ok(await page.getByRole("dialog").isVisible());
    await page.getByRole("button", { name: "下一张" }).click();
    assert.match(
      await page.locator(".lightbox figcaption").textContent(),
      /克拉码头/,
    );
    await page.keyboard.press("Escape");
    assert.ok(!(await page.getByRole("dialog").isVisible()));
    assert.ok(await opener.evaluate((el) => el === document.activeElement));
    checks.push({ interaction: "gallery open/next/escape/focus", pass: true });
    for (const post of posts) {
      await page.goto(new URL(post.url, base).href, {
        waitUntil: "networkidle",
      });
      await page.evaluate(async () => {
        for (const img of document.images) {
          img.loading = "eager";
          try {
            await img.decode();
          } catch {}
        }
      });
      const layout = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        width: innerWidth,
        body: document.querySelector(".prose").textContent.length,
        broken: [...document.images]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.src),
      }));
      checks.push({ content: post.slug, ...layout });
      assert.ok(
        layout.scroll <= layout.width + 1,
        "Content overflow " + post.slug,
      );
      assert.deepEqual(layout.broken, [], post.slug);
      assert.ok(layout.body > 0, post.slug);
    }
    for (const [old, target] of [
      ["projects/fingoat/", "work/fingoat/"],
      ["resume/", "about/"],
      ["research/", "about/#research"],
      ["life/singapore/", "life/"],
      ["plog/singapore-through-my-lens/", "life/"],
      ["notes/", "writing/?type=notes"],
      ["docs/notes/hpc/cuda/", "writing/notes/hpc/cuda/"],
      [
        "writing/notes/algo/flow-matching/",
        "writing/articles/road-to-flow-matching/",
      ],
      ["writing/articles/cuda/", "writing/notes/hpc/cuda/"],
      ["docs/WebDev/Go/", "writing/notes/engineering/go-web-resources/"],
      ["docs/cpp/", "writing/notes/leetcode/C++语法/"],
    ]) {
      await page.goto(new URL(old, base).href, { waitUntil: "networkidle" });
      await page.waitForURL(new URL(target, base).href);
      checks.push({ redirect: old, to: target, pass: true });
    }
    for (const old of ["Doc/", "CV/", "archive/", "archive/cv/"]) {
      const r = await context.request.get(new URL(old, base).href);
      assert.equal(r.status(), 404);
      checks.push({ retired: old, status: 404 });
    }
  }
  await fs.writeFile(
    "output/playwright/archive/" +
      (a11y ? "a11y" : "browser") +
      "-results.json",
    JSON.stringify({ checks, axe, errors, badResponses }, null, 2),
  );
  await browser.close();
  assert.deepEqual(errors, [], "Browser runtime errors");
  assert.deepEqual(badResponses, [], "Missing assets");
  if (a11y)
    assert.equal(
      axe.reduce((n, r) => n + r.violations.length, 0),
      0,
      "Accessibility violations: see report",
    );
  console.log(
    `PASS ${checks.length} layout/content/interaction checks; ${axe.length} accessibility cases; no runtime or asset errors.`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
