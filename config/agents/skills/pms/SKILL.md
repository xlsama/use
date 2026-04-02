---
name: pms
description: 'PMS 工时与云效代码管理。触发词：查 UT、查工时、工时汇总、报工时、提交工时、驳回记录、未提交工时、导出 UT、导出工时、查提交、查 commits、导出提交、仓库列表、分支列表、代码提交汇总。'
---

# PMS 工时与云效代码管理

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

### 导出提交

```bash
ORIGINAL_CWD="<用户当前工作目录绝对路径>" bun scripts/yunxiao-commit.ts --startDate 2025-01-01 --endDate 2025-01-15 --export
```

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
2. **导出提交 markdown** 发给产品经理
3. PM 分配 UT 后，**查询剩余工时**：`bun scripts/ut-query.ts --remaining`
4. 根据分配结果**提交 UT**：`bun scripts/ut-submit.ts --date <日期> --items '[...]'`

## API 参考

详见 `references/api.md`。
