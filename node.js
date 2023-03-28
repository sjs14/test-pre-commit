import shell from "shelljs";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const res = shell.exec("git diff --cached --name-only");

const diffFiles = res.stdout.split("\n").filter((i) => i);

diffFiles.forEach((file) => {
  const buffer = fs.readFileSync(path.join(getDirname(), file));
  const hash = crypto.createHash("md5");
  hash.update(buffer, "utf8");
  const md5 = hash.digest("hex");
  console.log(1,file, md5);
});

function getDirname(params) {
  const __dirname = dirname(getFilename());
  return __dirname;
}

function getFilename() {
  const __filename = fileURLToPath(import.meta.url);
  return __filename;
}
