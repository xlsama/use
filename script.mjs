#!/usr/bin/env zx

console.log(chalk.blue('npm install global dependencies'));
await $`npm i -g zx whistle pnpm @antfu/ni upload-image-from-clipboard vite tldr`;

console.log(chalk.blue('install vscode extensions'));
const { recommendations } = await fs.readJson('./vscode/extensions.json');
recommendations.forEach(async name => {
  console.log(chalk.cyan(name));
  await $`code --install-extension ${name}`;
});

console.log(chalk.blue('remove ~/.zshrc ~/.zsh_history ./Brewfile.lock.json'));
await $`rm -rf ~/.zshrc ~/.zsh_history ./Brewfile.lock.json`;

console.log(chalk.blue('set macos system settings'));
await $`sh ./.macos`;
console.log(
  'Done. Note that some of these changes require a logout/restart to take effect.'
);
