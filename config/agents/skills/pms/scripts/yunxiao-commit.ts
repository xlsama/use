import { parseArgs } from "node:util";
import { join } from "node:path";
import {
  YUNXIAO_BASE_URL,
  YUNXIAO_ORG_ID,
  getYunxiaoToken,
  getYunxiaoEmail,
  fetchJson,
  getOutputDirectory,
} from "./pms-config";

// Helpers
function normalizeDateTime(value: string, suffix: string): string {
  return value.includes("T") ? value : `${value}${suffix}`;
}

function isMergeCommit(title: string): boolean {
  return (
    title.startsWith("Merge #") || title.toLowerCase().startsWith("merge #")
  );
}

function cleanMessage(title: string): string {
  if (!title) return "";
  if (title.startsWith("[")) {
    const closeIdx = title.indexOf("]");
    if (closeIdx >= 1 && closeIdx <= 2) {
      return `${title.slice(1, closeIdx)}: ${title.slice(closeIdx + 1).trimStart()}`;
    }
  }
  return title;
}

function yunxiaoFetch<T = any>(url: string, token: string): Promise<T> {
  return fetchJson<T>(url, {
    headers: { "x-yunxiao-token": token },
  });
}

// Core logic
interface CommitOptions {
  email?: string;
  all?: boolean;
}

export async function queryCommits(
  startDate: string,
  endDate: string,
  options?: CommitOptions
): Promise<Map<string, Map<string, Set<string>>>> {
  const token = await getYunxiaoToken();
  if (!token) {
    console.error("Error: token not found. Run pms-config.ts first.");
    process.exit(1);
  }

  const startRfc = normalizeDateTime(startDate, "T00:00:00+08:00");
  const endRfc = normalizeDateTime(endDate, "T23:59:59+08:00");
  const startDt = new Date(startRfc);
  const endDt = new Date(endRfc);

  if (startDt > endDt) {
    console.error("Error: startDate must be <= endDate");
    process.exit(1);
  }

  let emailFilter: string | undefined;
  if (!options?.all) {
    emailFilter = options?.email ?? (await getYunxiaoEmail());
  }

  console.log("Fetching repositories...");
  const reposUrl = `${YUNXIAO_BASE_URL}/organizations/${YUNXIAO_ORG_ID}/repositories?perPage=100`;
  const repos = await yunxiaoFetch<any[]>(reposUrl, token);

  if (!Array.isArray(repos)) {
    console.error("Error: unexpected repository response");
    process.exit(1);
  }

  const filteredRepos = repos.filter((repo) => {
    const lastActivity = repo.lastActivityAt;
    if (!lastActivity) return false;
    const lastDt = new Date(lastActivity);
    return startDt <= lastDt && lastDt <= endDt;
  });

  console.log(
    `Repositories: ${repos.length} total, ${filteredRepos.length} in range`
  );

  const commitsByDate = new Map<string, Map<string, Set<string>>>();

  for (const repo of filteredRepos) {
    const repoId = repo.id;
    const repoName =
      repo.name || repo.pathWithNamespace || String(repoId);
    if (!repoId) continue;

    console.log(`Processing repo: ${repoName}`);

    let branches: any[];
    try {
      branches = await yunxiaoFetch<any[]>(
        `${YUNXIAO_BASE_URL}/organizations/${YUNXIAO_ORG_ID}/repositories/${repoId}/branches?perPage=100`,
        token
      );
    } catch (e) {
      console.log(`  Failed to fetch branches: ${e}`);
      continue;
    }

    if (!Array.isArray(branches)) continue;

    for (const branch of branches) {
      const branchName = branch.name;
      if (!branchName) continue;

      const params = new URLSearchParams({
        refName: branchName,
        since: startRfc,
        until: endRfc,
        perPage: "100",
      });

      let commits: any[];
      try {
        commits = await yunxiaoFetch<any[]>(
          `${YUNXIAO_BASE_URL}/organizations/${YUNXIAO_ORG_ID}/repositories/${repoId}/commits?${params}`,
          token
        );
      } catch (e) {
        console.log(`  Failed to fetch commits for ${branchName}: ${e}`);
        continue;
      }

      if (!Array.isArray(commits) || !commits.length) continue;

      const filtered = emailFilter
        ? commits.filter(
            (c) =>
              c.authorEmail === emailFilter ||
              c.committerEmail === emailFilter
          )
        : commits;

      if (!filtered.length) continue;
      console.log(`  Branch ${branchName}: ${filtered.length} commits`);

      for (const commit of filtered) {
        const title = commit.title || commit.message || "";
        if (!title || isMergeCommit(title)) continue;

        const committedDate = commit.committedDate;
        if (!committedDate) continue;

        const dateOnly = committedDate.split("T")[0];
        const message = cleanMessage(title);
        if (!message) continue;

        if (!commitsByDate.has(dateOnly))
          commitsByDate.set(dateOnly, new Map());
        const dateMap = commitsByDate.get(dateOnly)!;
        if (!dateMap.has(repoName)) dateMap.set(repoName, new Set());
        dateMap.get(repoName)!.add(message);
      }
    }
  }

  return commitsByDate;
}

export function commitsToMarkdown(
  commitsByDate: Map<string, Map<string, Set<string>>>
): string {
  const sortedDates = [...commitsByDate.keys()].sort();
  const lines: string[] = [];

  for (const date of sortedDates) {
    lines.push(`## ${date}`, "");
    const projects = commitsByDate.get(date)!;
    for (const project of [...projects.keys()].sort()) {
      lines.push(`### ${project}`, "");
      for (const msg of [...projects.get(project)!].sort()) {
        lines.push(`- ${msg}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

export async function exportCommitToMarkdown(
  startDate: string,
  endDate: string,
  options?: CommitOptions
): Promise<string> {
  const commitsByDate = await queryCommits(startDate, endDate, options);
  return commitsToMarkdown(commitsByDate);
}

// CLI
if (import.meta.main) {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      startDate: { type: "string" },
      endDate: { type: "string" },
      output: { type: "string" },
      email: { type: "string" },
      all: { type: "boolean", default: false },
      export: { type: "boolean", default: false },
    },
  });

  if (!values.startDate || !values.endDate) {
    console.error(
      "Usage: bun scripts/yunxiao-commit.ts --startDate YYYY-MM-DD --endDate YYYY-MM-DD [--export]"
    );
    process.exit(1);
  }

  const markdown = await exportCommitToMarkdown(
    values.startDate,
    values.endDate,
    { email: values.email, all: values.all }
  );

  if (values.export) {
    const startLabel = values.startDate.split("T")[0];
    const endLabel = values.endDate.split("T")[0];
    const workingDir = getOutputDirectory();
    const outputPath =
      values.output ?? join(workingDir, `commits_${startLabel}_${endLabel}.md`);
    await Bun.write(outputPath, markdown);
    console.log(`Report saved to: ${outputPath}`);
  } else {
    console.log("\n" + markdown);
  }
}
