import { homedir } from 'os';

const HOME_DIR = homedir()

const WATCH_LIST = [
  {
    name: 'settings.json',
    category: 'vscode',
    systemPath: `${HOME_DIR}/Library/Application Support/Code/User/settings.json`, 
    relativePath: '../VSCode/.vscode/settings.json'
  },
  {
    name: 'global.code-snippets',
    category: 'vscode',
    systemPath: `${HOME_DIR}/Library/Application Support/Code/User/snippets/global.code-snippets`, 
    relativePath: '../VSCode/.vscode/global.code-snippets'
  },
  {
    name: 'alacritty.yml',
    category: 'alacritty',
    systemPath: `${HOME_DIR}/.config/alacritty/alacritty.yml`, 
    relativePath: '../Alacritty/alacritty.yml'
  },
  {
    name: 'tmux.conf',
    category: 'tmux',
    systemPath: `${HOME_DIR}/.config/tmux/tmux.conf`, 
    relativePath: '../tmux/tmux.conf'
  },
  {
    name: '.zshrc',
    category: 'zsh',
    systemPath: `${HOME_DIR}/.zshrc`, 
    relativePath: '../zsh/.zshrc'
  },
]

export default WATCH_LIST
