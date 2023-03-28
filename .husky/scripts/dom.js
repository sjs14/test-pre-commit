import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { md2html } from "./mdHtmlExchange.js";

export const getDocument = (htmlStr) => {
  const dom = new JSDOM(htmlStr);
  return dom.window.document;
};

export const getHashListFromMd = () => {
  const code = fs.readFileSync(
    path.resolve(process.cwd(), "CHANGELOG.md"),
    "utf8"
  );
  const html = md2html(code, { type: "code" });

  const document = getDocument(html);

  return Array.from(document.querySelectorAll("h4")).reduce((list, item) => {
    list.push(item.innerHTML);
    return list;
  }, []);
};
