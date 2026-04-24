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
    repoId: { type: "string" },
    perPage: { type: "string", default: "100" },
    json: { type: "boolean", default: false },
  },
});

if (!values.repoId) {
  console.error(
    "Usage: bun scripts/yunxiao-list-branch.ts --repoId <repoId>"
  );
  process.exit(1);
}

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
const url = `${YUNXIAO_BASE_URL}/organizations/${YUNXIAO_ORG_ID}/repositories/${values.repoId}/branches?${params}`;

const branches = await fetchJson<any[]>(url, {
  headers: { "x-yunxiao-token": token },
});

if (values.json) {
  console.log(JSON.stringify(branches, null, 2));
} else {
  const list = Array.isArray(branches) ? branches : [];
  if (!list.length) {
    console.log("No branches found.");
    process.exit(0);
  }
  console.log(`Found ${list.length} branches`);
  console.log("name\tdefault\tprotected\tcommit");
  for (const branch of list) {
    const name = branch.name ?? "";
    const isDefault = branch.defaultBranch ? "yes" : "";
    const isProtected = branch.protected ? "yes" : "";
    const commit = branch.commit?.shortId ?? "";
    console.log(`${name}\t${isDefault}\t${isProtected}\t${commit}`);
  }
}
