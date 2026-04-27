# 输出文件模板

落到 `<cwd>/.prd-summary/<YYYYMMDD-HHMMSS>/`：

- **始终生成** `requirement-summary.md`
- **若用户在进门四问选「+技术文档」**，再生成 `tech-spec.md`

两份都用中文，通俗易懂。摘要给非技术同事也能看懂；技术文档要详细到可以**直接复制粘贴给一个新 Claude session 让它开工实现**。

---

## requirement-summary.md 模板

```markdown
# <项目/版本名> 需求摘要

> 输入材料：<列每份输入的简称，比如"PRD-v3.docx / 原型-V2.pptx / 飞书《XX 二期需求》">
> 关联仓库：<前端: `~/code/foo-web` / 后端: `~/code/foo-api` / 未关联>
> 生成时间：<YYYY-MM-DD HH:MM>

## 一句话总览
<本期做什么、面向谁、为什么。一两句话讲完，不堆技术词>

## 涉及的页面 / 模块
| # | 页面或模块 | 给谁看 | 做什么 | 状态 |
|---|-----------|-------|-------|-----|
| 1 | 订单详情页 | C 端用户 | 新增"申请退款"入口 | ⬜ 新增 |
| 2 | 后台-退款审批 | 客服 | 新建一个列表页+审批弹窗 | ⬜ 新增 |
| 3 | 个人中心 | C 端用户 | 加一条"我的退款"入口 | 🟡 部分（入口在 `web/src/pages/profile.vue:42`，但要改图标和文案） |

> 状态图例：✅ 已有 / 🟡 部分 / ⬜ 新增 / ❓ 待确认（仅在跑过仓库对比时填写，否则整列留空或都填⬜）

## 涉及的接口 / 数据流
- **新增** `POST /api/orders/{id}/refund` —— 用户提交退款申请，幂等，写 `refund_records` 表 ⬜
- **改动** `GET /api/orders/{id}` —— 返回里加 `refund_status` 字段 🟡（接口已有：`api/order_controller.py:88`，加字段即可）
- **新增** WebSocket 推送：审批状态变更时通知客户端 ⬜

## 关键流程（用户视角）
1. 用户在订单详情点"申请退款"
2. 弹表单填写理由 → 提交 → 接口返回受理号
3. 客服在后台看到审批列表 → 通过/驳回
4. 用户收到 WebSocket 推送 + 站内信

## 仍然 TBD
- <Step 3 用户选「跳过」的所有提问，原样列出，每条带原文档片段引用>
- <仓库对比里的"❓ 不确定"项>
- <用户在 AskUserQuestion 走 Other 自填的内容>

## 附录：原始材料 manifest
所有解析产物在临时目录：`<tmp_session_dir>/`
| # | 来源 | 类型 | 状态 | parsed.md |
|---|------|------|------|----------|
| 1 | `PRD-v3.docx` | local | parsed | `<tmp>/1/parsed.md` |
| 2 | `https://xxx.feishu.cn/docx/...` | feishu | skipped | — |
```

---

## tech-spec.md 模板（仅当用户选了"+技术文档"）

```markdown
# <项目/版本名> 技术实现文档

> 配套阅读：`./requirement-summary.md`
> 关联仓库：<同摘要>
> 生成时间：<YYYY-MM-DD HH:MM>

> ⚠️ 说明：本文档面向「下一个 Claude session 直接开工」，因此每个新增项都尽量给出文件路径建议、参考既有实现的 file_path:line。**不写完整代码**，只列签名、字段、关键流程。

## 1. 前端（仓库：`<path>`）

### 1.1 新增页面 / 组件
#### 订单详情页 - "申请退款"按钮 + 表单弹窗
- **改动文件**：`web/src/pages/order/detail.vue`
- **新增组件**：`web/src/components/order/RefundDialog.vue`
- **可复用**：`web/src/components/common/FormDialog.vue:1`（项目自带 dialog 外壳，参考 `web/src/pages/coupon/IssueDialog.vue:1` 的用法）
- **状态管理**：在 `web/src/stores/order.ts` 加 `submitRefund` action
- **关键流程**：
  1. 点击按钮 → 打开 RefundDialog
  2. 表单字段：原因 (textarea, required, 200 字)、附件 (最多 3 张图)
  3. 提交 → 调 `apiSubmitRefund(orderId, payload)` → 成功后关闭弹窗 + toast + 刷新订单状态

### 1.2 改动接口调用
- 在 `web/src/api/order.ts` 加：
  ```ts
  export const apiSubmitRefund = (orderId: string, payload: RefundPayload) =>
    request.post(`/api/orders/${orderId}/refund`, payload)
  ```
- `RefundPayload` 类型加到 `web/src/types/order.ts`

### 1.3 路由 / 导航
- 个人中心新增「我的退款」入口：改 `web/src/pages/profile.vue:42` 的 menu 数组

---

## 2. 后端（仓库：`<path>`）

### 2.1 新增接口
#### POST /api/orders/{id}/refund
- **路由**：`api/routers/order.py`
- **handler**：`api/controllers/order_controller.py` 新增 `submit_refund(order_id, body)`
- **service**：`api/services/refund_service.py`（新建文件）
- **可复用**：`api/services/order_service.py:1` 的事务装饰器 `@with_transaction`
- **幂等**：用 `body.client_token` + `order_id` 做唯一索引；若重复请求返回相同结果
- **payload schema**：
  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | reason | str | ✅ | 200 字内 |
  | images | list[str] | ❌ | 最多 3 个 OSS key |
  | client_token | str | ✅ | 幂等用 |

### 2.2 改动接口
- `GET /api/orders/{id}` 返回里加 `refund_status` 字段，枚举：`none / pending / approved / rejected`
  - 改 `api/schemas/order.py:OrderDetail` 加字段
  - 改 `api/services/order_service.py:get_detail` 联查 `refund_records` 表

### 2.3 数据模型
- **新建表** `refund_records`：
  | 字段 | 类型 | 索引 |
  |------|------|------|
  | id | bigint pk | |
  | order_id | bigint | idx |
  | user_id | bigint | idx |
  | reason | text | |
  | images | jsonb | |
  | status | enum | |
  | client_token | varchar(64) | uniq(order_id, client_token) |
  | created_at | timestamp | |
  | updated_at | timestamp | |
- **migration**：`api/migrations/<下一个序号>_create_refund_records.py`，参考 `api/migrations/0042_xxx.py`

### 2.4 推送
- 审批状态变更后调 `api/services/notify_service.py:push_to_user(user_id, payload)`（已有，参考 `api/services/order_service.py:213` 的调用）

---

## 3. 联调要点
- 前端在订单状态变更时通过 WebSocket 收到 `{type: "refund_status_changed", order_id, status}`，刷新本订单
- 退款金额暂不在本期处理，仅做申请→审批流，资金回退走线下

---

## 4. 不在本期范围
- <从需求摘要里搬过来"仍然 TBD"的部分，提醒下一个 session 不要顺手做>
```

---

## 写作风格指南

- **摘要**：短、白话、能让产品同事和客服都看懂；避免类型签名、ORM 术语
- **技术文档**：面向 Claude 自己读，可以用 `file_path:line`、字段表、payload schema，但**不要粘整段代码**
- **状态标记**：✅🟡⬜❓ 在 markdown 里渲染好看且检索友好；状态语义在每份输出顶部图例里说明一次
- **manifest 附录**：必出。让用户出问题时能定位到中间产物
