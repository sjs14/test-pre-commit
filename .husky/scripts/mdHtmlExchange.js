import fs from "fs";
import { marked } from "marked";
import { toMarkdown } from "./to-markdown.js";

/**
 * markdown转html
 * @param {*} pathOrCode
 * @param {*} opt.type pathOrCode类型，code为代码，默认为文件路径
 * @param {*} opt.output 输出路径，可选
 * @returns
 */
export const md2html = (pathOrCode, opt = {}) => {
  // 不是code就是文件路径，需要读取内容
  if (opt.type !== "code") {
    pathOrCode = fs.readFileSync(pathOrCode, "utf8");
  }

  if (opt.output) {
    fs.writeFileSync(opt.output, pathOrCode);
  }

  return marked(pathOrCode);
};

/**
 * html转markdown
 * @param {*} pathOrCode
 * @param {*} opt.type pathOrCode类型，code为代码，默认为文件路径
 * @param {*} opt.output 输出路径，可选
 * @returns
 */
export const html2md = (pathOrCode, opt = {}) => {
  // 不是code就是文件路径，需要读取内容
  if (opt.type !== "code") {
    pathOrCode = fs.readFileSync(pathOrCode, "utf8");
  }

  if (opt.output) {
    fs.writeFileSync(opt.output, pathOrCode);
  }
  return toMarkdown(pathOrCode);
};
