export ZSH="$HOME/.oh-my-zsh"

# git clone https://github.com/denysdovhan/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt" --depth=1
# ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
ZSH_THEME="spaceship"

# git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  z
  extract
)

# https://ohmyz.sh/
source $ZSH/oh-my-zsh.sh

# aliases
alias l='ls -la'

# vim
alias v='nvim'
alias vi='nvim'
alias vim='nvim'

# Use github/hub
alias git=hub

# Git
alias gst='git status'
alias ga='git add'
alias ga.='git add .'
alias gaa='git add --all'
alias gc='git commit'
alias gcm='git commit -m'
alias gca='git commit --amend'
alias gac='git add . && git commit'
alias gco='git checkout'
alias gcb='git checkout -b'
alias gs='git switch'
alias gsc='git switch --create'
alias gp='git push'
alias gpf='git push --force'
alias gpl='git pull --rebase'
alias gcl='git clone'
alias gf='git fetch'
alias gd='git diff'
alias gb='git branch'
alias gba='git branch -a'
alias gl='git log'
alias gsh='git stash'
alias gshp='git stash pop'
alias gshl='git stash list'
alias gshc='git stash clear'
alias grc='git rebase --continue'
alias gra='git rebase --abort'

alias main='git switch main'

alias s='nr start'
alias d='nr dev'
alias b='nr build'
alias t="nr test"
alias lint="nr lint"
alias lintf="nr lint --fix"

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

