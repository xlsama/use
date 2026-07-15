set -g fish_greeting
set -gx EDITOR nvim

# Keep the terminal cursor as a vertical bar in Fish.
set -g fish_cursor_default line
set -g fish_cursor_insert line
set -g fish_cursor_replace_one line
set -g fish_cursor_replace line
set -g fish_cursor_external line
set -g fish_cursor_visual line
set -g fish_vi_force_cursor 1

# pnpm
set -gx PNPM_HOME "$HOME/Library/pnpm"
if not string match -q -- $PNPM_HOME $PATH
    set -gx PATH "$PNPM_HOME" $PATH
end

fish_add_path /opt/homebrew/opt/postgresql@18/bin
starship init fish | source
functions -c fish_prompt __starship_fish_prompt
function fish_prompt
    __starship_fish_prompt $argv
    printf '\e[6 q'
end
zoxide init fish | source
fnm env --use-on-cd | source
fzf --fish | source

# Added by OrbStack: command-line tools and integration
# This won't be added again if you remove it.
source ~/.orbstack/shell/init2.fish 2>/dev/null || :
# rust
source "$HOME/.cargo/env.fish"

alias g='lazygit'
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
alias gbv='git branch -vv'
alias gbr='git branch --remote'
alias gbd='git branch -d'
alias gbD='git branch -D'
alias gs='git switch'
alias gsc='git switch -c'

# --- 标签 ---
alias gt='git tag'
alias gtl='git tag -l'
alias gtd='git tag -d'

# --- 远程交互 (Fetch, Pull, Push) ---
alias gf='git fetch --all --prune --tags'
alias gl='git pull'
alias glr='git pull --rebase'
alias gp='git push'
alias gpu='git push -u origin HEAD'
alias gpf='git push --force'
alias gpt='git push --tags'
alias gpd='git push origin --delete'
alias gps='git push --force starbucks HEAD:stg'
alias gpm='git push --force starbucks HEAD:master'

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
# 'Reset' 通常用于移动HEAD指针, 'Restore' 用于撤回/还原文件内容（工作区、暂存区）
alias grh='git reset --hard'
alias grh1='git reset --hard HEAD~1'
alias grh2='git reset --hard HEAD~2'
alias gre='git restore' # 丢弃工作区改动
alias gres='git restore --staged' # 撤销已暂存
alias greo='git restore --ours' # 解决冲突时用“当前”的版本覆盖工作区
alias gret='git restore --theirs' # 解决冲突时用“传入”的版本覆盖工作区

# --- 其他常用 ---
alias gcl='git clone'
alias gcp='git cherry-pick'
alias gcpc='git cherry-pick --continue'
alias gcpa='git cherry-pick --abort'
alias gco='git checkout'
alias gsl='git shortlog -sn' # 按作者统计提交数量

# cd
alias i='cd ~/i'
alias w='cd ~/w' # work
alias dl='cd ~/Downloads'
alias conf='cd ~/.config'
alias notes='cd ~/Documents/notes'

# ls
alias ls='lsd'
alias l='lsd -1A'

# copy
alias copy='pbcopy'
alias cpwd='pwd | copy'
alias cgb='gb --show-current | copy'

alias o='open'
alias v='nvim'
alias h='herdr'

# language
alias n='fnm' # node version manager
alias py='python3'

# environment
alias reload='exec fish'
alias venv='source .venv/bin/activate.fish'

alias speedtest='networkQuality'
alias serve='nlx serve -s'

# node
alias nid='ni -D'
alias d='nr dev'
alias do='nr dev --open'
alias b='nr build'
alias t='nr test'
alias lint="nr lint"
alias fmt="nr fmt"
alias ck='nr check'
alias release="nr release"
alias up='nlx taze -I -r'

# swift
alias s='swift'

# python
alias ua='uv add'
alias ur='uv run'
alias ud='ur poe dev'
alias uvup='uv lock --upgrade'
alias us='uv sync'

# ai
alias cc='claude --dangerously-skip-permissions --effort max'
alias cch="claude --dangerously-skip-permissions --model haiku"
alias ccs="claude --dangerously-skip-permissions --model sonnet"
alias ccr="cc --resume"
alias cm="ccs /commit"
alias cx="codex --sandbox danger-full-access"

function c
  code $argv
end

# Git Clone to ~/i Directory
function gcli
    set project_name (basename $argv)
    set project_name (string replace .git '' $project_name)
    git clone $argv ~/i/$project_name
    cd ~/i/$project_name
end

# Git Clone to ~/w Directory
function gclw
    set project_name (basename $argv)
    set project_name (string replace .git '' $project_name)
    git clone $argv ~/w/$project_name
    cd ~/w/$project_name
end

function zip_cur
    set dir_name (basename (pwd))
    zip -r "$dir_name.zip" . -x "node_modules/*" ".venv/*" "*.zip" "*.DS_Store" "*.git*" ".netlify/*"
end

# Open git remote origin in browser
function og
    set remote_url (git remote get-url origin 2>/dev/null)
    if test -z "$remote_url"
        echo "No origin remote found"
        return 1
    end

    # Convert SSH to HTTPS: git@host:path -> https://host/path
    if string match -q "git@*" $remote_url
        set url (string replace "git@" "" $remote_url)
        set url (string replace ":" "/" $url)
        set url "https://$url"
    else
        set url $remote_url
    end

    # Remove .git suffix
    set url (string replace -r '\.git$' '' $url)

    open "$url/branches"
end

# yazi wrapper: exit to cwd
function y
    set tmp (mktemp -t "yazi-cwd.XXXXXX")
    command yazi $argv --cwd-file="$tmp"
    if read -z cwd <"$tmp"; and [ "$cwd" != "$PWD" ]; and test -d "$cwd"
        builtin cd -- "$cwd"
    end
    rm -f -- "$tmp"
end

# >>> grok installer >>>
fish_add_path $HOME/.grok/bin
# <<< grok installer <<<
