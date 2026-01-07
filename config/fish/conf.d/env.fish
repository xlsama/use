set env_file ~/.config/env.json

if not test -f $env_file
    exit 0
end

# 将 ~/.config/env.json 中的配置设置为环境变量
source (
  jq -r '
    to_entries[]
    | "set -gx \(.key) \"\(.value)\""
  ' $env_file | psub
)
