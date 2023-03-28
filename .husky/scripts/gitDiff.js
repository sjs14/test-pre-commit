import shell from "shelljs";
import path from "path";
import fs from "fs";
import crypto from "crypto";

export const diffFilterMap = {
  add: {
    label: "新增",
    value: "A",
  },
  edit: {
    label: "编辑",
    value: "M",
  },
  delete: {
    label: "删除",
    value: "D",
  },
};
/**
 *
 * @param {*} type 筛选条件，只能是add | edit | delete
 * @returns
 */
export const getDiff = (type) => {
  const diffList = [];

  const filterType =
    type && diffFilterMap[type] ? diffFilterMap[type].value : undefined;

  // 组装git diff命令
  let gitDiffComd = "git diff --cached";
  if (filterType !== "D") {
    gitDiffComd += " --name-only";
  }
  if (filterType) {
    gitDiffComd += ` --diff-filter=${filterType}`;
  }
  const res = shell.exec(gitDiffComd);
  if (filterType === "D") {
    console.log(`🚀  res:`, res.stdout);
  }

  if (filterType === "D") {
    // getFileHash()
    console.log(`🚀  res:\n\n\n\n`, res.stdout, "\n\n\n\n");
  } else {
    const diffFiles = res.stdout.split("\n").filter((i) => i);
    diffFiles.forEach((file) => {
      const targetPath = path.join(process.cwd(), file);

      if (fs.existsSync(targetPath)) {
        const md5 = getFileHash(targetPath);
        console.log(`🚀  md5:`, md5);
        diffList.push({
          md5,
          file,
        });
      } else {
        diffList.push({
          md5: "删除文件",
          file,
        });
      }
    });
  }
  return diffList;
};

/**
 * 获取文件hash
 * @param {*} fileOrCode
 * @param {*} opt.type code表示fileOrCode为代码，其他表示文件路径
 */
export const getFileHash = (fileOrCode, opt = {}) => {
  if (opt.type !== "code") {
    fileOrCode = fs.readFileSync(fileOrCode, "utf8");
  }
  const hash = crypto.createHash("md5");
  hash.update(fileOrCode);
  const md5 = hash.digest("hex");

  return md5;
};
