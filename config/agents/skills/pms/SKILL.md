---
name: pms
description: 'PMS 工时与云效 Codeup 管理。触发词：查 UT、查工时、工时汇总、报工时、提交工时、驳回记录、未提交工时、导出 UT、导出工时、查云效提交、查云效 commits、导出云效 commit、云效仓库列表、云效分支列表、云效代码提交汇总、生成云效提交汇总 Markdown、按项目汇总 Codeup 提交。用户提到 Codeup/云效 commit/云效提交汇总/发给产品经理时优先使用本技能，不要误走 UT 查询。'
---

# PMS 工时与云效代码管理

## 判断用户意图

- 用户说 `UT`、`工时`、`报工时`、`未提交工时` 时，使用 **UT 工时管理**。
- 用户说 `Codeup`、`云效 commit`、`代码提交`、`云效提交汇总`、`发给产品经理` 时，使用 **云效 Codeup**。
- 用户只给 `4.1-4.30` 这类月日范围时，按当前年份推断日期，并在最终回复中写明完整日期范围。
- 导出文件时，把文件放到用户当前工作目录；运行脚本前设置 `ORIGINAL_CWD="<用户当前工作目录绝对路径>"`。

## 认证

### PMS 登录

Token 存储于 `~/.config/yechtech-settings.json` 的 `ut.pmsToken`。遇到 401 或无 token 时登录：

```bash
bun scripts/pms-login.ts -u "用户名" -p "密码"
```

### 云效配置

Token 存储于 `yunxiao.token`，邮箱存储于 `yunxiao.email`。首次使用时配置：

```bash
bun scripts/pms-config.ts --set-yunxiao-token <token> --set-yunxiao-email <email>
```

查看当前配置：

```bash
bun scripts/pms-config.ts --show
```

## UT 工时管理

### 查询

```bash
bun scripts/ut-query.ts                                              # 今天
bun scripts/ut-query.ts --date 2025-01-15                            # 指定日期
bun scripts/ut-query.ts --startDate 2025-01-01 --endDate 2025-01-31  # 日期范围
bun scripts/ut-query.ts --remaining                                  # 剩余工时 (JSON)
```

### 提交

1. 先查询确认可提交项目：`bun scripts/ut-query.ts --date <日期>`
2. 筛选 `status` 为空的项目，确认后提交：

```bash
bun scripts/ut-submit.ts --date <日期> --items '[{"projectId":123,"projectName":"项目A","val":8}]'
```

### 导出

运行导出时，必须设置 `ORIGINAL_CWD` 环境变量为用户当前工作目录的绝对路径：

```bash
ORIGINAL_CWD="<用户当前工作目录绝对路径>" bun scripts/ut-query.ts --date 2025-01-15 --export
ORIGINAL_CWD="<用户当前工作目录绝对路径>" bun scripts/ut-query.ts --startDate 2025-01-01 --endDate 2025-01-31 --export
```

## 云效 Codeup

### 查询提交

```bash
bun scripts/yunxiao-commit.ts --startDate 2025-01-01 --endDate 2025-01-15
```

### 导出 commit

```bash
ORIGINAL_CWD="<用户当前工作目录绝对路径>" bun scripts/yunxiao-commit.ts --startDate 2025-01-01 --endDate 2025-01-15 --export
```

默认按 `yunxiao.email` 过滤当前用户提交；临时指定邮箱用 `--email <email>`；查询全部作者用 `--all`。

默认过滤 merge commit。用户明确说“所有 commit”“全部 commit”“包含 merge”时加 `--includeMerge`：

```bash
ORIGINAL_CWD="<用户当前工作目录绝对路径>" bun scripts/yunxiao-commit.ts --startDate 2025-01-01 --endDate 2025-01-31 --includeMerge --export
```

### 生成云效提交汇总 Markdown

这类文档通常用于按项目查看本期做了什么，也可以直接发给产品经理；默认不需要 hash、分支、作者、CSV 或逐日流水。输出 Markdown 使用这个结构：

```markdown
# 2025.01.01 - 2025.01.31 云效 Commit 汇总

## 项目名称

- commit 内容
- commit 内容
```

要求：

- 二级标题必须是项目/仓库名称。
- 项目下只保留 commit 内容，一条 commit 一个列表项。
- 不输出 hash、链接、作者、分支、提交时间，除非用户明确要求。
- 保留原始 commit 文案；只做轻量清洗，例如把 `[F] xxx` 转为 `F: xxx`。
- 同一个项目下相同 commit 内容只保留一次，避免多分支重复提交造成重复项。
- 用户说“所有 commit”时包含 merge commit；用户只说“工作内容/本月提交”时可以沿用默认行为过滤 merge commit。

参考示例：`examples/codeup-commits-2026-04.md`。

### 仓库列表

```bash
bun scripts/yunxiao-list-repo.ts
```

### 分支列表

```bash
bun scripts/yunxiao-list-branch.ts --repoId <仓库ID>
```

## 工作流：月度工时提交

1. **查询本月提交**：`bun scripts/yunxiao-commit.ts --startDate <月初> --endDate <月末> --export`
2. **导出 commit markdown** 发给产品经理。若用户要求“所有 commit”，使用 `--includeMerge`
3. PM 分配 UT 后，**查询剩余工时**：`bun scripts/ut-query.ts --remaining`
4. 根据分配结果**提交 UT**：`bun scripts/ut-submit.ts --date <日期> --items '[...]'`

## 示例

- 云效提交汇总：`examples/codeup-commits-2026-04.md`

## API 参考

详见 `references/api.md`。
