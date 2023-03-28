import shell from "shelljs";
import fs from "fs";
import crypto from "crypto";

/**
 * 获取diff文件信息
 * @returns
 */
export const getDiff = () => {
  let gitDiffComd = "git diff --cached";

  const res = shell.exec(gitDiffComd);

  const diffList = getFileDiffInfo(res.stdout);

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

export const getFileDiffInfo = (diffLog) => {
  if (!diffLog) {
    return [];
  }
  const list = [];
  const fileReg = /^diff --git [a-z]\/([^\s]*)/gm,
    indexReg = /^index ([^\.]*..[^\s]*)/gm;
  let file;
  while ((file = fileReg.exec(diffLog))) {
    const filePath = file[1];
    const index = indexReg.exec(diffLog)?.[1];
    if (filePath && index) {
      list.push({
        filePath,
        index,
        status: getIndexStatus(index),
      });
    }
  }
  return list;
};

export const getIndexStatus = (index) => {
  if (!index) {
    return undefined;
  }
  const allZero = /^0+$/;
  const [oldIndex, newIndex] = index.split("..");

  if (allZero.test(oldIndex)) {
    return "add";
  }

  if (allZero.test(newIndex)) {
    return "delete";
  }

  return "update";
};
