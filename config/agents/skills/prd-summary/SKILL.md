---
name: prd-summary
description: '需求文档梳理与代码仓库交叉对比。基于本地文件（PDF/PPTX/DOCX/XLSX/CSV/图片）自动用 docling 解析成 Markdown 后，输出本期需求的通俗摘要；遇到飞书链接会引导用户用浏览器扩展或飞书自带导出转成本地文件再继续（不调任何飞书 API/CLI）；可选关联前/后端代码仓库本地路径，派 Explore subagent 交叉对比哪些功能已实现、还需新增。触发词：梳理需求、需求总结、PRD 摘要、prd-summary、需求文档、解析飞书文档、解析 PRD、本期要做什么、需求拆解、对比代码仓库已实现、需求 vs 代码、二期需求、版本需求总结。'
---

# prd-summary

把一组需求材料（本地文件 + 飞书链接）变成一份**通俗易懂的本期需求摘要**，可选再生成一份**能直接交给下一个 Claude session 开工实现的技术文档**。可选关联前/后端代码仓库做交叉对比，标出哪些功能已有、哪些要新增。

## 何时触发

- 用户说「梳理需求 / 总结 PRD / 本期要做什么 / 需求拆解 / 对比代码仓库已实现」
- 用户贴出 PRD 文档（.pdf/.pptx/.docx/.xlsx/.csv/图片）或飞书文档链接，希望"理一理"
- 用户问"二期/V2 要改什么"

## 核心约束（必读）

1. **不要调任何飞书 API / CLI / SDK**。公司不批 OAuth/app_id；扩展源码抠到 Node 跑也要带 cookie，灰色地带，同样不批。skill 里没有任何代码会触碰飞书登录态。
2. **不要预安装依赖**。docling 走 `command -v docling || uvx docling@latest` 兜底（用 `@latest` 让 uvx 每次检查 PyPI 最新版，避免一直用首装时缓存的老版本）；缺啥就在终端给一句具体安装命令，不打断流程。
3. **每个 AskUserQuestion 都必须有兜底选项**（跳过 / 暂不决定 / 先标 TBD），用户始终能 escape；具体规范见 `references/interactive-questions.md`。
4. **不在 SKILL.md 写技术方案的实现细节**。要那些请引导用户在 Step 0 选「+技术文档」。

## 目录约定

```
~/.claude/skills/prd-summary/
├── SKILL.md                              # 本文件
├── scripts/
│   ├── parse_input.sh                    # 分流入口
│   ├── parse_local.sh                    # docling 调用 + 老 Office 拒绝
│   └── lib/manifest.py                   # tmp 目录的状态汇总
└── references/
    ├── interactive-questions.md          # AskUserQuestion 模板库
    ├── repo-explore-prompt.md            # Explore subagent prompt 模板
    └── output-templates.md               # 摘要 / 技术文档 markdown 模板
```

## 工作流（6 步）

### Step 0：进门四问

一次性 `AskUserQuestion` 问 4 个问题（**材料确认 / 前端仓库 / 后端仓库 / 输出风格**）。完整 JSON 模板见 `references/interactive-questions.md` 第 1 节，照抄即可。

记录用户的四个回答到内部状态：`<materials_promise, frontend_repo_intent, backend_repo_intent, output_style>`。

### Step 1：收集材料 + 仓库路径

让用户在下一条消息把**所有**材料一次性贴出来。语气类似：

> 好的，请把所有 PRD 材料一次性发给我：
> - 本地文件直接贴绝对路径或 `~/...` 路径都行
> - 飞书链接直接粘 URL（`https://xxx.feishu.cn/docx/...` 这种）
> - 如果有代码仓库，也贴本地路径（前端 `~/code/foo-web`、后端 `~/code/foo-api` 这种）

收到后：

- 用 `mktemp -d -t prd-summary-XXXX` 创建会话目录，记为 `$SESSION_DIR`，整个 session 复用
- 仓库路径只做存在性校验：`test -d <path>/.git`，不立刻扫
- 把每一份材料按顺序编号 1..N，逐个调 `parse_input.sh`（见 Step 2）

### Step 2：解析文档

对每份材料 idx=N、source=S：

```bash
bash ~/.claude/skills/prd-summary/scripts/parse_input.sh "$SESSION_DIR" N "S"
```

退出码：

| code | 含义 | 主流程怎么处理 |
|------|------|---------------|
| 0 | 本地文件解析成功 | 直接进 Step 3 |
| 3 | 不支持的二进制老格式 (.doc/.ppt/.xls/.wps) | 把脚本 stderr 原文转告用户，并在最终摘要 TBD 区列出 |
| 20 | 飞书 URL，已挂起 | **必须**走 Step 2.5 飞书引导 |
| 22 | 既不是 URL 也不是本地文件 | 提示用户检查路径，并问是否跳过 |
| 其它 | docling 等失败 | 报告 stderr + 询问用户是否跳过 |

manifest.json 由脚本自动维护，需要时用 `python3 ~/.claude/skills/prd-summary/scripts/lib/manifest.py dump "$SESSION_DIR/manifest.json"` 查看。

### Step 2.5：飞书链接引导（仅当 Step 2 出现 exit 20）

把所有 `status=feishu_pending` 项**合并到一次** `AskUserQuestion` 调用（每条 URL 占一个 question slot；超过 4 条就分批）。模板见 `references/interactive-questions.md` 第 2 节。三个选项：

1. **(推荐)** 浏览器扩展导出 .md：`https://github.com/whale4113/cloud-document-converter`
2. 飞书自带「...→下载」导出 .docx / .pdf
3. 跳过（manifest 标 skipped）

用户回贴本地路径后，对每个新路径再调一次 `parse_input.sh`（用同一个 idx，脚本会覆盖更新该 entry）。

### Step 3：通读 + 澄清

读取所有 `status=parsed` 的 `parsed.md`（路径在 manifest 里），逐份做 outline，整体合并。期间遇到任何不明确就用 `AskUserQuestion` 追问，常见情形和模板见 `references/interactive-questions.md` 第 3-6 节：

- 一份文档同时写一期/二期/三期 → 期数选择
- 术语不明 / 内部黑话 → 术语澄清
- 文档之间冲突 → 以谁为准
- 字段/交互细节缺失 → 按假设 / 标 TBD / 自填

每轮提问最多 1-4 个，能并到一次就别拆轮。用户走 Other 自填 或 选「跳过」的内容，写进对应 manifest entry 的 `warnings`，最终摘要 TBD 区列出。

### Step 4：（可选）代码仓库交叉对比

仅当 Step 0 至少有一个仓库选了"是"且 Step 1 拿到了路径时执行。

整理 Step 3 得到的本期功能清单，**前后端并行**派 Explore subagent（一条消息里多个 tool calls）：

```
Agent({
  description: "扫前端仓库",
  subagent_type: "Explore",
  prompt: <references/repo-explore-prompt.md 模板填好>
})
Agent({
  description: "扫后端仓库",
  subagent_type: "Explore",
  prompt: <references/repo-explore-prompt.md 模板填好>
})
```

完整 prompt 模板见 `references/repo-explore-prompt.md`。subagent 返回的报告**不展开**，直接喂给 Step 5。

如果 subagent 的报告里有"🟡 部分实现"项，对每个都用 `AskUserQuestion` 追问（模板见 interactive-questions 第 7 节）：补齐 / 不动 / 重写 / 跳过。

### Step 5：输出最终交付物

落到 `<cwd>/.prd-summary/<YYYYMMDD-HHMMSS>/`：

- **始终生成** `requirement-summary.md`（模板：`references/output-templates.md` 第一段）
- **若 Step 0 Q4 选了"+技术文档"**，再生成 `tech-spec.md`（模板：`references/output-templates.md` 第二段）

输出后在终端打印（给用户）：

```
✅ 已生成：
  - <cwd>/.prd-summary/20260427-153012/requirement-summary.md
  - <cwd>/.prd-summary/20260427-153012/tech-spec.md            # 仅当选了 +技术文档

📂 中间产物（解析后的 markdown / manifest）：
  $SESSION_DIR
```

## 脚本 Cheatsheet

```bash
# 分流入口（自动判别本地/飞书 URL）
bash ~/.claude/skills/prd-summary/scripts/parse_input.sh \
  "$SESSION_DIR" <idx> "<source>"

# 直接解析本地文件（被 parse_input.sh 间接调，单测时也可直接用）
bash ~/.claude/skills/prd-summary/scripts/parse_local.sh \
  "<input_file>" "<output_dir>"

# 看 manifest
python3 ~/.claude/skills/prd-summary/scripts/lib/manifest.py dump \
  "$SESSION_DIR/manifest.json"

# 手动改 manifest（飞书三选一收到回复后用）
python3 ~/.claude/skills/prd-summary/scripts/lib/manifest.py mark \
  "$SESSION_DIR/manifest.json" --idx N --status skipped
```

`mktemp -d -t prd-summary-XXXX` 在 macOS 上等价于 `/var/folders/.../prd-summary-XXXXXXX`。整个 session 复用同一个，方便用户出问题时把目录打包给我排错。

## 错误兜底

- **docling 找不到**：脚本会自动 `uvx docling@latest` 兜底（每次拉 PyPI 最新版）；如果连 uvx 都没有，提示用户 `brew install uv`，然后让用户重跑
- **首次跑 docling 慢**：第一次会下 ~500MB-1G 模型，告诉用户"耐心等 1-2 分钟"，不要终止
- **`.doc/.ppt/.xls` 老格式**：直接拒绝，提示用户在源端另存为新格式
- **飞书未导出**：Step 2.5 引导后用户没回贴路径就回了"继续"，把那些 entry 标 skipped，最终摘要 TBD 区列出
- **Explore subagent 跑挂**：把它在 manifest 外的状态记到一个 ad-hoc 字典，Step 5 输出时在"仍然 TBD"里加一行"<前端|后端>仓库未能完成自动对比"

## 风格

- **中文输出**全程
- **摘要给非技术同事看**：避免类型签名、ORM 术语、TS 泛型；用"按钮""页面""接口"而不是"Component""Endpoint"
- **技术文档给下一个 Claude 看**：可以用 `file_path:line`、字段表、payload schema，但不要粘整段代码

## 不做的事

- ❌ 不调飞书 API / CLI / SDK
- ❌ 不写 docling Python wrapper（subprocess 调 CLI 即可）
- ❌ 不在摘要里写实现细节（实现细节去技术文档）
- ❌ 不预装依赖（运行时检测 + 兜底）
- ❌ 不在没有用户明确同意的情况下生成技术文档（只有 Step 0 Q4 选"+技术文档"才生成）
