set env_file ~/.config/env.json

if not test -f $env_file
    exit 0
end

source (
  jq -r '
    to_entries[]
    | "set -gx \(.key) \"\(.value)\""
  ' $env_file | psub
)
