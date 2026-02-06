---
description: 修复类型错误
---

检测当前项目类型并修复类型/lint 错误：

## 项目类型检测

- 存在 `package.json` → TypeScript/JavaScript 项目
- 存在 `pyproject.toml` → Python 项目

## TypeScript 项目

1. 运行 `pnpm build` 检查类型错误
2. 运行 `pnpm lint` 检查 lint 错误
3. 逐个修复发现的错误
4. 修复完成后运行 `pnpm format` 格式化代码

## Python 项目

1. 运行 `uv run ruff check --fix` 检查并自动修复
2. 如有剩余错误，手动修复
3. 修复完成后运行 `uv run ruff format` 格式化代码

## 工作流程

1. 先检测项目类型
2. 运行对应的检查命令
3. 分析错误输出，逐个修复
4. 重复检查直到无错误
5. 最后格式化代码
