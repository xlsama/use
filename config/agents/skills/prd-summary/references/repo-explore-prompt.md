# Explore subagent prompt 模板（仓库交叉对比）

Step 4 用 `Agent` + `subagent_type: "Explore"`，**前后端并行**派出（一条消息里多个 tool calls）。

每个 subagent 拿到的是 **本期功能清单**（Step 3 整理） + **仓库根路径**，输出结构化的「已实现 / 部分 / 新增」对照表。

---

## prompt 模板（按 {占位符} 替换后整段贴进 Agent.prompt）

```text
你是这个 {前端|后端} 仓库的代码考古员。任务：拿一份本期需求功能清单，去仓库里找每一项的实现痕迹，
告诉我哪些已经做了、哪些只做了一半、哪些完全没做。**只读不改**。

## 仓库根路径
{abs_repo_path}

## 仓库类型
{前端|后端}（用户在 prd-summary skill 进门四问里选的）

## 本期功能清单（来自 PRD 梳理）
{逐条列出，每条 1-2 句}
例：
- 用户在订单详情页能看到"申请退款"按钮，点击后弹一个表单收退款原因
- 后端新增 POST /api/orders/{id}/refund 接口，幂等，写入 refund_records 表
- ...

## 工作步骤

1. 先用 1-2 个 grep / find 摸清仓库结构（语言、框架、目录约定）。不超过 5 次工具调用就该有判断。
2. 对每一条功能，搜关键字（中英文都搜，业务词 + 技术词）+ 看相关目录：
   - 前端：路由表 (router/routes/pages)、组件 (components/views)、API 调用层 (api/services/request)、状态管理 (store/pinia/redux/zustand)
   - 后端：controller/handler/router、service、model/entity/schema、migration
3. 每一条功能都给一个状态判断 + 证据：
   - ✅ 已实现：路径、关键文件名:行号
   - 🟡 部分实现：列出已有什么、差什么
   - ⬜ 未实现：搜了哪些关键字都没命中，简要说明
   - ❓ 不确定：解释为什么模糊（命名歧义、找到多处疑似）
4. 顺手列出本期清单**没提**但跟它强相关、可能受影响的现有模块/接口（"邻居告警"），最多 3 条。

## 输出格式（严格按这个 markdown 结构，便于上层程序消费）

### 仓库摘要
- 框架/语言：<>
- 关键目录：<列 3-5 个最重要的>
- 风格特征：<一两句，比如"组件按业务模块分目录""controller 极薄，逻辑全在 service""有自家 useRequest"等>

### 功能逐条对照
| # | 功能 | 状态 | 证据 / 差什么 |
|---|------|------|--------------|
| 1 | <功能描述> | ✅/🟡/⬜/❓ | `path/to/file.ts:42` 已有 X；缺 Y |
| 2 | ... |

### 邻居告警（清单外但本期可能要碰的现有模块）
- <模块/接口> at `path:line` —— <为什么受影响>

### 给上层 Claude 的话
- 本期建议优先动哪几个目录
- 有没有现成可复用的组件/工具（带路径）
- 是否发现仓库里已有部分 PRD 没提到、但显然是同一需求的旧实现（避免重复造）

## 输出规模硬限制
- 总长度 ≤ 800 字（中文）
- 工具调用 ≤ 30 次（grep/find/read），不要逐文件 cat
- 不要粘贴大段源代码，只给路径和精炼描述
```

---

## 派 subagent 的方式（在 SKILL.md 里照搬）

```
# 主对话里，前后端并行（一条消息两个 tool call）：
Agent({ description: "扫前端仓库", subagent_type: "Explore", prompt: 上面模板填好 })
Agent({ description: "扫后端仓库", subagent_type: "Explore", prompt: 上面模板填好 })
```

只有 1 个仓库就只派 1 个。返回后把两份报告 **不展开** 直接喂给 Step 5 的输出生成阶段。
