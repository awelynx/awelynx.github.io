# 林煜轩 · 作品与研究

Published website: **https://awelynx.github.io/**

A custom Astro static site. Pages are rendered to HTML at build time; a Remotion film (one React island) is the home hero, and small native JavaScript modules handle search, the mobile menu, reading controls, the photo reel and the gallery. Mermaid is loaded only on pages with diagrams.

## Start and verify

Requires Node **22.23.4 or newer**. CI uses Node 26, matching the major version used for local acceptance.

```sh
npm ci
npm start
```

```sh
npm run build
npm run verify:site
npm run serve -- --port 3091 --host 127.0.0.1
```

Build output: `build/`. The build prepares content assets and optimizes the original photographs; it never needs iCloud access. Astro telemetry is disabled in the project commands.

Browser QA requires Chrome on macOS, or a Playwright Chromium installation and `CHROME_EXECUTABLE` set to its executable:

```sh
npm run qa:browser
npm run qa:a11y
```

`PREVIEW_URL` overrides `http://127.0.0.1:3091/`. Results and screenshots are saved in ignored `output/playwright/archive/`.

## Page distribution

| Section | Route | Content |
| --- | --- | --- |
| Home | `/` | Scroll-scrubbed Remotion film (particles flow from noise to the signature, then to three words), intro and facts, project index, reading routes, pinned photo reel |
| Work | `/work/` | Six projects with case studies |
| Writing | `/writing/` | Reading routes, 17 articles and 25 notes/resources, full-text search, type/topic filters, shareable queries |
| Life | `/life/` | Singapore · Water & Light photo log |
| About | `/about/` | Original resume: education, experience, publication, projects, tools; printable |
| Archive | `/archive/` | 17 historical records (10 shared canonical bodies, seven distinct editions), historical CV and old links |

`/research/` redirects to `/about/#research`; `/life/singapore/` redirects to `/life/`. RSS: `/feed.xml`. Sitemap: `/sitemap.xml`. No external analytics or runtime font requests.

## Source organization

- `astro.config.mjs`: static build and root-domain settings.
- `src/layouts/Base.astro`: global document, navigation and footer.
- `src/styles/site.css`: the single stylesheet (cyanotype tokens, light/dark, pages, view transitions, print, reduced motion). The page is designed as one integration from noise (t = 0, top) to data (t = 1, footer); the header shows the current t.
- `src/components/FilmHero.astro` + `src/film/`: the home hero. `FlowFilm.jsx` is a Remotion composition (a pure function of the frame); `FilmIsland.jsx` samples the signature and words into particle targets and drives `@remotion/player` from the scroll position. Static signature without JavaScript, held at the signature under reduced motion.
- `src/components/WorkIndex.astro`: project index with cursor-following cyanotype previews; titles morph into case pages through cross-document view transitions.
- `src/scripts/site.js`: header t readout, photo reel, menu, search, reader, lightbox and Mermaid.
- `src/data/portfolio.js`: profile, education, experience, publication, projects and tools — wording follows the original resume.
- `src/lib/content.mjs`: Markdown, KaTeX, highlighting, old-content mapping and historical HTML rendering.
- `docs/notes/`: authorized imported Obsidian notes; duplicate Flow Matching is consolidated into the dated article. The eight excluded outlines remain unpublished.
- `content/notes/`: curated cross-source notes, including the consolidated Go Web resource index.
- `content/curation.json` and `content/supplements.json`: canonical merge decisions and unique references retained across future Obsidian syncs.
- `content/asset-merges.json`: exact-byte media consolidation provenance.
- `docs/inventory/`: human-readable asset plan, canonical entries and a snapshot of 40 public repositories.
- `blog/`: authored article sources. Explicit drafts are excluded. Previously published articles whose current Markdown is mostly commented out use the preserved original HTML so their reading pages remain complete.
- `plog/`: original photography and captions, preserved as source material.
- `src/data/legacy.json`: preserved original HTML editions and historical CV.
- `scripts/prepare-garden.mjs`: deterministic content asset copying and WebP photography preparation.
- `scripts/verify-site.mjs`: rendered link/assets, homepage and retired-prefix checks.
- `scripts/qa-site.cjs`: viewport, content, interactions, redirects and axe verification.

`static/content/` and `static/media/` are generated and ignored; the source material is tracked. Exact duplicate media copies have been removed after rewriting retained references to the canonical source. Article source is not rewritten by the build.

To resync the authorized Obsidian Public folder:

```sh
npm run sync:notes -- '/absolute/path/to/MyBook/Public' '/absolute/path/to/MyBook/GitBook'
```

The optional second directory is an asset-only fallback. The importer never modifies the vault or imports private Markdown. Commit the generated notes and metadata before publication.

## Publication and retired sites

One repository: `awelynx/awelynx.github.io`. Maintained source: **`codex/root-site`**. Generated GitHub Pages output: **`master`**.

```sh
git push origin codex/root-site
npm run deploy
```

The publisher requires a clean, pushed source commit, builds and verifies the site, then makes a normal fast-forward push to `master`. Publication records `/site-version.json` and preserves both the preceding deployment and exact source commit as parents. Credentials are handled by normal Git authentication; no tokens are extracted.

**Doc and CV repositories must remain intact, and their websites must remain unpublished.** Both Pages sources were set to `None`; `/Doc/` and `/CV/` have no redirects and must return HTTP 404. Build verification rejects either prefix. Former root content routes (`/notes/`, `/blog/…`, `/docs/notes/…`, `/projects/…`, `/resume/`) map to the new corresponding routes. Date-based Hexo links and `/archive/…` originals are preserved.

Full previous root, Doc and CV Git histories remain reachable through consolidation commit `cc2311cb262602eb23faabbb6bc71d747154ac0f`. Local full mirrors are retained under ignored `.migration/backups/`. Deployment and migration records: `docs/plans/2026-10-23-deployment.md`, `docs/plans/2026-10-23-root-migration.md`. Current design: `docs/plans/2026-10-23-site-redesign.md`.

## Content and design rules

Original text wins: profile and experience follow the original resume, project case studies the original project data, writing routes `docs/intro.md`, and photography the original photo log. Each subject has one canonical page. The design system (one typeface family, paper/ink/signal palette, one orchestrated motion moment) is documented in `docs/plans/2026-10-23-site-redesign.md`.

Run `npm run inventory` to regenerate the repository asset report. `npm run verify:site` also enforces unique published bodies, merged aliases, media provenance and that folded routes stay redirects. Git history retains every removed file.
