#!/usr/bin/env bash
# parse_local.sh <input_file> <output_dir>
#
# Convert a local file to <output_dir>/parsed.md using docling.
# Old binary Office formats (.doc / .ppt / .xls / .wps) are rejected: the user
# should re-save in the modern open formats first.
#
# Exit codes:
#   0  success, parsed.md written
#   2  bad arguments / file missing
#   3  unsupported binary old-Office format
#   4  docling invocation failed

set -u

if [ "$#" -ne 2 ]; then
  echo "usage: parse_local.sh <input_file> <output_dir>" >&2
  exit 2
fi

input="$1"
out_dir="$2"

if [ ! -f "$input" ]; then
  echo "[parse_local] file not found: $input" >&2
  exit 2
fi

mkdir -p "$out_dir"

filename="$(basename -- "$input")"
ext="${filename##*.}"
ext="$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')"
stem="${filename%.*}"

case "$ext" in
  doc|ppt|xls|wps)
    cat >&2 <<EOF
[parse_local] 不支持二进制老格式 .$ext

请在源端用 Office / WPS / Pages 打开后另存为：
  .doc → .docx     .ppt → .pptx     .xls → .xlsx
然后把新路径再发回来即可。
EOF
    exit 3
    ;;
esac

# docling 优先用本机已装的；否则走 uvx 兜底（始终拉 PyPI 最新版，首次会下 ~500MB-1G 模型）
if command -v docling >/dev/null 2>&1; then
  DOCLING=(docling)
elif command -v uvx >/dev/null 2>&1; then
  DOCLING=(uvx docling@latest)
else
  cat >&2 <<EOF
[parse_local] 找不到 docling 也没有 uvx。请二选一：
  A) brew install uv && uvx docling@latest --help    # 推荐，零安装
  B) pipx install docling 或 pip install docling
EOF
  exit 4
fi

# OCR 策略：图片强制 OCR；PDF/其它默认关 OCR（结构化输入更快），
# 上层若发现 parsed.md 实质为空可以重新调用并自带 --force-ocr。
case "$ext" in
  png|jpg|jpeg|tif|tiff|bmp|webp)
    OCR_ARGS=(--ocr --ocr-lang chi_sim+eng)
    ;;
  *)
    OCR_ARGS=(--no-ocr)
    ;;
esac

# docling --output 接受目录，输出文件名 = <stem>.md
if ! "${DOCLING[@]}" "${OCR_ARGS[@]}" --to md --output "$out_dir" "$input" >&2; then
  echo "[parse_local] docling 解析失败：$input" >&2
  exit 4
fi

produced="$out_dir/$stem.md"
if [ ! -f "$produced" ]; then
  # docling 在某些版本里会把 . 之外的字符替换成 _，做一次兜底匹配
  produced="$(find "$out_dir" -maxdepth 1 -type f -name '*.md' ! -name 'parsed.md' | head -n 1)"
fi

if [ -z "${produced:-}" ] || [ ! -f "$produced" ]; then
  echo "[parse_local] 找不到 docling 输出的 .md 文件" >&2
  exit 4
fi

mv -f "$produced" "$out_dir/parsed.md"
echo "$out_dir/parsed.md"
