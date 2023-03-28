import prettier from "prettier";
import shell from "shelljs";
import path from "path";
import fs from "fs";

const code = fs.readFileSync(
  path.resolve(process.cwd(), "CHANGELOG.md"),
  "utf8"
);

fs.writeFileSync(
  path.resolve(process.cwd(), "CHANGELOG-format.md"),
  prettier.format(code, { parser: "markdown" })
);

// shell.exec("git add .");
// shell.exec("git commit -m ''");
