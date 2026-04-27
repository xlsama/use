#!/usr/bin/env bash
# parse_input.sh <session_dir> <idx> <source>
#
# session_dir: mktemp -d 出来的会话目录
# idx:         此项在 manifest 中的序号（外部累加，避免并发）
# source:      用户给的本地路径或飞书 URL
#
# 行为：
#   - 飞书 URL（feishu.cn / larksuite.com 任一类型）→ manifest 标 feishu_pending，exit 20
#   - 本地存在的文件 → 调 parse_local.sh，成功标 parsed，失败按 exit code 标 error/skipped
#   - 其他 → 标 error，exit 22
#
# manifest.json 自动维护在 <session_dir>/manifest.json

set -u

if [ "$#" -ne 3 ]; then
  echo "usage: parse_input.sh <session_dir> <idx> <source>" >&2
  exit 2
fi

session_dir="$1"
idx="$2"
src="$3"

mkdir -p "$session_dir"
manifest="$session_dir/manifest.json"
script_dir="$(cd "$(dirname "$0")" && pwd)"

if [ ! -f "$manifest" ]; then
  python3 "$script_dir/lib/manifest.py" init "$manifest"
fi

is_feishu_url() {
  # 兼容 feishu.cn / larksuite.com / 海外 .com / 国内 .cn
  [[ "$1" =~ ^https?://[^/]*(feishu|larksuite)\.(cn|com)/(docx|docs|sheets|base|wiki|file|drive)/ ]]
}

if is_feishu_url "$src"; then
  python3 "$script_dir/lib/manifest.py" add "$manifest" \
    --idx "$idx" --kind feishu --source "$src" --status feishu_pending >/dev/null
  cat >&2 <<EOF
[parse_input] 检测到飞书链接 (idx=$idx)，已挂起等待主流程引导用户导出：
  $src
EOF
  exit 20
fi

# 本地路径：允许 ~ 展开 + 相对路径解析
expanded="${src/#\~/$HOME}"
if [ -f "$expanded" ]; then
  out_dir="$session_dir/$idx"
  mkdir -p "$out_dir"
  python3 "$script_dir/lib/manifest.py" add "$manifest" \
    --idx "$idx" --kind local --source "$expanded" --status pending >/dev/null

  if bash "$script_dir/parse_local.sh" "$expanded" "$out_dir"; then
    python3 "$script_dir/lib/manifest.py" mark "$manifest" \
      --idx "$idx" --status parsed --parsed "$out_dir/parsed.md" >/dev/null
    echo "$out_dir/parsed.md"
    exit 0
  else
    rc=$?
    case "$rc" in
      3) status="skipped"; warn="不支持的二进制老格式" ;;
      *) status="error";   warn="docling 解析失败 (rc=$rc)" ;;
    esac
    python3 "$script_dir/lib/manifest.py" mark "$manifest" \
      --idx "$idx" --status "$status" --warning "$warn" >/dev/null
    exit "$rc"
  fi
fi

python3 "$script_dir/lib/manifest.py" add "$manifest" \
  --idx "$idx" --kind unknown --source "$src" --status error \
  --warning "既不是飞书 URL 也不是本地存在的文件" >/dev/null
echo "[parse_input] 既不是飞书 URL 也不是本地存在的文件: $src" >&2
exit 22
