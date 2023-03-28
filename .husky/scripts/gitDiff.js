import shell from "shelljs";
import path from "path";
import fs from "fs";
import crypto from "crypto";

export const getDiff = () => {
  const diffList = [];
  const res = shell.exec("git diff --cached --name-only");
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
        md5: '删除文件',
        file,
      });
    }
  });
  return diffList;
};
