#!/usr/bin/env zx

import WATCH_LIST from './PATH.js'

WATCH_LIST.forEach(async ({systemPath, relativePath}) => {
  // 将系统文件复制到本地目录
  await $`cp ${systemPath} ${relativePath}`
})

// 上传到github

// await $`cat package.json | grep type`

// let branch = await $`git branch --show-current`
// await $`dep deploy --branch=${branch}`

// await Promise.all([
//   $`sleep 1; echo 1`,
//   $`sleep 2; echo 2`,
//   $`sleep 3; echo 3`,
// ])

// let name = 'foo bar'
// await $`mkdir /tmp/${name}`