set -g fish_greeting

starship init fish | source
zoxide init fish | source

# aliases
alias glog='git log --oneline --decorate --color --graph'
alias grl='git reflog'
alias gst='git status'
alias gd='git diff'
alias clone='git clone'
alias ga='git add'
alias gaa='git add --all'
alias gc='git commit'
alias gcm='git commit -m'
alias gac='git add --all && git commit'
alias gca='git add --all && git commit --amend'
alias gb='git branch'
alias gba='git branch -a'
alias gbr='git branch --remote'
alias gs='git switch'
alias gsc='git switch --create'
alias gf='git fetch'
alias gp='git push'
alias gpf='git push --force'
alias gl='git pull'
alias glr='git pull --rebase'
alias gsh='git stash'
alias gshp='git stash pop'
alias gshl='git stash list'
alias gshc='git stash clear'
alias gm='git merge'
alias gmc='git merge --continue'
alias gma='git merge --abort'
alias gr='git reabse'
alias grc='git rebase --continue'
alias gra='git rebase --abort'
alias grh='git reset --hard'
alias grh1='git reset --hard HEAD~1'
alias grh2='git reset --hard HEAD~2'
alias gcp='git cherry-pick'

alias d='nr dev'
alias b='nr build'
alias s='nr start'
alias t='nr test'
alias up='taze -I'
alias lint="nr lint"
alias lintf="nr lint --fix"

alias ls='lsd'
alias l='ls -1A'
alias cat='bat'
alias dl='cd ~/Downloads'

alias v='nvim'
alias o='open'
alias c='code'
alias nv='fnm' # node version
alias python='python3'
# aliases end

# Git Clone to ~/code Directory and Open with VSCode
function clonec
  set project_name (basename $argv)
  git clone $argv ~/code/$project_name
  code ~/code/$project_name
end

# Git Clone to ~/code/work Directory and Open with VSCode
function clonew
  set project_name (basename $argv)
  git clone $argv ~/code/work/$project_name
  code ~/code/work/$project_name
end


# pnpm
set -gx PNPM_HOME "/Users/xlsama/Library/pnpm"
if not string match -q -- $PNPM_HOME $PATH
  set -gx PATH "$PNPM_HOME" $PATH
end
# pnpm end

# bun
set --export BUN_INSTALL "$HOME/.bun"
set --export PATH $BUN_INSTALL/bin $PATH
