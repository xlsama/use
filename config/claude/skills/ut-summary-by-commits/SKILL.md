---
name: ut-summary-by-commits
description: 根据云效 Git commits 生成每日工作汇总报告
---

# UT Summary by Commits

根据指定日期范围内的 Git commits 生成每日工作汇总（UT）报告。

## When to Use

当用户说以下内容时触发此 skill：

- "生成当月 ut 报告"
- "生成本月工作汇总"
- "生成 2025-12-01 到 2025-12-31 的 ut 报告"
- 或其他类似的日期范围 + ut/工作汇总的请求

## How to Execute

运行此 skill 目录下的 `scripts/generate_ut_report.ts` 脚本：

```bash
# 指定日期范围和输出路径
bun <skill_dir>/scripts/generate_ut_report.ts <startDate> <endDate> <user_cwd>/ut_report_<startDate>_<endDate>.md
```

> **重要**：
>
> - `<skill_dir>` 是此 SKILL.md 文件所在的目录路径
> - `<user_cwd>` 是用户运行命令时的当前工作目录
> - **必须始终传递全部三个参数**，确保报告生成到用户当前目录
> - 如果用户没有指定日期范围，使用当月第一天和最后一天

### 参数说明

| 参数       | 必选 | 说明                                                          |
| ---------- | ---- | ------------------------------------------------------------- |
| startDate  | 否   | 开始日期，格式 YYYY-MM-DD，默认当月第一天                     |
| endDate    | 否   | 结束日期，格式 YYYY-MM-DD，默认当月最后一天                   |
| outputPath | 否   | 输出文件路径，默认当前目录下 `ut_report_开始日期_结束日期.md` |

## Configuration

脚本从全局配置文件 `~/.config/claude-skills-config.json` 读取配置。

首次使用前，需要创建配置文件并添加 `ut-summary-by-commits` 配置：

```json
{
  "ut-summary-by-commits": {
    "yunxiao": {
      "token": "pt-your-token-here",
      "orgId": "your-org-id"
    },
    "user": {
      "email": "your-email@example.com"
    }
  }
}
```

| 配置项        | 必选 | 说明                                   |
| ------------- | ---- | -------------------------------------- |
| yunxiao.token | 是   | 云效 API Token                         |
| yunxiao.orgId | 是   | 云效组织 ID                            |
| user.email    | 否   | 用户邮箱，用于过滤只保留自己的 commits |

## Output Format

```markdown
# UT Report: 2025 年 12 月

## 2025-12-29

### store-health-web

- chore: release v1.2.0 - 新增 SVT 功能，Comparison 重构
- chore: integrate API
- feat: add checked
- fix: resolve duplicate request issue

### another-project

- feat: add new feature
- fix: bug fix

## 2025-12-12

### store-health-web

- chore: release v1.1.0
```

## Important Notes

1. **用户过滤**：只统计配置中 `user.email` 对应的 commits
2. **去重**：同一天同一项目下，相同的 commit message 只显示一次

## Example Interaction

**User**: 生成当月 ut 报告

**Assistant**:（假设当前是 2025 年 1 月，用户在 ~/notes 目录）

```bash
bun <skill_dir>/scripts/generate_ut_report.ts 2025-01-01 2025-01-31 ~/notes/ut_report_2025-01-01_2025-01-31.md
```

**User**: 生成 2025-11-01 到 2025-11-30 的 ut 报告

**Assistant**:（假设用户在 ~/notes 目录）

```bash
bun <skill_dir>/scripts/generate_ut_report.ts 2025-11-01 2025-11-30 ~/notes/ut_report_2025-11-01_2025-11-30.md
```
