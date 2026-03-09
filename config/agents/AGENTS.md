# User Preferences

## 编程语言

- **首选**: TypeScript
- **次选**: Python（使用 uv 管理项目和安装依赖）
- **Shell**: fish

## 前端技术栈

- 框架：React + TanStack Router
- 样式：Tailwind CSS
- 构建工具: Vite, Vite Plugins: babel-plugin-react-compiler + tailwindcss + @tanstack/router-plugin/vite
- 数据请求：TanStack Query + ofetch
- 状态管理：Zustand
- UI 组件：shadcn/ui
- 类型与数据校验：TypeScript + Zod
- 表单：TanStack Form
- 表格: shadcn/ui + @tanstack/react-table
- 动画：Motion
- 包管理：pnpm
- React Hooks: ahooks
- AI: Vercel AI SDK
- Promise: better-all
- Markdown: Streamdown
- 富文本编辑器：@lexical/react
- 文件拖拽：react-dropzone

## 后端技术栈（Python）

- 框架：FastAPI
- API 文档：OpenAPI, FastAPI 自带
- 包管理：uv
- 数据库 & ORM：PostgreSQL, SQLAlchemy 2.x asyncio + asyncpg + Alembic
- 缓存：redis, redis.asyncio
- 请求: httpx
- 异步任务队列：Celery
- 日志：loguru
- 环境配置：pydantic-settings
- 认证：pyjwt
- task runner: poethepoet
- 部署：Docker，开发环境 Uvicorn， 生产环境 Gunicorn + Uvicorn workers
- JSON 库: orjson

## 后端技术栈（Node.js）

- 框架：Hono
- 类型校验：Zod + @hono/zod-validator
- API 文档：@hono/zod-openapi（基于 Zod schema 自动生成 OpenAPI 文档）
- RPC：hono/client（前后端类型安全的 RPC 调用）
- 数据库 & ORM：PostgreSQL, Drizzle ORM + postgres（postgres.js 驱动）+ drizzle-kit（迁移管理）
- 缓存：ioredis
- 请求：ofetch
- AI：Vercel AI SDK
- 认证：@hono/jwt
- 环境配置：dotenv + Zod
- 日志：pino + hono-pino
- 测试：Vitest
- 包管理：pnpm
- TS 执行：tsx
- 部署：Docker，开发环境 tsx watch，生产环境 Node.js
