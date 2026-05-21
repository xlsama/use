## 技术栈偏好

### Frontend

- React + TypeScript + Vite Plus + TanStack Router + TanStack Query + Zod + Zustand + TanStack Form + date-fns
- Tailwind CSS + shadcn/ui + TanStack Table + lucide-react + Motion

### Backend

- TypeScript + Bun + Hono + @hono/zod-validator + Drizzle ORM + PostgreSQL + Supabase + Better Auth

### Deploy

- Cloudflare Workers + Wrangler + Hyperdrive

### Monorepo & API

前后端同仓使用 pnpm workspace 管理，通信统一走 Hono RPC（`hc<AppType>`）。

## 命令执行

- 执行 npm 包脚本一律用 `bunx`，不要用 `npx`。例：`bunx skills update -g`。

## 前端测试

- 前端页面测试优先使用 [@Chrome](plugin://chrome@openai-bundled) 插件在真实 Chrome Tab 中验证；若 Chrome 插件不可用或需要直接操作当前屏幕，再使用 Computer Use，避免默认改用外部 Playwright。
