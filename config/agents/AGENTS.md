# 项目规范

## TypeScript 全栈项目结构

基于 pnpm monorepo 的 TypeScript 全栈项目结构规范。

### 目录结构

```
project/
├── server/                  # 后端服务
│   ├── src/
│   │   ├── api/             # 路由 & 请求处理
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   └── index.ts
│   │   ├── service/         # 业务逻辑
│   │   │   ├── auth.ts
│   │   │   └── user.ts
│   │   ├── db/              # 数据库
│   │   │   ├── schema/      # 表结构定义
│   │   │   ├── migrations/  # 迁移文件
│   │   │   └── index.ts     # 数据库连接
│   │   ├── lib/             # 工具函数 & 通用模块
│   │   │   ├── jwt.ts
│   │   │   └── logger.ts
│   │   ├── env.ts           # 环境变量配置
│   │   └── main.ts          # 应用入口
│   ├── tests/               # API 集成测试
│   │   ├── auth.test.ts
│   │   └── users.test.ts
│   ├── vitest.config.ts
│   ├── Dockerfile           # 后端容器构建
│   ├── package.json
│   └── tsconfig.json
│
├── cli/                     # 命令行工具
│   ├── src/
│   │   ├── main.ts
│   │   └── env.ts
│   ├── package.json
│   └── tsconfig.json
│
├── web/                     # 前端应用（可选）
│   ├── public/              # 不经过构建处理的静态文件
│   ├── src/
│   │   ├── assets/          # 需要构建处理的资源（图片、字体等）
│   │   ├── routes/          # 页面路由
│   │   ├── components/      # UI 组件
│   │   │   └── ui/          # 基础组件（shadcn/ui）
│   │   ├── hooks/           # 自定义 Hooks
│   │   ├── stores/          # 状态管理
│   │   ├── lib/             # 工具函数
│   │   ├── index.css        # 全局样式入口
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── Dockerfile           # 前端容器构建
│   ├── package.json
│   └── tsconfig.json
│
├── pnpm-lock.yaml           # 依赖锁定文件
├── pnpm-workspace.yaml      # Workspace 配置
├── tsconfig.json             # 根 TypeScript 配置
├── .env.example
└── package.json
```

### 核心思路

- **server 为核心**，提供 RESTful API；**web**（给人用）和 **cli**（给 Agent 用）都是它的消费者
- **完整模式**：server + cli + web；**精简模式**：server + cli，去掉 web
- server 内部分层：api（路由） → service（业务逻辑） → db（数据访问），lib 放通用工具，env.ts 管理环境变量（Zod 校验）
- 测试（tests/）放在 server 内部，与 src/ 平级，只做 API 集成测试
- pnpm workspace 统一管理依赖

## 测试驱动开发（TDD）

后端 API 开发遵循 Red-Green TDD 流程：

1. **Red**：先写测试，运行确认失败（测试描述期望的行为）
2. **Green**：编写最少量的实现代码，使测试通过
3. **Refactor**：在测试保护下重构代码，保持测试通过

### 工作流

- 新增功能：先为新 API 编写集成测试，再实现 API 路由和业务逻辑
- 修复 Bug：先写能复现 Bug 的测试（红），再修复使其通过（绿）
- 测试文件与 API 文件一一对应，放在 `server/tests/` 目录下

## Web 技术栈

- 框架：React + TanStack Router
- 样式：Tailwind CSS
- 构建工具: Vite
- 数据请求：TanStack Query + ofetch
- 状态管理：Zustand
- UI 组件：shadcn/ui
- 类型与数据校验：TypeScript + Zod
- Form：TanStack Form
- Table: shadcn/ui + @tanstack/react-table
- Animation：Motion
- Package Manager: pnpm
- React Hooks: ahooks
- AI: Vercel AI SDK
- Markdown: Streamdown
- Rich Text Editor：@lexical/react
- 文件拖拽：react-dropzone

## 后端技术栈（Node.js）

- 框架：Hono + Bun
- 类型校验：Zod + @hono/zod-validator
- RPC：hono/client（前后端类型安全的 RPC 调用）
- 数据库 & ORM：PostgreSQL(pg + @types/pg) + Drizzle ORM + drizzle-kit
- 缓存：ioredis
- 请求：ofetch
- AI：Vercel AI SDK
- 认证：jose
- 环境配置：Zod
- 日志：pino + hono-pino
- 测试：Vitest
- 包管理：pnpm
- TS 执行：tsx
- 部署：Docker，开发环境 tsx watch，生产环境 Node.js
