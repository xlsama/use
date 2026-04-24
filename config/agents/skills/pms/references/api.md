# PMS-Web API 参考

Base URL: `https://pms.yechtech.com`

## 认证

除登录接口外，所有 API 请求都需要在 Header 中携带 `token`。

## 接口列表

### POST /api/login

登录获取用户信息和 token。

**请求体：**

```typescript
{
  loginName: string
  password: string
}
```

**响应：**

```typescript
{
  code: number // 200 表示成功
  message: string
  token: string // 认证令牌
  data: LoginRes
}
```

---

### GET /api/user/consume

查询 UT（工时）数据。

**重要说明**：

- `date` 参数指定查询日期，一次只能查询一天的数据
- 返回的 `list` 是**项目配额汇总列表**，包含各项目的工时使用情况
- `uncommittedCount` 返回当前所有未提交 UT 的工作日

**请求参数：**

| 参数        | 类型    | 说明                                          |
| ----------- | ------- | --------------------------------------------- |
| date        | string  | 查询日期，格式 `YYYY-MM-DD`，一次只能查询一天 |
| loadHistory | boolean | 是否加载历史数据（默认 false）                |

**响应字段说明**：

| 字段                           | 说明                             |
| ------------------------------ | -------------------------------- |
| `list[]`                       | 项目配额汇总列表                 |
| `list[].projectId`             | 项目 ID                          |
| `list[].projectName`           | 项目名称                         |
| `list[].type`                  | 类型（如 `project`）             |
| `list[].val`                   | 当前值                           |
| `list[].manDaysUsed`           | 该项目累计已用工时（人天）       |
| `list[].manDaysRemaining`      | 该项目剩余可用工时               |
| `list[].totalManDays`          | 该项目总工时配额                 |
| `list[].status`                | UT 状态                          |
| `list[].stage`                 | 项目阶段（如"不分阶段"）         |
| `totalManDaysRemaining`        | 所有项目剩余工时总和             |
| `submitFlag`                   | 是否可提交                       |
| `isWorkDays`                   | 当前日期是否为工作日             |
| `uncommittedCount[]`           | 当前所有未提交 UT 的工作日列表   |
| `uncommittedCount[].workDate`  | 工作日期                         |
| `uncommittedCount[].workHours` | 应工作小时数                     |
| `rejectedCount`                | 被驳回的 UT 记录数量             |
| `checkCount`                   | 待审核的 UT 记录数量             |

**请求示例：**

```bash
curl 'https://pms.yechtech.com/api/user/consume?date=2025-11-01&loadHistory=true' \
  -H 'token: <your-token>'
```

**响应示例：**

```json
{
  "code": 200,
  "success": true,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "type": "project",
        "projectId": 1734,
        "projectName": "【无薪假】如事假等无薪假期专用",
        "val": 0,
        "status": null,
        "totalManDays": 21,
        "manDaysUsed": 17,
        "manDaysRemaining": 4,
        "stage": "不分阶段"
      },
      {
        "type": "project",
        "projectId": 1733,
        "projectName": "【带薪假】如个人年假、调休等不影响工资发放",
        "val": 0,
        "status": null,
        "totalManDays": 5,
        "manDaysUsed": 1.5,
        "manDaysRemaining": 3.5,
        "stage": "不分阶段"
      }
    ],
    "submitFlag": true,
    "isWorkDays": false,
    "totalManDaysRemaining": 7.5,
    "uncommittedCount": [
      { "workDate": "2026-01-01", "workHours": 0 },
      { "workDate": "2026-01-02", "workHours": 0 },
      { "workDate": "2026-01-05", "workHours": 0 }
    ],
    "checkCount": 0,
    "rejectedCount": 6
  }
}
```

---

### PUT /api/user/consume

提交/更新 UT 记录。

**请求体：**

```typescript
{
  weekIndex?: number
  list: Array<{
    date: string        // 格式: YYYY-MM-DD
    projectId: number
    projectName: string
    status: UtStatus    // 提交时通常为空字符串
    type: string        // 默认 "development"
    utType: number      // 默认 1
    val: number         // 工时小时数
  }>
}
```

---

### GET /api/user/reject

获取被驳回的 UT 记录。

**响应：**

```typescript
{
  code: number
  message: string
  data: UtItem[]
}
```

---

### POST /api/changePwd

修改用户密码。

**请求体：**

```typescript
{
  password: string
}
```

---

## 类型定义

### UtStatus

UT 状态枚举：

| 值              | 说明   |
| --------------- | ------ |
| `''` (空字符串) | 未提交 |
| `'check'`       | 待审核 |
| `'confirmed'`   | 已确认 |
| `'rejected'`    | 已驳回 |

### LoginRes

登录响应用户信息：

```typescript
interface LoginRes {
  id: number
  name: string // 用户姓名
  loginName: string // 登录名
  userCode: string // 用户编码
  deptCode: string // 部门编码
  // ... 其他字段
}
```

### ConsumeRes

工时查询响应：

```typescript
interface ConsumeRes {
  hasReject: boolean | null
  submitFlag: boolean
  isWorkDays: boolean
  totalManDaysRemaining: number
  uncommittedCount: Array<{
    workDate: string
    workHours: number
  }>
  checkCount: number
  rejectedCount: number
  expiredCount: number | null
  list: Array<UtItem>
}
```

### UtItem

UT 记录项：

```typescript
interface UtItem {
  id: number
  projectId: number
  projectName: string
  val: number // 工时小时数
  status: UtStatus
  date: string | null
  type: string // 类型，如 "project"
  utType: string | null
  manDaysUsed: number // 已用人天
  manDaysRemaining: number // 剩余人天
  totalManDays: number // 总配额人天
  stage: string // 项目阶段，如 "不分阶段"
  // ... 其他字段
}
```

---

## 错误码

| 错误码 | 说明                            |
| ------ | ------------------------------- |
| 200    | 成功                            |
| 401    | Token 过期或无效                |
| 其他   | 查看 `message` 字段获取详细信息 |
