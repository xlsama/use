import { parseArgs } from "node:util";
import {
  PMS_BASE_URL,
  CONFIG_PATH,
  loadConfigAsync,
  saveConfig,
  fetchJson,
} from "./pms-config";

interface LoginResponse {
  code: number;
  message: string;
  token?: string;
  data?: {
    id: number;
    name: string;
    loginName: string;
    userCode: string;
    deptCode: string;
  };
}

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    username: { type: "string", short: "u" },
    password: { type: "string", short: "p" },
  },
});

if (!values.username || !values.password) {
  console.error("Usage: bun scripts/pms-login.ts -u <username> -p <password>");
  process.exit(1);
}

console.log(`Logging in as ${values.username}...`);

const result = await fetchJson<LoginResponse>(`${PMS_BASE_URL}/api/login`, {
  method: "POST",
  body: { loginName: values.username, password: values.password },
});

if (result.code !== 200) {
  console.error(`Error: ${result.message || "Login failed"}`);
  process.exit(1);
}

if (!result.token) {
  console.error("Error: No token in response");
  process.exit(1);
}

const config = await loadConfigAsync();
config.ut = { ...config.ut, pmsToken: result.token };
await saveConfig(config);

const user = result.data;
console.log("\nLogin successful!");
console.log(`  Name: ${user?.name ?? "N/A"}`);
console.log(`  User Code: ${user?.userCode ?? "N/A"}`);
console.log(`  Department: ${user?.deptCode ?? "N/A"}`);
console.log(`\nToken saved to: ${CONFIG_PATH}`);
