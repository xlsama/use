#!/usr/bin/env zx

// Force zx to use bash instead of fish
$.shell = '/bin/bash'

const HOME_DIR = os.homedir()

// ---------- linking ----------
const LINK_MAP = [
  // git
  { source: '~/i/use/config/git/.gitconfig', target: '~/.gitconfig' },
  { source: '~/i/use/config/git/.gitconfig_work', target: '~/.gitconfig_work' },
  { source: '~/i/use/config/git/.gitignore', target: '~/.gitignore' },
  // fish
  { source: '~/i/use/config/fish', target: '~/.config/fish' },
  // nvim
  { source: '~/i/use/config/nvim', target: '~/.config/nvim' },
  // starship
  { source: '~/i/use/config/starship.toml', target: '~/.config/starship.toml' },
  // cursor
  {
    source: `~/i/use/config/cursor/settings.json`,
    target: '~/Library/Application Support/Cursor/User/settings.json',
  },
  {
    source: `~/i/use/config/cursor/keybindings.json`,
    target: '~/Library/Application Support/Cursor/User/keybindings.json',
  },
  {
    source: `~/i/use/config/cursor/global.code-snippets`,
    target: '~/Library/Application Support/Cursor/User/snippets/global.code-snippets',
  },
  // zed
  { source: '~/i/use/config/zed/settings.json', target: '~/.config/zed/settings.json' },
  { source: '~/i/use/config/zed/keymap.json', target: '~/.config/zed/keymap.json' },
  { source: '~/i/use/config/zed/snippets', target: '~/.config/zed/snippets' },
]

// ---------- create folders ----------
await $`mkdir -p ~/w` // Working code directory

log('link config files...')
await Promise.all(
  LINK_MAP.map(async ({ source, target }) => {
    source = source.replace('~', HOME_DIR)
    target = target.replace('~', HOME_DIR)
    await $`mkdir -p ${path.dirname(target)}`
    await $`rm -rf ${target}`
    await $`ln -s -f ${source} ${target}`
  }),
)

// ---------- macOS defaults ----------
log('set macOS system settings...')
// docs: https://macos-defaults.com/
// Show path bar
await $`defaults write com.apple.finder ShowPathbar -bool true`
// Keep folders on top
await $`defaults write com.apple.finder _FXSortFoldersFirst -bool true`
// Repeats the key as long as it is held down.
await $`defaults write -g ApplePressAndHoldEnabled -bool false`
// Do not display recent apps in the Dock
await $`defaults write com.apple.dock "show-recents" -bool false`
// Auto hide Dock
await $`defaults write com.apple.dock autohide -bool true`
// Dragging with three finger drag
await $`defaults write com.apple.AppleMultitouchTrackpad "TrackpadThreeFingerDrag" -bool "true"`
// Show all file extensions inside the Finder
await $`defaults write NSGlobalDomain "AppleShowAllExtensions" -bool true`
// Set language to zh-CN for Maps
await $`defaults write com.apple.Maps AppleLanguages '("zh-CN")'`
await $`touch ~/.hushlogin`
// restart to apply settings
await $({ nothrow: true })`killall Finder`
await $({ nothrow: true })`killall Dock`

// ---------- corepack/npm ----------
log('corepack enable...')
await $`corepack enable`
await $`npm set registry https://registry.npmjs.org/`

log('install npm global packages ...')
for (const name of ['@antfu/ni', 'nnrm']) {
  await $({ nothrow: true })`npm i -g ${name}`
}

function log(msg) {
  console.log(chalk.magenta(msg), '\n')
}
