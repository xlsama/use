import { parseArgs } from "node:util";
import { join } from "node:path";
import {
  PMS_BASE_URL,
  getPmsToken,
  fetchJson,
  getOutputDirectory,
} from "./pms-config";

// Types
type UtStatus = "" | "check" | "confirmed" | "rejected";

interface UtItem {
  id: number;
  projectId: number;
  projectName: string;
  val: number;
  status: UtStatus | null;
  date: string | null;
  type: string;
  utType: string | null;
  manDaysUsed: number;
  manDaysRemaining: number;
  totalManDays: number;
  stage: string;
}

interface ConsumeResponse {
  hasReject: boolean | null;
  submitFlag: boolean;
  isWorkDays: boolean;
  totalManDaysRemaining: number;
  uncommittedCount: Array<{ workDate: string; workHours: number }>;
  checkCount: number;
  rejectedCount: number;
  expiredCount: number | null;
  list: UtItem[];
}

interface ApiResponse {
  code: number;
  message: string;
  data?: ConsumeResponse;
}

// Helpers
function formatStatus(status: string | null | undefined): string {
  const map: Record<string, string> = {
    "": "未提交",
    check: "待审核",
    confirmed: "已确认",
    rejected: "已驳回",
  };
  return map[status ?? ""] ?? "未提交";
}

function formatFloat(value: unknown): number {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

function generateDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

async function queryConsume(
  token: string,
  date: string
): Promise<ApiResponse> {
  const params = new URLSearchParams({ date, loadHistory: "true" });
  return fetchJson<ApiResponse>(
    `${PMS_BASE_URL}/api/user/consume?${params}`,
    { headers: { token } }
  );
}

// Main
const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    date: { type: "string" },
    startDate: { type: "string" },
    endDate: { type: "string" },
    remaining: { type: "boolean", default: false },
    export: { type: "boolean", default: false },
    output: { type: "string" },
  },
});

const token = await getPmsToken();
if (!token) {
  console.error("Error: No token found. Please run pms-login.ts first.");
  process.exit(1);
}

const today = new Date().toISOString().split("T")[0];
const startDate = values.startDate ?? values.date ?? today;
const endDate = values.endDate ?? startDate;
const dates = generateDateRange(startDate, endDate);

// --remaining mode
if (values.remaining) {
  const result = await queryConsume(token, startDate);
  if (result.code === 401) {
    console.error("Error: Token expired, please login again");
    process.exit(1);
  }
  if (result.code !== 200) {
    console.error(`Error: ${result.message || "Unknown error"}`);
    process.exit(1);
  }
  const items = (result.data?.list ?? []).map((item) => ({
    projectId: item.projectId,
    projectName: item.projectName,
    manDaysRemaining: item.manDaysRemaining,
    totalManDays: item.totalManDays,
    manDaysUsed: item.manDaysUsed,
  }));
  console.log(JSON.stringify(items, null, 2));
  process.exit(0);
}

// Query all dates
const dailyResults: Array<{ date: string; data: ConsumeResponse }> = [];
for (const date of dates) {
  const result = await queryConsume(token, date);
  if (result.code === 401) {
    console.error("Error: Token expired, please login again");
    process.exit(1);
  }
  if (result.code !== 200) {
    console.error(`Error: ${result.message || "Unknown error"}`);
    process.exit(1);
  }
  dailyResults.push({ date, data: result.data! });
}

// --export mode
if (values.export) {
  const lines: string[] = ["# UT 导出", ""];
  if (startDate === endDate) {
    lines.push(`- 查询日期: ${startDate}`);
  } else {
    lines.push(`- 查询范围: ${startDate} 至 ${endDate}`);
    lines.push(`- 天数: ${dates.length}`);
  }
  lines.push(
    `- 导出时间: ${new Date().toLocaleString("zh-CN", { hour12: false })}`
  );
  lines.push("");

  for (const { date, data } of dailyResults) {
    lines.push(`## ${date}`);
    const uncommitted = data.uncommittedCount ?? [];
    const checkCount = data.checkCount ?? 0;
    const rejectedCount = data.rejectedCount ?? 0;
    lines.push(`- 未提交工作日: ${uncommitted.length} 天`);
    lines.push(`- 待审核: ${checkCount} 条 | 已驳回: ${rejectedCount} 条`);
    lines.push("");

    const items = data.list ?? [];
    if (!items.length) {
      lines.push("暂无记录。", "");
      continue;
    }

    lines.push(
      "| 项目名称 | 工时(小时) | 状态 | 已用(天) | 剩余(天) | 总配额(天) |"
    );
    lines.push("| --- | --- | --- | --- | --- | --- |");
    for (const item of items) {
      const name = item.projectName || "Unknown";
      const hours = formatFloat(item.val).toFixed(1);
      const status = formatStatus(item.status);
      const used = formatFloat(item.manDaysUsed).toFixed(1);
      const remaining = formatFloat(item.manDaysRemaining).toFixed(1);
      const total = formatFloat(item.totalManDays).toFixed(1);
      lines.push(
        `| ${name} | ${hours} | ${status} | ${used} | ${remaining} | ${total} |`
      );
    }
    lines.push("");
  }

  const workingDir = getOutputDirectory();
  const defaultName =
    startDate === endDate
      ? `ut-${startDate}.md`
      : `ut-${startDate}_to_${endDate}.md`;
  const outputPath = values.output ?? join(workingDir, defaultName);
  await Bun.write(outputPath, lines.join("\n"));
  console.log(`Exported UT markdown to: ${outputPath}`);
} else {
  // Default: print to stdout
  for (const { date, data } of dailyResults) {
    const items = data.list ?? [];
    console.log(`\n${date}`);
    if (!items.length) {
      console.log("  - 无记录");
      continue;
    }
    for (const item of items) {
      const name = item.projectName || "Unknown";
      const status = formatStatus(item.status);
      console.log(`  - ${name} | ${status}`);
    }
  }
}
