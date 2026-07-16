#!/usr/bin/env bun

import { $ } from 'bun'
import { homedir } from 'node:os'
import { dirname } from 'node:path'

const HOME_DIR = homedir()

// ---------- linking ----------
const LINK_MAP = [
  // git
  { source: '~/i/use/config/git/.gitconfig', target: '~/.gitconfig' },
  { source: '~/i/use/config/git/.gitconfig_work', target: '~/.gitconfig_work' },
  { source: '~/i/use/config/git/.gitignore', target: '~/.gitignore' },
  // fish
  { source: '~/i/use/config/fish', target: '~/.config/fish' },
  // nvim
  { source: '~/i/use/config/nvim.lua', target: '~/.config/nvim/init.lua' },
  // starship
  { source: '~/i/use/config/starship.toml', target: '~/.config/starship.toml' },
  // ghostty
  { source: '~/i/use/config/ghostty.conf', target: '~/.config/ghostty/config' },
  // hunk
  { source: '~/i/use/config/hunk.toml', target: '~/.config/hunk/config.toml' },
  // agents - universal
  { source: '~/i/use/config/agents/AGENTS.md', target: '~/.codex/AGENTS.md' },
  { source: '~/i/use/config/agents/commands', target: '~/.agents/commands' },
  { source: '~/i/use/config/agents/skills', target: '~/.agents/skills' },
  // agents - claude
  { source: '~/i/use/config/agents/AGENTS.md', target: '~/.claude/CLAUDE.md' },
  { source: '~/i/use/config/agents/commands', target: '~/.claude/commands' },
  { source: '~/i/use/config/agents/skills', target: '~/.claude/skills' },
]

// ---------- create folders ----------
await $`mkdir -p ~/w` // Working code directory

log('link config files...')
await Promise.all(
  LINK_MAP.map(async ({ source, target }) => {
    const src = source.replace('~', HOME_DIR)
    const tgt = target.replace('~', HOME_DIR)
    await $`mkdir -p ${dirname(tgt)}`
    await $`rm -rf ${tgt}`
    await $`ln -s -f ${src} ${tgt}`
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
await $`killall Finder`.nothrow()
await $`killall Dock`.nothrow()

// ---------- corepack/npm ----------
log('corepack enable...')
await $`corepack enable`
await $`npm set registry https://registry.npmjs.org/`

log('install npm global packages ...')
await $`npm i -g @antfu/ni nnrm vite`.nothrow()

function log(msg: string) {
  console.log(`\x1b[35m${msg}\x1b[0m\n`)
}

