import prettier from "prettier";
import fs from "fs";

const code = fs.readFileSync("./CHANGELOG.md", "utf8");

fs.writeFileSync("./CHANGELOG-format.md", prettier.format(code,{parser:'markdown'}));
