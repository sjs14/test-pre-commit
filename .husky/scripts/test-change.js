import shell from "shelljs";
import fs from "fs";
import path from "path";
import { getDiff, diffFilterMap } from "./gitDiff.js";
import { md2html } from "./mdHtmlExchange.js";
import { getDocument, getHashListFromMd } from "./dom.js";

shell.exec(
  `npx prettier --write --ignore-unknown   ${path.resolve(
    process.cwd(),
    "CHANGELOG.md"
  )}`
);

const diffMap = {};
const diffList = [];
Object.keys(diffFilterMap).forEach((key) => {
  const list = getDiff(key);
  diffMap[key] = list;
  diffList.push(...list);
});
// console.log(`🚀  diffMap:`, diffMap);

// diffMap.some({diff}=>{

// })

// console.log(1111, getHashListFromMd());

process.exit(1);
shell.exec("git add .");
