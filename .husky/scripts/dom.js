import fs from "fs";
import path from "path";
import ejs from "ejs";
import { JSDOM } from "jsdom";
import { html2md, md2html } from "./mdHtmlExchange.js";
import { fileHashEjsTpl } from "./ejs.js";

export const getDocument = (htmlOrPath, opt = {}) => {
  if (opt.type !== "code") {
    htmlOrPath = fs.readFileSync(htmlOrPath, "utf8");
  }
  const dom = new JSDOM(htmlOrPath);
  return dom.window.document;
};

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

export const generateNewCommitMd = (diffList, test = "commit msg 占位") => {
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
