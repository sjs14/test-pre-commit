import fs from "fs";
import path from "path";
import ejs from "ejs";
import { JSDOM } from "jsdom";
import { html2md, md2html } from "./md.js";

// 文件hash字符串模板
export const fileHashEjsTpl =
  "文件hash：<%= index %> - <code><%= status %></code>";

/**
 * html字符串转模拟dom，可以使用dom的api进行操作，返回顶层对象
 * @param {*} htmlOrPath html字符串或者文件路径
 * @param {*} opt.type htmlOrPath类型，code为代码，默认为文件路径
 * @returns
 */
export const getDocument = (htmlOrPath, opt = {}) => {
  if (opt.type !== "code") {
    htmlOrPath = fs.readFileSync(htmlOrPath, "utf8");
  }
  const dom = new JSDOM(htmlOrPath);
  return dom.window.document;
};

/**
 * 从log的markdown文件中提取文件index和文件改动目标
 * @param {*} path log的markdown文件路径
 * @returns
 */
export const getHashListFromMd = (path) => {
  if (!fs.existsSync(path)) return [];
  const code = fs.readFileSync(path, "utf8");
  const html = md2html(code, { type: "code" });

  const document = getDocument(html, { type: "code" });

  return Array.from(document.querySelectorAll("h4")).reduce((list, item) => {
    list.push({
      hash: item.innerHTML,
      goal: item.nextElementSibling || item.nextSibling,
    });
    return list;
  }, []);
};

/**
 * 生成changeset.md的内容，保留已有changeset相同文件index的改动目标
 * @param {*} diffList git diff提取的数据
 * @returns
 */
export const generateNewCommitMd = (diffList) => {
  if (!diffList) return "";
  const currentCommitLogPath = path.resolve(process.cwd(), "changeset.md");
  const existHashList = fs.existsSync(currentCommitLogPath)
    ? getHashListFromMd(currentCommitLogPath)
    : [];
  let mdCode = "";
  diffList.forEach((item) => {
    // CHANGELOG.md 不做校验
    if (item.filePath.indexOf("CHANGELOG.md") >= 0) {
      return;
    }
    const newHashStr = ejs.render(fileHashEjsTpl, item);
    let goalFromSameIndex = "";
    const hasIndexNumber = Array.from(existHashList).findIndex(
      (existI) => existI.hash === newHashStr
    );

    if (hasIndexNumber >= 0) {
      const goal = existHashList[hasIndexNumber].goal.innerHTML.trim();
      const goalReg = /^改动目的：.+/;
      if (goalReg.test(goal)) {
        goalFromSameIndex = goal;
      }
    }

    mdCode += `### 文件：${item.filePath}\n#### ${html2md(
      ejs.render(fileHashEjsTpl, item),
      { type: "code" }
    ).trim()}\n${goalFromSameIndex || "改动目的："}\n\n`;
  });
  return mdCode;
};
