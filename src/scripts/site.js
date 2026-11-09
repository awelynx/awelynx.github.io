const header = document.querySelector(".header");
const menu = document.querySelector(".menu-toggle");
const mobile = document.querySelector(".mobile-nav");
const menuLabel = menu?.querySelector(".sr-only");
function setMenu(open) {
  menu.setAttribute("aria-expanded", String(open));
  const en = document.documentElement.lang === "en";
  menuLabel.textContent = open
    ? en
      ? "Close navigation"
      : "关闭导航"
    : en
      ? "Open navigation"
      : "打开导航";
  mobile.hidden = !open;
}
const closeMenu = () => menu && setMenu(false);
menu?.addEventListener("click", () =>
  setMenu(menu.getAttribute("aria-expanded") !== "true"),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu?.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener("focusin", (e) => {
  if (!e.target.closest(".header")) closeMenu();
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".header")) closeMenu();
});
matchMedia("(min-width:761px)").addEventListener("change", (e) => {
  if (e.matches) closeMenu();
});
const still = matchMedia("(prefers-reduced-motion: reduce)");
const readout = document.querySelector("[data-t]");
const reel = document.querySelector("[data-reel]");
const track = reel?.querySelector("[data-reel-track]");
const reelItems = [...(track?.children || [])];
const film = document.querySelector("[data-film]");
// The whole page is one integration: t is 0 at the top and 1 at the bottom.
function onScroll() {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
  // Over the film's blue plate the header switches to the plate's ink.
  header?.classList.toggle(
    "on-plate",
    !!film && film.getBoundingClientRect().bottom > header.offsetHeight,
  );
  const span = document.documentElement.scrollHeight - innerHeight;
  const t = span > 0 ? Math.min(1, Math.max(0, scrollY / span)) : 1;
  if (readout) readout.textContent = `t = ${t.toFixed(2)}`;
  document.documentElement.style.setProperty("--t", t.toFixed(4));
  if (reel && track && reel.classList.contains("is-pinned")) {
    const r = reel.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    track.style.translate = `${-p * (track.scrollWidth - track.clientWidth)}px 0`;
  }
  // Each photo develops from cyanotype into colour near the middle.
  if (reelItems.length && !still.matches)
    for (const item of reelItems) {
      const r = item.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - innerWidth / 2) / innerWidth;
      item.style.setProperty("--dev", Math.max(0, 1 - d * 1.5).toFixed(3));
    }
}
track?.addEventListener("scroll", onScroll, { passive: true });
// The photo reel pins and slides sideways as you scroll down, when there is
// room for it; otherwise it stays a horizontally scrollable strip.
function sizeReel() {
  if (!reel || !track) return;
  const pin = !still.matches && innerWidth > 760;
  reel.classList.toggle("is-pinned", pin);
  track.style.translate = "";
  reel.style.height = pin
    ? `${innerHeight + track.scrollWidth - track.clientWidth}px`
    : "";
}
sizeReel();
addEventListener("resize", () => {
  sizeReel();
  onScroll();
});
still.addEventListener("change", sizeReel);
for (const img of track?.querySelectorAll("img") || [])
  if (!img.complete) img.addEventListener("load", sizeReel, { once: true });
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();
for (const list of document.querySelectorAll("[data-work-index]")) {
  let lastX = 0;
  let tilt = 0;
  list.addEventListener("pointermove", (e) => {
    const box = list.getBoundingClientRect();
    // Keep the preview (360px wide, offset 32px) inside the list.
    const x = Math.min(e.clientX - box.left, box.width - 400);
    list.style.setProperty("--peek-x", `${x}px`);
    list.style.setProperty("--peek-y", `${e.clientY - box.top}px`);
    // Lean the preview into the direction of travel.
    tilt =
      tilt * 0.7 + Math.max(-8, Math.min(8, (e.clientX - lastX) * 0.4)) * 0.3;
    lastX = e.clientX;
    list.style.setProperty("--peek-tilt", `${still.matches ? 0 : tilt}deg`);
  });
}
document.querySelector("[data-backtop]")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
      ? "instant"
      : "smooth",
  });
});
const durationToken = getComputedStyle(document.documentElement)
  .getPropertyValue("--feedback-duration")
  .trim();
const feedbackDuration =
  Number.parseFloat(durationToken) *
    (durationToken.endsWith("ms") ? 1 : 1000) || 2500;
function copyFeedback(button, getText, idle, failure) {
  let timer,
    revision = 0;
  button.textContent = idle;
  button.setAttribute("aria-live", "polite");
  button.setAttribute("aria-atomic", "true");
  button.addEventListener("click", async () => {
    const current = ++revision;
    clearTimeout(timer);
    button.dataset.copyState = "pending";
    button.textContent = "正在复制…";
    try {
      await navigator.clipboard.writeText(getText());
      if (current !== revision) return;
      button.dataset.copyState = "success";
      button.textContent = "已复制 ✓";
    } catch {
      if (current !== revision) return;
      button.dataset.copyState = "error";
      button.textContent = failure;
    }
    timer = setTimeout(() => {
      button.textContent = idle;
      delete button.dataset.copyState;
    }, feedbackDuration);
  });
}
const copyLink = document.querySelector("[data-copy-link]");
if (copyLink)
  copyFeedback(copyLink, () => location.href, "复制链接", "复制失败，重试");
for (const pre of document.querySelectorAll(".prose pre")) {
  pre.tabIndex = 0;
  const code = pre.querySelector("code");
  if (code && !code.classList.contains("language-mermaid")) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code";
    copyFeedback(button, () => code.textContent, "复制代码", "复制失败，重试");
    pre.append(button);
  }
}
// Wide tables and formulas scroll sideways, so keyboards must reach them.
// Re-check once fonts settle, since KaTeX widths change when they load.
function focusOverflow() {
  for (const el of document.querySelectorAll(
    ".prose table,.prose .katex-display,.prose p>.katex",
  ))
    if (el.scrollWidth > el.clientWidth + 1) el.tabIndex = 0;
}
focusOverflow();
document.fonts?.ready.then(focusOverflow);
addEventListener("load", focusOverflow);
const progress = document.querySelector(".progress span");
if (progress) {
  const update = () => {
    const end =
      document.querySelector(".reader-end")?.offsetTop ||
      document.body.scrollHeight;
    progress.style.width =
      Math.max(
        0,
        Math.min(
          100,
          (window.scrollY / Math.max(1, end - innerHeight * 0.5)) * 100,
        ),
      ) + "%";
  };
  document.addEventListener("scroll", update, { passive: true });
  update();
  if (innerWidth < 961) {
    const toc = document.querySelector(".toc details");
    if (toc) toc.open = false;
  }
  const links = new Map(
    [...document.querySelectorAll(".toc nav a")].map((a) => [
      decodeURIComponent(a.hash.slice(1)),
      a,
    ]),
  );
  if (links.size) {
    const seen = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id);
        const first = [...links.keys()].find((id) => seen.has(id));
        if (first)
          for (const [id, a] of links)
            a.classList.toggle("is-active", id === first);
      },
      { rootMargin: "-64px 0px -60% 0px" },
    );
    for (const id of links.keys()) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
  }
}
const library = document.querySelector("[data-library]");
if (library) {
  const search = library.querySelector("input[type=search]");
  const topic = library.querySelector("select");
  const radios = [...library.querySelectorAll("input[name=type]")];
  const cards = [...library.querySelectorAll("[data-entry]")];
  const count = library.querySelector("[data-result-count]");
  const empty = library.querySelector(".empty");
  let index = null;
  let indexPromise;
  let composing = false;
  let timer;
  const retry = library.querySelector("[data-retry-search]");
  const loadIndex = () =>
    (indexPromise ??= fetch("/search-index.json")
      .then((r) => {
        if (!r.ok) throw Error("Search unavailable");
        return r.json();
      })
      .then(
        (data) =>
          (index = new Map(
            data.map((p) => [
              p.slug,
              `${p.title} ${p.plain} ${p.topic}`.toLocaleLowerCase(),
            ]),
          )),
      )
      .catch((error) => {
        indexPromise = undefined;
        throw error;
      }));
  function restore() {
    const params = new URLSearchParams(location.search);
    search.value = params.get("q") || "";
    topic.value = params.get("topic") || "";
    const type = params.get("type") || "all";
    radios.forEach((r) => (r.checked = r.value === type));
    if (!radios.some((r) => r.checked)) radios[0].checked = true;
  }
  let revision = 0;
  async function update(write = true) {
    if (composing) return;
    const current = ++revision;
    const q = search.value.trim().toLocaleLowerCase();
    const type = radios.find((r) => r.checked).value;
    const selected = topic.value;
    let failed = false;
    if (q && !index) {
      library.setAttribute("aria-busy", "true");
      count.textContent = "正在载入全文索引…";
    }
    if (q && !index)
      try {
        await loadIndex();
      } catch {
        failed = true;
      }
    if (current !== revision) return;
    library.setAttribute("aria-busy", "false");
    if (!failed && document.activeElement === retry)
      search.focus({ preventScroll: true });
    retry.hidden = !failed;
    let total = 0;
    const words = q.split(/\s+/).filter(Boolean);
    for (const card of cards) {
      const hay =
        index?.get(card.dataset.entry) || card.textContent.toLocaleLowerCase();
      const visible =
        (type === "all" || card.dataset.type === type) &&
        (!selected || card.dataset.topic === selected) &&
        words.every((w) => hay.includes(w));
      card.hidden = !visible;
      if (visible) total++;
    }
    for (const shelf of library.querySelectorAll("[data-shelf]"))
      shelf.hidden = !shelf.querySelector("[data-entry]:not([hidden])");
    count.textContent = `找到 ${total} 篇文字${failed ? "（全文暂不可用，当前按标题与摘要搜索）" : ""}`;
    empty.hidden = total > 0;
    if (write) {
      const params = new URLSearchParams();
      if (q) params.set("q", search.value.trim());
      if (type !== "all") params.set("type", type);
      if (selected) params.set("topic", selected);
      history.replaceState(
        null,
        "",
        location.pathname + (params.size ? "?" + params : ""),
      );
    }
  }
  restore();
  update(false);
  search.addEventListener("compositionstart", () => {
    composing = true;
    revision++;
    clearTimeout(timer);
    library.setAttribute("aria-busy", "false");
  });
  search.addEventListener("compositionend", () => {
    composing = false;
    clearTimeout(timer);
    timer = setTimeout(update, 90);
  });
  search.addEventListener("input", (event) => {
    clearTimeout(timer);
    if (!composing && !event.isComposing) timer = setTimeout(update, 90);
  });
  search.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" &&
      (composing || event.isComposing || event.keyCode === 229)
    )
      event.preventDefault();
  });
  retry.addEventListener("click", () => {
    clearTimeout(timer);
    update();
  });
  topic.addEventListener("change", () => update());
  radios.forEach((r) => r.addEventListener("change", () => update()));
  library.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    if (!composing) update();
  });
  library.querySelector("[data-clear-search]").addEventListener("click", () => {
    composing = false;
    clearTimeout(timer);
    search.value = "";
    topic.value = "";
    radios[0].checked = true;
    update();
    search.focus();
  });
  window.addEventListener("popstate", () => {
    restore();
    update(false);
  });
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      !e.isComposing &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !document.activeElement.closest(
        "input,textarea,select,[contenteditable]:not([contenteditable=false])",
      )
    ) {
      e.preventDefault();
      search.focus();
    }
  });
}
const dialog = document.querySelector(".lightbox");
if (dialog) {
  const photos = [...document.querySelectorAll("[data-photo]")];
  let current = 0;
  let opener = null;
  let imageRevision = 0;
  let savedOverflow = "";
  const image = dialog.querySelector("img");
  const figure = dialog.querySelector("figure");
  const status = dialog.querySelector("[data-gallery-status]");
  const retryPhoto = dialog.querySelector("[data-gallery-retry]");
  function show(i) {
    current = (i + photos.length) % photos.length;
    const p = photos[current],
      request = ++imageRevision;
    dialog.dataset.imageState = "loading";
    figure.setAttribute("aria-busy", "true");
    status.hidden = false;
    status.textContent = "正在载入照片…";
    if (document.activeElement === retryPhoto)
      dialog.querySelector(".lightbox-next").focus({ preventScroll: true });
    retryPhoto.hidden = true;
    image.alt = p.dataset.alt;
    dialog.querySelector("figcaption").textContent = p.dataset.caption;
    dialog.querySelector(".lightbox-count").textContent =
      String(current + 1).padStart(2, "0") +
      " / " +
      String(photos.length).padStart(2, "0");
    const pending = new Image();
    pending.onload = () => {
      if (request !== imageRevision) return;
      image.src = p.dataset.src;
      image.width = pending.naturalWidth;
      image.height = pending.naturalHeight;
      dialog.dataset.imageState = "ready";
      figure.setAttribute("aria-busy", "false");
      status.hidden = true;
      if (!retryPhoto.hidden && document.activeElement === retryPhoto)
        dialog.querySelector(".lightbox-next").focus();
      retryPhoto.hidden = true;
    };
    pending.onerror = () => {
      if (request !== imageRevision) return;
      dialog.dataset.imageState = "error";
      figure.setAttribute("aria-busy", "false");
      status.textContent = "照片暂未载入，请重试或切换其他照片。";
      retryPhoto.hidden = false;
    };
    pending.src = p.dataset.src;
  }
  retryPhoto.addEventListener("click", () => show(current));
  photos.forEach((p, i) =>
    p.addEventListener("click", () => {
      opener = p;
      show(i);
      dialog.showModal();
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }),
  );
  dialog
    .querySelector(".lightbox-close")
    .addEventListener("click", () => dialog.close());
  dialog
    .querySelector(".lightbox-prev")
    .addEventListener("click", () => show(current - 1));
  dialog
    .querySelector(".lightbox-next")
    .addEventListener("click", () => show(current + 1));
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      show(current - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      show(current + 1);
    }
  });
  dialog.addEventListener("close", () => {
    imageRevision++;
    document.body.style.overflow = savedOverflow;
    opener?.focus({ preventScroll: true });
  });
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
}
const diagrams = [...document.querySelectorAll("pre>code.language-mermaid")];
if (diagrams.length) {
  import("mermaid")
    .then(async ({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        themeVariables: {
          primaryColor: "#e3ebfb",
          primaryTextColor: "#0d1b36",
          primaryBorderColor: "#1b3f8b",
          lineColor: "#5b6880",
          fontFamily: getComputedStyle(document.body).fontFamily,
        },
        suppressErrorRendering: true,
      });
      for (const [i, code] of diagrams.entries()) {
        const pre = code.parentElement;
        try {
          const { svg } = await mermaid.render(
            "archive-diagram-" + i,
            code.textContent,
          );
          const wrap = document.createElement("div");
          wrap.className = "mermaid-wrap";
          wrap.innerHTML = svg;
          const details = document.createElement("details");
          const summary = document.createElement("summary");
          summary.textContent = "查看图表源代码";
          details.append(summary, pre.cloneNode(true));
          wrap.append(details);
          pre.replaceWith(wrap);
        } catch {
          const note = document.createElement("p");
          note.className = "notice";
          note.textContent = "图表以可阅读的源代码显示。";
          pre.before(note);
        }
      }
    })
    .catch(() => {
      for (const code of diagrams)
        code.parentElement.setAttribute("aria-label", "图表源代码");
    });
}
