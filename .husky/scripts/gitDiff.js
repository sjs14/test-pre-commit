import shell from "shelljs";

/**
 * 获取diff文件信息
 * @returns
 */
export const getDiff = () => {
  let gitDiffComd = "git diff --cached";

  const res = shell.exec(gitDiffComd);

  const diffList = getFileDiffList(res.stdout);

  return diffList;
};

/**
 * 获取diff文件信息的数组
 * @param {*} diffLog git diff --cached 的log
 * @returns 
 */
export const getFileDiffList = (diffLog) => {
  if (!diffLog) {
    return [];
  }
  const list = [];
  const fileReg = /^diff --git [a-z]\/([^\s]*)/gm,
    indexReg = /^index ([^\.]*..[^\s]*)/gm;
  let file;
  while ((file = fileReg.exec(diffLog))) {
    const filePath = file[1];
    const index = indexReg.exec(diffLog)?.[1];
    if (filePath && index) {
      list.push({
        filePath,
        index,
        status: getIndexStatus(index),
      });
    }
  }
  return list;
};

/**
 * 根据index获取该文件的类型，index左边全0表示新增，右边全0表示删除，两边都有hash表示更新
 * @param {*} index git diff 获取的index
 * @returns 
 */
export const getIndexStatus = (index) => {
  if (!index) {
    return undefined;
  }
  const allZero = /^0+$/;
  const [oldIndex, newIndex] = index.split("..");

  if (allZero.test(oldIndex)) {
    return "add";
  }

  if (allZero.test(newIndex)) {
    return "delete";
  }

  return "update";
};
