import { homedir } from "os";

const HOME_DIR = homedir();

const WATCH_LIST = [
  {
    name: "vscode-settings.json",
    systemPath: `${HOME_DIR}/Library/Application Support/Code/User/settings.json`,
    relativePath: "vscode/settings.json",
  },
  {
    name: "vscode-global.code-snippets",
    systemPath: `${HOME_DIR}/Library/Application Support/Code/User/snippets/global.code-snippets`,
    relativePath: "vscode/global.code-snippets",
  },
  {
    name: "vscode-keybindings.json",
    systemPath: `${HOME_DIR}/Library/Application Support/Code/User/keybindings.json`,
    relativePath: "vscode/keybindings.json",
  },
  {
    name: "alacritty.yml",
    systemPath: `${HOME_DIR}/.config/alacritty/alacritty.yml`,
    relativePath: "alacritty/alacritty.yml",
  },
  {
    name: "tmux.conf",
    systemPath: `${HOME_DIR}/.config/tmux/tmux.conf`,
    relativePath: "tmux/tmux.conf",
  },
  {
    name: ".zshrc",
    systemPath: `${HOME_DIR}/.zshrc`,
    relativePath: "zsh/.zshrc",
  },
];

export default WATCH_LIST;
