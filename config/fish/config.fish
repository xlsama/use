set -g fish_greeting
set -gx EDITOR nvim

# pnpm
set -gx PNPM_HOME "$HOME/Library/pnpm"
if not string match -q -- $PNPM_HOME $PATH
    set -gx PATH "$PNPM_HOME" $PATH
end

starship init fish | source
zoxide init fish | source
fnm env --use-on-cd | source
fzf --fish | source
source "$HOME/.local/bin/env.fish"

# --- 状态 & 日志 & 差异 ---
alias gst='git status'
alias gd='git diff'
alias glog='git log --oneline --decorate --graph --all'

# --- 添加 & 提交 ---
alias ga='git add'
alias gaa='git add -A'
alias gc='git commit'
alias gcm='git commit -m'
alias gca='git commit --amend'
alias gac='git add -A && git commit -m'

# --- 分支 & 切换 ---
alias gb='git branch'
alias gba='git branch -a'
alias gbr='git branch --remote'
alias gbd='git branch -d'
alias gbD='git branch -D'
alias gs='git switch'
alias gsc='git switch -c'

# --- 远程交互 (Fetch, Pull, Push) ---
alias gf='git fetch --all --prune --tags'
alias gl='git pull'
alias glr='git pull --rebase'
alias gp='git push'
alias gpu='git push -u origin HEAD'
alias gpf='git push --force'
alias gpd='git push origin --delete'
alias grv='git remote -v'

# --- Stash (暂存) ---
alias gsh='git stash push -m'
alias gsha='git stash apply'
alias gshp='git stash pop'
alias gshl='git stash list'
alias gshd='git stash drop'
alias gshc='git stash clear'

# --- 合并 & 变基 (Merge & Rebase) ---
alias gm='git merge'
alias gmc='git merge --continue'
alias gma='git merge --abort'
alias gr='git rebase'
alias grc='git rebase --continue'
alias gra='git rebase --abort'
alias gri='git rebase -i'

# --- Reset & Restore (重置 & 恢复) ---
# 'Reset' 通常用于移动HEAD指针, 'Restore' 用于恢复文件内容
alias grh='git reset --hard'
alias grh1='git reset --hard HEAD~1'
alias grh2='git reset --hard HEAD~2'
alias gres='git restore'
alias grss='git restore --staged'
alias greso='git restore --ours'
alias grest='git restore --theirs'

# --- 其他常用 ---
alias gcl='git clone'
alias gcp='git cherry-pick'
alias gcpc='git cherry-pick --continue'
alias gcpa='git cherry-pick --abort'
alias gsl='git shortlog -sn' # 按作者统计提交数量

alias i='cd ~/i'
alias w='cd ~/w' # work
alias dl='cd ~/Downloads'

alias ls='lsd'
alias l='ls -1A'
alias v='nvim'
alias o='open'
alias nv='fnm' # node version manager
alias reload='exec fish'
alias copy='pbcopy'
alias cpwd='pwd | copy'

alias nid='ni -D'
alias d='nr dev'
alias b='nr build'
alias t='nr test'
alias lint="nr lint"
alias release="nr release"

alias up='nlx taze -I -r'
alias venv='source .venv/bin/activate.fish'

alias claude="/Users/xlsama/.claude/local/claude"
alias ai='codex'
# alias ai='codex --ask-for-approval never'

function c
    code $argv
end

# Git Clone to ~/i Directory and Open with VSCode
function gcli
    set project_name (basename $argv)
    set project_name (string replace .git '' $project_name)
    git clone $argv ~/i/$project_name
    c ~/i/$project_name
    exit
end

# Git Clone to ~/w Directory and Open with VSCode
function gclw
    set project_name (basename $argv)
    set project_name (string replace .git '' $project_name)
    git clone $argv ~/w/$project_name
    c ~/w/$project_name
    exit
end
