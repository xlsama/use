#!/usr/bin/env zx

// Force zx to use bash instead of fish
$.shell = "/bin/bash";

const HOME_DIR = os.homedir();

// ---------- linking ----------
const LINK_MAP = [
  // config
  { source: "~/i/use/config/fish", target: `~/.config/fish` },
  { source: `~/i/use/config/nvim`, target: `~/.config/nvim` },
  { source: `~/i/use/config/starship.toml`, target: `~/.config/starship.toml` },
  { source: "~/i/use/codex/config.toml", target: "~/.codex/config.toml" },
  // git
  { source: `~/i/use/git/.gitconfig`, target: `~/.gitconfig` },
  { source: `~/i/use/git/.gitconfig_work`, target: `~/.gitconfig_work` },
  { source: `~/i/use/git/.gitignore`, target: `~/.gitignore` },
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

// ---------- create folders ----------
await $`mkdir -p ~/w`; // Working code directory

log("link config files...");
await Promise.all(
  LINK_MAP.map(async ({ source, target }) => {
    source = source.replace("~", HOME_DIR);
    target = target.replace("~", HOME_DIR);
    await $`mkdir -p ${path.dirname(target)}`;
    await $`rm -rf ${target}`;
    await $`ln -s -f ${source} ${target}`;
  })
);

// ---------- macOS defaults ----------
log("set macOS system settings...");
// docs: https://macos-defaults.com/
// Show path bar
await $`defaults write com.apple.finder ShowPathbar -bool true`;
// Keep folders on top
await $`defaults write com.apple.finder _FXSortFoldersFirst -bool true`;
// Repeats the key as long as it is held down.
await $`defaults write -g ApplePressAndHoldEnabled -bool false`;
// Put the Dock on the left of the screen
await $`defaults write com.apple.dock "orientation" -string left`;
// Do not display recent apps in the Dock
await $`defaults write com.apple.dock "show-recents" -bool false`;
// Dragging with three finger drag
await $`defaults write com.apple.AppleMultitouchTrackpad "TrackpadThreeFingerDrag" -bool "true"`;
// Show all file extensions inside the Finder
await $`defaults write NSGlobalDomain "AppleShowAllExtensions" -bool true`;
await $`touch ~/.hushlogin`;
// restart to apply settings
await $({ nothrow: true })`killall Finder`;
await $({ nothrow: true })`killall Dock`;

// ---------- corepack/npm ----------
log("corepack enable...");
await $`corepack enable`;
await $`npm set registry https://registry.npmjs.org/`;

log("install npm global packages ...");
for (const name of ["@antfu/ni", "nrm"]) {
  await $({ nothrow: true })`npm i -g ${name}`;
}

// ---------- VS Code extensions ----------
log("install vscode extensions...");
const { recommendations } = await fs.readJson("./vscode/extensions.json");
await Promise.all(
  recommendations.map(async (name) => {
    await $`code --install-extension ${name} --force`;
  })
);

// ---------- git hook ----------
await $`cp ./.hooks/pre-commit ./.git/hooks/`;

function log(msg) {
  console.log(chalk.magenta(msg), "\n");
}
