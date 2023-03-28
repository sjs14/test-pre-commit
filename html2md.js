import {toMarkdown} from './scripts/to-markdown.js'
import fs from "fs";

const htmlCode = fs.readFileSync("./CHANGELOG-html.html", "utf8");





fs.writeFileSync("./CHANGELOG-md22222.md", toMarkdown(htmlCode))
