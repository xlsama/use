---
description: Commit 当前工作区所有变更并 push 到 origin
model: sonnet
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git commit:*), Bash(git push:*), Bash(git branch:*), Bash(git log:*), Bash(git rev-parse:*)
---

## 当前工作区

- 分支：!`git branch --show-current`
- Status：!`git status --short`
- 变更详情：!`git --no-pager diff HEAD`
- 最近提交（风格参考）：!`git --no-pager log --oneline -10`

## 任务

将当前工作区的**所有变更** commit 并 push 到 origin：

1. `git add -A` 暂存所有变更（含新增 / 修改 / 删除）
2. 结合上面的变更内容，按下面「Git 规范」生成一条 commit message，合并为**单个** commit 提交
3. push 到 origin：
   - 当前分支已有 upstream → `git push`
   - 没有 upstream → `git push -u origin <当前分支>`

补充说明（用户提供时，优先据此理解变更意图）：$ARGUMENTS

## 约定

- 不添加 Co-Authored-By 等署名 trailer
- 所有变更合并为一个 commit，不做拆分
- 若无任何变更，直接告知并跳过，不要创建空提交
- 若 commit 触发 pre-commit hook 失败，停下报告，不要用 `--no-verify` 绕过

## Git 规范

- 使用 Conventional Commits 格式（feat:, fix:, docs:, refactor:, chore:, perf:, test:, ci:, style:）
- 必须使用中文撰写
- 关注业务语义，而非文件变更：描述"做了什么功能/修复了什么问题"，而不是"改了哪个文件"
- 结合代码上下文理解业务场景（如组件用途、功能模块、用户视角等）

## Commit example

好的写法：

- feat: 在多店视角下，将"取消计划"改为"修改计划"
- fix: 修复订单列表在空数据时的崩溃问题
- refactor: 统一门店选择器的状态管理逻辑

差的写法（禁止）：

- feat: update main.tsx
- fix: modify StoreList component
- chore: change some code
