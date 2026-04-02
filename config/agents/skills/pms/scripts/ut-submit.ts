import { parseArgs } from "node:util";
import { PMS_BASE_URL, getPmsToken, fetchJson } from "./pms-config";

interface SubmitItem {
  projectId: number;
  projectName: string;
  val: number;
  type?: string;
  utType?: number;
}

interface ApiResponse {
  code: number;
  message: string;
  data?: unknown;
}

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    date: { type: "string" },
    items: { type: "string" },
  },
});

const token = await getPmsToken();
if (!token) {
  console.error(
    "Error: No token provided. Please run pms-login.ts first."
  );
  process.exit(1);
}

if (!values.items) {
  console.error("Error: --items is required");
  process.exit(1);
}

let items: SubmitItem[];
try {
  items = JSON.parse(values.items);
  if (!Array.isArray(items)) {
    console.error("Error: --items must be a JSON array");
    process.exit(1);
  }
} catch (e) {
  console.error(`Error: Invalid JSON in --items: ${e}`);
  process.exit(1);
}

if (!items.length) {
  console.error("Error: --items cannot be empty");
  process.exit(1);
}

// Validate
for (let i = 0; i < items.length; i++) {
  const item = items[i];
  if (!item.projectId || !item.projectName || item.val == null) {
    console.error(
      `Error: Item ${i} missing required field (projectId, projectName, val)`
    );
    process.exit(1);
  }
  const val = Number(item.val);
  if (isNaN(val) || val <= 0) {
    console.error(`Error: Item ${i} 'val' must be a positive number`);
    process.exit(1);
  }
}

const submitDate = values.date ?? new Date().toISOString().split("T")[0];

// Print summary
console.log(`\nSubmitting UT for date: ${submitDate}`);
console.log("-".repeat(60));
let totalHours = 0;
for (const item of items) {
  const val = Number(item.val);
  console.log(`  - ${item.projectName}: ${val} hours`);
  totalHours += val;
}
console.log("-".repeat(60));
console.log(`Total: ${totalHours} hours\n`);

// Build UT list
const utList = items.map((item) => ({
  date: submitDate,
  projectId: item.projectId,
  projectName: item.projectName,
  status: "",
  type: item.type ?? "development",
  utType: item.utType ?? 1,
  val: Number(item.val),
}));

const result = await fetchJson<ApiResponse>(
  `${PMS_BASE_URL}/api/user/consume`,
  {
    method: "PUT",
    headers: { token },
    body: { list: utList },
  }
);

if (result.code === 401) {
  console.error("Error: Token expired, please login again");
  process.exit(1);
}
if (result.code !== 200) {
  console.error(`Error: ${result.message || "Unknown error"}`);
  process.exit(1);
}

console.log("Success: UT submitted successfully!");
console.log(JSON.stringify(result, null, 2));
