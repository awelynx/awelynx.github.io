// Chinese lives at the root; English mirrors the pages that have a translation
// under /en/. Writing and life stay Chinese-only.
import * as zhPortfolio from "./data/portfolio.js";
import * as enPortfolio from "./data/portfolio.en.js";
import * as zhResume from "./data/resume.js";
import * as enResume from "./data/resume.en.js";

export const translated = (path) =>
  path === "/" || /^\/(about|work)(\/|$)/.test(path);

// The URL of a page in the given language; untranslated pages stay Chinese.
export const localPath = (lang, path) =>
  lang === "en" && translated(path) ? "/en" + path : path;

export const portfolio = { zh: zhPortfolio, en: enPortfolio };
export const resume = { zh: zhResume, en: enResume };

export const ui = {
  zh: {
    htmlLang: "zh-CN",
    siteTitle: "林煜轩 Yuxuan Lin",
    nameSuffix: "林煜轩",
    skip: "跳到主要内容",
    navLabel: "主导航",
    mobileNavLabel: "移动端导航",
    openMenu: "打开导航",
    nav: { work: "作品", writing: "写作", life: "生活", about: "关于" },
    zhOnly: "",
    switchLabel: "English",
    switchText: "EN",
    footerPitch: "聊聊 AI、系统，或一个尚未成形的想法。",
    backTop: "回到顶部",
    feedTitle: "林煜轩 · 写作",
    facts: "简介",
    now: "现在",
    undergrad: "本科",
    paper: "论文",
    dualDegree: "ZJU–UIUC 双学位项目",
    work: "作品",
    allProjects: (n) => `全部 ${n} 个项目`,
    writing: "写作",
    allWriting: (n) => `全部 ${n} 篇文字`,
    writingNote: "",
    routesLead: "从一个问题开始",
    life: "生活",
    workLead:
      "从生成式模型到 GPU 内核与操作系统。每个项目写清问题、关键取舍与结果，以及我在团队中的部分。",
    allWork: "全部项目",
    // Text before and after the link to the About page.
    workFootnote: (names) => [
      `还有 ${names}，记录在`,
      "页。项目数据根据个人简历整理，属于对应项目和测试场景中的结果。",
    ],
    aboutWord: "关于",
    allWorkBack: "所有作品",
    caseMeta: { category: "方向", year: "时间", tags: "技术", links: "链接" },
    tagJoin: "、",
    source: "源代码 ↗",
    paperLink: "论文 ↗",
    problem: "问题",
    decisions: "关键取舍",
    outcome: "结果",
    relatedNotes: "相关笔记",
    nextProject: "下一个项目",
    workTitle: "作品",
    aboutTitle: "关于",
    aboutDescription: "林煜轩的教育、研究、工程经历与联系信息。",
  },
  en: {
    htmlLang: "en",
    siteTitle: "Yuxuan Lin 林煜轩",
    nameSuffix: "Yuxuan Lin",
    skip: "Skip to main content",
    navLabel: "Main navigation",
    mobileNavLabel: "Mobile navigation",
    openMenu: "Open navigation",
    nav: { work: "Work", writing: "Writing", life: "Life", about: "About" },
    zhOnly: "Chinese",
    switchLabel: "中文",
    switchText: "中",
    footerPitch:
      "Talk to me about AI, systems, or an idea that isn't fully formed yet.",
    backTop: "Back to top",
    feedTitle: "Yuxuan Lin · Writing (Chinese)",
    facts: "Overview",
    now: "Now",
    undergrad: "Undergraduate",
    paper: "Paper",
    dualDegree: "ZJU–UIUC dual-degree program",
    work: "Work",
    allProjects: (n) => `All ${n} projects`,
    writing: "Writing",
    allWriting: (n) => `All ${n} pieces (Chinese)`,
    writingNote: "My notes and articles are written in Chinese.",
    routesLead: "Start from a question",
    life: "Life",
    workLead:
      "From generative models to GPU kernels and operating systems. Each project sets out the problem, the key decisions and the result, and which part was mine.",
    allWork: "All projects",
    workFootnote: (names) => [
      `There is also ${names}, listed on the `,
      " page. Figures come from my resume and hold for each project's own setup and tests.",
    ],
    aboutWord: "About",
    allWorkBack: "All work",
    caseMeta: { category: "Area", year: "Year", tags: "Stack", links: "Links" },
    tagJoin: ", ",
    source: "Source ↗",
    paperLink: "Paper ↗",
    problem: "Problem",
    decisions: "Key decisions",
    outcome: "Outcome",
    relatedNotes: "Related notes (Chinese)",
    nextProject: "Next project",
    workTitle: "Work",
    aboutTitle: "About",
    aboutDescription:
      "Yuxuan Lin's education, research, engineering experience and contact details.",
  },
};
