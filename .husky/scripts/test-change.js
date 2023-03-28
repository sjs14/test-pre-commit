import shell from "shelljs";
import path from "path";
import { getDiff } from "./gitDiff.js";
// const code = fs.readFileSync(
//   path.resolve(process.cwd(), "CHANGELOG.md"),
//   "utf8"
// );

shell.exec(
  `npx prettier --write --ignore-unknown   ${path.resolve(
    process.cwd(),
    "CHANGELOG.md"
  )}`
);

const diffList = getDiff()
console.log(`🚀  diffList:`, diffList)


process.exit(1);
shell.exec("git add .");
