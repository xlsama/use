#!/usr/bin/env zx

// Force zx to use bash instead of fish
$.shell = "/bin/bash";

const LINK_MAP = [
  // config
  {
    source: "~/i/use/config/fish",
    target: `~/.config/fish`,
  },
  {
    source: `~/i/use/config/nvim`,
    target: `~/.config/nvim`,
  },
  {
    source: `~/i/use/config/starship.toml`,
    target: `~/.config/starship.toml`,
  },
  // git
  {
    source: `~/i/use/git/.gitconfig`,
    target: `~/.gitconfig`,
  },
  {
    source: `~/i/use/git/.gitconfig_work`,
    target: `~/.gitconfig_work`,
  },
  {
    source: `~/i/use/git/.gitignore`,
    target: `~/.gitignore`,
  },
  // vscode
  {
    source: `~/i/use/vscode/settings.json`,
    target: `~/Library/Application Support/Code/User/settings.json`,
  },
  {
    source: `~/i/use/vscode/keybindings.json`,
    target: `~/Library/Application Support/Code/User/keybindings.json`,
  },
  {
    source: `~/i/use/vscode/global.code-snippets`,
    target: `~/Library/Application Support/Code/User/snippets/global.code-snippets`,
  },
];

print("link config files...");

const HOME_DIR = os.homedir();

await Promise.all(
  LINK_MAP.map(async ({ source, target }) => {
    source = source.replace("~", HOME_DIR);
    target = target.replace("~", HOME_DIR);
    await $`mkdir -p ${path.dirname(target)}`;
    await $`rm -rf ${target}`;
    await $`ln -s -f ${source} ${target}`;
  })
);

print("set macOS system settings...");
// finder
await $`defaults write NSGlobalDomain AppleShowAllExtensions -bool true`;
await $`defaults write com.apple.finder ShowPathbar -bool true`;
await $`defaults write com.apple.finder _FXSortFoldersFirst -bool true`;
// keyboard
await $`defaults write ApplePressAndHoldEnabled -bool false`;
await $`defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false`;

print("corepack enable...");
await $`corepack enable`;

print("install npm global packages...");

const GLOBAL_NPM_PKG_LIST = ["@antfu/ni", "nrm"];

await $`npm set registry https://registry.npmjs.org/`;
await Promise.all(
  GLOBAL_NPM_PKG_LIST.map(async (name) => {
    await $`npm i -g ${name}`;
  })
);

print("install vscode extensions...");

const { recommendations } = await fs.readJson("./vscode/extensions.json");

await Promise.all(
  recommendations.map(async (name) => {
    await $`code --install-extension ${name} --force`;
  })
);

await $`cp ./.hooks/pre-commit ./.git/hooks/`;

function print(msg) {
  console.log(chalk.magenta(msg));
  console.log();
}
