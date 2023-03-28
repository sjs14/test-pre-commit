import shell from "shelljs";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import dayjs from "dayjs";
import prettier from "prettier";
import chalk from "chalk";
import { getDiff } from "./gitDiff.js";
import { generateNewCommitMd, getHashListFromMd } from "./dom.js";
import { fileHashEjsTpl } from "./dom.js";
const changeLogPath = path.resolve(process.cwd(), "CHANGELOG.md");
const currentCommitLogPath = path.resolve(process.cwd(), "changeset.md");

// diff log提取的数组
const diffList = getDiff();
// 从changeset.md获取现有的文件index和文件改动目的
const existHashList = getHashListFromMd(currentCommitLogPath);

// 先看看有没有改变CHANGELOG.md，强制删除则先注释
diffList.some((item) => {
  if (item.filePath.indexOf("CHANGELOG.md") >= 0) {
    console.log(chalk.bold.red(`文件 ${changeLogPath} 不允许手动更改！`));
    process.exit(1);
  }
});

// 判断是否存在diff文件没有没记录改动目的
let hasNotExist = false;
const goalReg = /^改动目的：.+/;
for (let i = 0; i < diffList.length; i++) {
  const item = diffList[i];
  // 强制删除CHANGELOG.md请开启
  // if (item.filePath.indexOf("CHANGELOG.md") >= 0) {
  //   continue;
  // }

  // 获取文件hash文本
  const newHashStr = ejs.render(fileHashEjsTpl, item);

  // 判断diff在changeset.md中是否存在
  const existIndex = Array.from(existHashList).findIndex(
    (existI) => existI.hash === newHashStr
  );

  // 存在的话，改动目标是否已经填写
  if (existIndex >= 0) {
    const goal = existHashList[existIndex].goal.innerHTML.trim();
    if (goalReg.test(goal)) {
      continue;
    }
  }

  hasNotExist = true;
  break;
}

if (hasNotExist) {
  // 声场最新的changeset.md内容，保留文件index不变且已经填写的改动目的
  const mdStr = generateNewCommitMd(diffList, currentCommitLogPath);
  fs.writeFileSync(currentCommitLogPath, mdStr);
  // 提醒还有未填写改动目的的文件
  console.log(
    chalk.bold.yellowBright(
      `\n请在文件 ${currentCommitLogPath} 中，\n将文件对应的改动目的补充完整，再执行提交。\n`
    )
  );
  process.exit(1);
} else {
  // 组装最新的CHANGELOG.md
  const oldLog = fs.existsSync(changeLogPath)
    ? fs.readFileSync(changeLogPath, "utf8")
    : "";
  const currentLog = fs.existsSync(currentCommitLogPath)
    ? fs.readFileSync(currentCommitLogPath, "utf8")
    : "";
  if (currentLog) {
    fs.writeFileSync(
      changeLogPath,
      prettier.format(
        `## commit 时间：${dayjs().format(
          "YYYY-MM-DD HH:mm:ss"
        )}\n${currentLog}\n\n\n${oldLog}`,
        { parser: "markdown" }
      )
    );
  }

  shell.exec("git add .");
  shell.rm(currentCommitLogPath);
}
