import { unified } from "unified";
import fs from "fs";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
const code = fs.readFileSync("./CHANGELOG.md", "utf8");

main(code);

async function main(code) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(code);
  console.log(111,file.value);
  main2(file)
}

async function main2(html) {
  const file = await unified()
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkStringify, {
      bullet: "*",
      fence: "~",
      fences: true,
      incrementListMarker: false,
    })
    .process(html.value);

  console.log(222,file.value);
}
