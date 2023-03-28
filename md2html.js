import {markdown} from 'markdown'
import {marked} from 'marked'
import fs from "fs";

const code = fs.readFileSync("./CHANGELOG.md", "utf8");




// console.log(markdown.parse(code));
// fs.writeFileSync("./CHANGELOG-json.json", JSON.stringify(markdown.toHTML(code)))
// fs.writeFileSync("./CHANGELOG-html.html", markdown.toHTML(code))
fs.writeFileSync("./CHANGELOG-html.html", marked(code))