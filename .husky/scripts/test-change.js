import shell from "shelljs";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import prettier from "prettier";
import { getDiff } from "./gitDiff.js";
import { generateNewCommitMd, getHashListFromMd } from "./dom.js";
import { fileHashEjsTpl } from "./ejs.js";
const changeLogPath = path.resolve(process.cwd(), "CHANGELOG.md");
const currentCommitLogPath = path.resolve(process.cwd(), "changeset.md");

shell.exec(
  `npx prettier --write --ignore-unknown ${path.resolve(
    process.cwd(),
    "CHANGELOG.md"
  )}`
);

const diffList = getDiff();

const existHashList = getHashListFromMd(currentCommitLogPath);

// 先看看有没有改变CHANGELOG.md
diffList.some((item) => {
  if (item.filePath.indexOf("CHANGELOG.md") >= 0) {
    console.log(`文件 ${changeLogPath} 不允许手动更改`);
    process.exit(1);
  }
});

const noExist = diffList.some((item) => {
  const newHashStr = ejs.render(fileHashEjsTpl, item);

  const hasIndexNumber = Array.from(existHashList).findIndex(
    (existI) => existI.hash === newHashStr
  );

  if (hasIndexNumber >= 0) {
    const goal = existHashList[hasIndexNumber].goal.innerHTML.trim();
    const goalReg = /^改动目的：.+/;
    if (goalReg.test(goal)) {
      // 有的就跳过进入下一个
      return false;
    }
  }

  //   第一个不存在就返回
  return true;
});
if (noExist) {
  const mdStr = generateNewCommitMd(diffList);
  // TODO: 保留已有不变的goal
  fs.writeFileSync(currentCommitLogPath, mdStr);
  console.log(
    `\n请在文件 ${currentCommitLogPath} 中，将文件对应的改动目的补充完整，再进行提交\n`
  );
  process.exit(1);
} else {
  const oldLog = fs.existsSync(changeLogPath)
    ? fs.readFileSync(changeLogPath, "utf8")
    : "";
  const currentLog = fs.readFileSync(currentCommitLogPath, "utf8");
  fs.writeFileSync(
    changeLogPath,
    prettier.format(`${currentLog}\n${oldLog}`, { parser: "markdown" })
  );

  shell.exec("git add .");
}
