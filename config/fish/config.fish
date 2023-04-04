if status is-interactive
    # Commands to run in interactive sessions can go here
end

set -g fish_greeting

starship init fish | source

# aliases

# git
alias g='gitui'
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

alias s='npm run start'
alias d='npm run dev'
alias b='npm run build'

alias l='ls -la'
alias ls='lsd'
alias la='ls -a'
alias ll='ls -l'
alias lt='ls --tree'


alias v='nvim'
alias o='open'
alias c='code -r'

alias use='code ~/use'
alias idl='npm run sync-idl'
alias gen='npm run gen'
