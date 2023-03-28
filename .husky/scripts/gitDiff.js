import shell from "shelljs";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const diffFilterMap = {
  add: "A",
  edit: "M",
  delete: "D",
};
/**
 * 
 * @param {*} type 筛选条件，只能是add | edit | delete
 * @returns 
 */
export const getDiff = (type) => {

  const diffList = [];

  const filterType =
    type && diffFilterMap[type] ? diffFilterMap[type] : undefined;

  const res = shell.exec(
    `git diff --cached --name-only${
      filterType ? ` --diff-filter=${filterType}` : ""
    }`
  );
  const diffFiles = res.stdout.split("\n").filter((i) => i);
  diffFiles.forEach((file) => {
    const targetPath = path.join(process.cwd(), file);

    if (fs.existsSync(targetPath)) {
      const buffer = fs.readFileSync(path.join(process.cwd(), file));
      const hash = crypto.createHash("md5");
      hash.update(buffer, "utf8");
      const md5 = hash.digest("hex");
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
  return diffList;
};
