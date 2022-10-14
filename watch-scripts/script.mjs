#!/usr/bin/env zx

import WATCH_LIST from "./PATH.js";
import { resolve, join } from "path";

const ROOT_DIR = resolve("..");

WATCH_LIST.forEach(async ({ systemPath, relativePath }) => {
  // 将系统文件复制到本地目录
  await $`cp ${systemPath} ${join(ROOT_DIR, relativePath)}`;
});

// 判断配置文件是否有修改
const { stdout } = await $`git status -s`;
const modifiedList = WATCH_LIST.filter(({ relativePath }) =>
  stdout.includes(relativePath)
);
if (stdout && modifiedList.length) {
  // 上传到github
  modifiedList.forEach(async ({ relativePath }) => {
    await $`git add ${join(ROOT_DIR, relativePath)}`;
  });

  const commitMessage = `chore: update ${modifiedList
    .map((item) => item.name)
    .join(" ")}`;
  await $`git commit -m ${commitMessage}`;
  await $`git push`;
}
