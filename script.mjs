#!/usr/bin/env zx

const { recommendations } = await fs.readJson('./vscode/extensions.json')

recommendations.forEach(async name => {
  console.log(chalk.cyan(name))
  await $`code --install-extension ${name}`
})
