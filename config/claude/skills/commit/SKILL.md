---
name: auto-commit
description: 自动生成 commit 消息并推送到远程仓库。当用户想要提交代码、需要生成 commit 消息时触发此技能。
---

## 上下文

- 当前 git 状态：!`git status`
- 当前变更内容：!`git diff HEAD`
- 当前分支：!`git branch --show-current`
- 最近提交记录：!`git log --oneline -10`

## 任务

1. 分析 diff 内容，**深入理解代码的业务上下文和变更意图**
2. 生成 3 个候选 commit 消息
   - 使用 Conventional Commits 格式（feat:, fix:, docs:, refactor:, chore:, perf:, test:, ci:, style:）
   - **必须使用中文撰写**
   - **关注业务语义，而非文件变更**：描述"做了什么功能/修复了什么问题"，而不是"改了哪个文件"
   - 结合代码上下文理解业务场景（如组件用途、功能模块、用户视角等）
3. 从 3 个候选消息中选择最合适的一个，并说明选择理由

### Commit 消息示例

**好的写法：**

- `feat: 在多店视角下，将"取消计划"改为"修改计划"`
- `fix: 修复订单列表在空数据时的崩溃问题`
- `refactor: 统一门店选择器的状态管理逻辑`

**差的写法（禁止）：**

- `feat: update main.tsx` ❌
- `fix: modify StoreList component` ❌
- `chore: change some code` ❌

4. 如有需要，使用 `git add` 暂存变更
5. 使用选定的消息执行 `git commit`
6. 执行 `git push` 推送到远程仓库
   - 若当前分支无上游，使用 `git push -u origin <分支名>`

## 约束

- 请勿在提交记录中添加 Claude 的共同作者署名或 AI 生成标识
- 如果没有任何变更，告知用户并停止操作
- 敏感文件（.env、credentials、密钥等）需提醒用户确认，不自动添加
