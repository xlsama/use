import { parseArgs } from "node:util";
import {
  YUNXIAO_BASE_URL,
  YUNXIAO_ORG_ID,
  getYunxiaoToken,
  fetchJson,
} from "./pms-config";

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    perPage: { type: "string", default: "100" },
    json: { type: "boolean", default: false },
  },
});

const perPage = parseInt(values.perPage!, 10);
if (isNaN(perPage) || perPage <= 0) {
  console.error("Error: --perPage must be a positive number");
  process.exit(1);
}

const token = await getYunxiaoToken();
if (!token) {
  console.error("Error: No token provided. Run pms-config.ts first.");
  process.exit(1);
}

const params = new URLSearchParams({ perPage: String(perPage) });
const url = `${YUNXIAO_BASE_URL}/organizations/${YUNXIAO_ORG_ID}/repositories?${params}`;

const repos = await fetchJson<any[]>(url, {
  headers: { "x-yunxiao-token": token },
});

if (values.json) {
  console.log(JSON.stringify(repos, null, 2));
} else {
  const list = Array.isArray(repos) ? repos : [];
  if (!list.length) {
    console.log("No repositories found.");
    process.exit(0);
  }
  console.log(`Found ${list.length} repositories`);
  console.log("id\tpath\tlastActivityAt\tvisibility\turl");
  for (const repo of list) {
    const id = repo.id ?? "";
    const path = repo.pathWithNamespace ?? repo.nameWithNamespace ?? "";
    const lastActivity = repo.lastActivityAt ?? "";
    const visibility = repo.visibility ?? "";
    const webUrl = repo.webUrl ?? "";
    console.log(`${id}\t${path}\t${lastActivity}\t${visibility}\t${webUrl}`);
  }
}
