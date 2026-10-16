// メンバー共有用 PDF を share/ に生成する。
// 使い方: NODE_PATH=/opt/node-tools/node_modules node scripts/build_share_pdfs.mjs
// 元の .md は変更しない。PDF 用の加工（オーナー用の章を外す、ファイル名を資料名に置き換える）はここで行う。

import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const DOCS = [
  { src: "project.md", out: "share/Rism_プロジェクト概要.pdf", title: "Rism プロジェクト概要" },
  {
    src: "kickoff.md",
    out: "share/Rism_キックオフ資料.pdf",
    title: "Rism キックオフミーティング資料",
    // 5章（オーナーの事前準備チェックリスト）を外し、6章を5章に繰り上げる
    transform: (md) =>
      md
        .replace(/## 5\. オーナーの事前準備チェックリスト[\s\S]*?\n---\n\n/, "")
        .replace("## 6. アルファ週のあと", "## 5. アルファ週のあと"),
  },
];

// ファイル名を、PDF を受け取る人にわかる資料名に置き換える
function toShareText(md) {
  return md
    .replace("（`recruit.md` / `recruitdocument.pdf` / `recruitslide.pdf`）", "")
    .replaceAll("`project.md`", "「プロジェクト概要」")
    .replaceAll("`kickoff.md`", "「キックオフ資料」")
    .replaceAll("`dev_survey.md`", "開発希望者アンケート")
    .replace(/\[([^\]]+)\]\(#[^)]+\)/g, "「$1」");
}

const CSS = `
@page { size: A4; margin: 16mm 14mm 18mm; }
body { font-family: "IPAGothic", sans-serif; font-size: 10pt; line-height: 1.65; color: #1f2328; }
h1 { font-size: 18pt; border-bottom: 2px solid #3b6e4f; padding-bottom: 4px; margin: 0 0 10px; }
h2 { font-size: 13.5pt; color: #2f5a40; border-left: 5px solid #3b6e4f; padding-left: 8px; margin: 22px 0 8px; break-after: avoid; }
h3 { font-size: 11pt; margin: 16px 0 6px; break-after: avoid; }
table { border-collapse: collapse; width: 100%; margin: 8px 0 12px; font-size: 9pt; }
th, td { border: 1px solid #c9d1d9; padding: 4px 6px; vertical-align: top; text-align: left; }
th { background: #eef4f0; }
td:first-child, th:first-child { min-width: 6.5em; }
tr { break-inside: avoid; }
pre { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 8px 10px; font-size: 8.5pt; white-space: pre-wrap; break-inside: avoid; }
code { font-family: "IPAGothic", monospace; background: #f3f4f6; padding: 0 3px; border-radius: 3px; }
pre code { background: none; padding: 0; }
hr { border: none; border-top: 1px solid #d0d7de; margin: 16px 0; }
blockquote { border-left: 4px solid #d0d7de; margin: 8px 0; padding: 2px 10px; color: #57606a; }
ul.task-list, ul.contains-task-list { list-style: none; padding-left: 1.2em; }
`;

mkdirSync("share", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();

for (const doc of DOCS) {
  let md = readFileSync(doc.src, "utf8");
  if (doc.transform) md = doc.transform(md);
  md = toShareText(md);
  const body = execFileSync("pandoc", ["-f", "gfm", "-t", "html5"], { input: md }).toString();
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>${doc.title}</title><style>${CSS}</style></head><body>${body}</body></html>`;
  await page.setContent(html, { waitUntil: "load" });
  await page.pdf({
    path: doc.out,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: `<div style="width:100%;font-size:8px;color:#888;text-align:center;font-family:IPAGothic;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
  });
  console.log("wrote", doc.out);
}

await browser.close();
