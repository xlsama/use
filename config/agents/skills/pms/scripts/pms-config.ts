import { existsSync, mkdirSync } from "node:fs";
import { parseArgs } from "node:util";
import { homedir } from "node:os";
import { join, dirname } from "node:path";

// Constants
export const CONFIG_PATH = join(homedir(), ".config", "yechtech-settings.json");
export const PMS_BASE_URL = "https://pms.yechtech.com";
export const YUNXIAO_BASE_URL =
  "https://openapi-rdc.aliyuncs.com/oapi/v1/codeup";
export const YUNXIAO_ORG_ID = "5ea6d701e17c0e0001fd9e96";

// Types
export interface YechtechConfig {
  ut?: { pmsToken?: string };
  yunxiao?: { token?: string; email?: string };
}

// Config I/O
export function loadConfig(): YechtechConfig {
  try {
    if (!existsSync(CONFIG_PATH)) return {};
    return JSON.parse(Bun.file(CONFIG_PATH).text() as unknown as string);
  } catch {
    return {};
  }
}

export async function loadConfigAsync(): Promise<YechtechConfig> {
  try {
    if (!existsSync(CONFIG_PATH)) return {};
    const text = await Bun.file(CONFIG_PATH).text();
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function saveConfig(config: YechtechConfig): Promise<void> {
  const dir = dirname(CONFIG_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
}

// Token shortcuts
export async function getPmsToken(): Promise<string | undefined> {
  const config = await loadConfigAsync();
  return config.ut?.pmsToken;
}

export async function getYunxiaoToken(): Promise<string | undefined> {
  const config = await loadConfigAsync();
  return config.yunxiao?.token;
}

export async function getYunxiaoEmail(): Promise<string | undefined> {
  const config = await loadConfigAsync();
  return config.yunxiao?.email;
}

// Output directory (ORIGINAL_CWD handling)
export function getOutputDirectory(): string {
  const originalCwd = process.env.ORIGINAL_CWD;
  if (originalCwd) return originalCwd;

  const cwd = process.cwd();
  if (cwd.includes(".claude/plugins/cache")) return homedir();
  return cwd;
}

// HTTP helper
export async function fetchJson<T = any>(
  url: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
  }
): Promise<T> {
  const resp = await fetch(url, {
    method: options?.method ?? "GET",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
  return resp.json() as Promise<T>;
}

// Token masking
export function maskToken(token: string): string {
  if (token.length <= 8) return token;
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

// CLI mode
if (import.meta.main) {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      show: { type: "boolean", default: false },
      "set-yunxiao-token": { type: "string" },
      "set-yunxiao-email": { type: "string" },
    },
  });

  if (values["set-yunxiao-token"] || values["set-yunxiao-email"]) {
    const config = await loadConfigAsync();
    const yunxiao = config.yunxiao ?? {};
    if (values["set-yunxiao-token"]) yunxiao.token = values["set-yunxiao-token"];
    if (values["set-yunxiao-email"]) yunxiao.email = values["set-yunxiao-email"];
    config.yunxiao = yunxiao;
    await saveConfig(config);
    console.log(`Saved config to ${CONFIG_PATH}`);
    if (yunxiao.token) console.log(`  token: ${maskToken(yunxiao.token)}`);
    if (yunxiao.email) console.log(`  email: ${yunxiao.email}`);
  } else {
    // --show or default
    const config = await loadConfigAsync();
    console.log(`Config: ${CONFIG_PATH}\n`);
    const pmsToken = config.ut?.pmsToken;
    console.log(
      `PMS Token: ${pmsToken ? maskToken(pmsToken) : "(not set)"}`
    );
    const yxToken = config.yunxiao?.token;
    console.log(
      `Yunxiao Token: ${yxToken ? maskToken(yxToken) : "(not set)"}`
    );
    console.log(`Yunxiao Email: ${config.yunxiao?.email ?? "(not set)"}`);
  }
}
