import shell from "shelljs";
import path from "path";

// const code = fs.readFileSync(
//   path.resolve(process.cwd(), "CHANGELOG.md"),
//   "utf8"
// );


shell.exec(`npx prettier --write --ignore-unknown   ${path.resolve(process.cwd(), "CHANGELOG.md")}`)

shell.exec('git add .')