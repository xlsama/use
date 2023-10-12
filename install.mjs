#!/usr/bin/env zx

const HOME_DIR = os.homedir()

const link_map = [
  // config
  {
    source: `${HOME_DIR}/code/use/config/alacritty`,
    target: `${HOME_DIR}/.config/alacritty`,
  },
  {
    source: `${HOME_DIR}/code/use/config/fish`,
    target: `${HOME_DIR}/.config/fish`,
  },
  {
    source: `${HOME_DIR}/code/use/config/nvim`,
    target: `${HOME_DIR}/.config/nvim`,
  },
  {
    source: `${HOME_DIR}/code/use/config/omf`,
    target: `${HOME_DIR}/.config/omf`,
  },
  {
    source: `${HOME_DIR}/code/use/config/tmux`,
    target: `${HOME_DIR}/.config/tmux`,
  },
  {
    source: `${HOME_DIR}/code/use/config/starship.toml`,
    target: `${HOME_DIR}/.config/starship.toml`,
  },
  // git
  {
    source: `${HOME_DIR}/code/use/git/.gitconfig`,
    target: `${HOME_DIR}/.gitconfig`,
  },
  {
    source: `${HOME_DIR}/code/use/git/.gitconfig_work`,
    target: `${HOME_DIR}/.gitconfig_work`,
  },
  {
    source: `${HOME_DIR}/code/use/git/.gitignore`,
    target: `${HOME_DIR}/.gitignore`,
  },
  // vscode
  {
    source: `${HOME_DIR}/code/use/vscode/settings.json`,
    target: `${HOME_DIR}/Library/Application Support/Code/User/settings.json`,
  },
  {
    source: `${HOME_DIR}/code/use/vscode/keybindings.json`,
    target: `${HOME_DIR}/Library/Application Support/Code/User/keybindings.json`,
  },
  {
    source: `${HOME_DIR}/code/use/vscode/global.code-snippets`,
    target: `${HOME_DIR}/Library/Application Support/Code/User/snippets/global.code-snippets`,
  },
  // for work
  {
    source: `${HOME_DIR}/code/use/vscode/semi.code-snippets`,
    target: `${HOME_DIR}/Library/Application Support/Code/User/snippets/semi.code-snippets`,
  },
]

// link config files
console.log(chalk.blue('ln -s files'))
link_map.forEach(async ({ source, target }) => {
  await $`rm -rf ${target}`
  await $`ln -s ${source} ${target}`
})

// set macOS system settings
console.log(chalk.blue('set macOS system settings'))
// finder
await $`defaults write NSGlobalDomain AppleShowAllExtensions -bool true`
await $`defaults write com.apple.finder ShowPathbar -bool true`
await $`defaults write com.apple.finder _FXSortFoldersFirst -bool true`
// keyboard
await $`defaults write ApplePressAndHoldEnabled -bool false`

// install vscode extensions
console.log(chalk.blue('install vscode extensions'))
const { recommendations } = await fs.readJson('./vscode/extensions.json')
recommendations.forEach(async name => {
  await $`code --install-extension ${name}`
})

// install package
await $`curl -fsSL https://bun.sh/install | bash` // bun
await $`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` // rust
await $`curl https://raw.githubusercontent.com/oh-my-fish/oh-my-fish/master/bin/install | fish` // oh-my-fish

// copy pre-commit git hook
await $`cp ./.hooks/pre-commit ./.git/hooks/`
