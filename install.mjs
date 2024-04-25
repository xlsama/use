#!/usr/bin/env zx

const LINK_MAP = [
  // config
  {
    source: '~/code/use/config/fish',
    target: `~/.config/fish`,
  },
  {
    source: `~/code/use/config/nvim`,
    target: `~/.config/nvim`,
  },
  {
    source: `~/code/use/config/starship.toml`,
    target: `~/.config/starship.toml`,
  },
  // git
  {
    source: `~/code/use/git/.gitconfig`,
    target: `~/.gitconfig`,
  },
  {
    source: `~/code/use/git/.gitconfig_work`,
    target: `~/.gitconfig_work`,
  },
  {
    source: `~/code/use/git/.gitignore`,
    target: `~/.gitignore`,
  },
  // vscode
  {
    source: `~/code/use/vscode/settings.json`,
    target: `~/Library/Application Support/Code/User/settings.json`,
  },
  {
    source: `~/code/use/vscode/keybindings.json`,
    target: `~/Library/Application Support/Code/User/keybindings.json`,
  },
  {
    source: `~/code/use/vscode/global.code-snippets`,
    target: `~/Library/Application Support/Code/User/snippets/global.code-snippets`,
  },
]

console.log()
print('link config files...')

const HOME_DIR = os.homedir()

await Promise.all(
  LINK_MAP.map(async ({ source, target }) => {
    source = source.replace('~', HOME_DIR)
    target = target.replace('~', HOME_DIR)
    await $`rm -rf ${target}`
    await $`ln -s -F ${source} ${target}`
  }),
)

print('set macOS system settings...')
// finder
await $`defaults write NSGlobalDomain AppleShowAllExtensions -bool true`
await $`defaults write com.apple.finder ShowPathbar -bool true`
await $`defaults write com.apple.finder _FXSortFoldersFirst -bool true`
// keyboard
await $`defaults write ApplePressAndHoldEnabled -bool false`

print('corepack enable...')
await $`corepack enable`

print('install npm global packages...')

const GLOBAL_NPM_PKG_LIST = ['vite', '@antfu/ni', 'degit', 'nrm']

await $`npm set registry https://registry.npmjs.org/`
await Promise.all(
  GLOBAL_NPM_PKG_LIST.map(async name => {
    await $`npm i -g ${name}`
  }),
)

print('install vscode extensions...')

const { recommendations } = await fs.readJson('./vscode/extensions.json')

await Promise.all(
  recommendations.map(async name => {
    await $`code --install-extension ${name}`
  }),
)

await $`cp ./.hooks/pre-commit ./.git/hooks/`

function print(msg) {
  console.log(chalk.magenta(msg))
  console.log()
}
