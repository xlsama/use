---
name: ut-summary-by-commits
description: 根据云效 Git commits 生成每日工作汇总报告 (user)
---

# UT Summary by Commits

生成指定日期范围内的工作汇总（UT）报告。

## 使用方式

```bash
npx tsx <skill_dir>/scripts/generate_ut_report.ts <startDate> <endDate> <outputPath>
```

**示例**（假设用户在 ~/notes 目录，当前是 2025 年 1 月）：

```bash
# 用户说：生成当月 ut 报告
npx tsx <skill_dir>/scripts/generate_ut_report.ts 2025-01-01 2025-01-31 ~/notes/ut_report_2025-01-01_2025-01-31.md

# 用户说：生成 2025-11 的 ut 报告
npx tsx <skill_dir>/scripts/generate_ut_report.ts 2025-11-01 2025-11-30 ~/notes/ut_report_2025-11-01_2025-11-30.md
```

**注意**：

- `<skill_dir>` = 此 SKILL.md 所在目录
- 如用户未指定日期，使用当月第一天到最后一天
- 输出到用户当前工作目录

## 配置

配置文件：`~/.config/claude-skills-config.json`

```json
{
  "ut-summary-by-commits": {
    "yunxiao": { "token": "pt-xxx", "orgId": "xxx" },
    "user": { "email": "xxx@example.com" }
  }
}
```

若配置缺失，脚本会报错提示用户创建
