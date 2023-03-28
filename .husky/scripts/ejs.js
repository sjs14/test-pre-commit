export const fileHashEjsTpl = "文件hash：<%= hash %> - （<%= status %>）";
export const fileHashReg = fileHashEjsTpl
  .replace(/<[^>]*>/, "([0-9a-z]*)")
  .replace(/（<[^>]*>）/, "");

console.log(fileHashReg);
