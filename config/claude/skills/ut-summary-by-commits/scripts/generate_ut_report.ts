#!/usr/bin/env bun
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

interface Config {
  yunxiao: {
    token: string
    orgId: string
  }
  user?: {
    email?: string
  }
}

interface AllConfig {
  'ut-summary-by-commits': Config
}

interface Repo {
  id: string
  name: string
  lastActivityAt: string
}

interface Branch {
  name: string
}

interface Commit {
  title: string
  committedDate: string
  authorEmail: string
  committerEmail: string
}

// 读取全局配置文件
const configPath = join(homedir(), '.config', 'claude-skills-config.json')
if (!existsSync(configPath)) {
  console.error('错误：找不到配置文件 ~/.config/claude-skills-config.json')
  console.error('请创建配置文件并添加 ut-summary-by-commits 配置，参考 SKILL.md')
  process.exit(1)
}
const allConfig: AllConfig = JSON.parse(readFileSync(configPath, 'utf8'))
const config = allConfig['ut-summary-by-commits']
if (!config) {
  console.error('错误：配置文件中缺少 ut-summary-by-commits 配置')
  process.exit(1)
}
const TOKEN = config.yunxiao.token
const ORG_ID = config.yunxiao.orgId
const USER_EMAIL = config.user?.email

// 解析命令行参数
const args = process.argv.slice(2)

interface DateRange {
  start: string
  end: string
  label: string
}

function getDateRange(): DateRange {
  const now = new Date()
  if (args.length >= 2) {
    return {
      start: `${args[0]}T00:00:00+08:00`,
      end: `${args[1]}T23:59:59+08:00`,
      label: `${args[0]} 到 ${args[1]}`,
    }
  } else {
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate()
    return {
      start: `${year}-${month}-01T00:00:00+08:00`,
      end: `${year}-${month}-${lastDay}T23:59:59+08:00`,
      label: `${year}年${parseInt(month)}月`,
    }
  }
}

const dateRange = getDateRange()
const START_DATE = dateRange.start
const END_DATE = dateRange.end

// 输出文件路径
const OUTPUT_PATH =
  args[2] ||
  join(process.cwd(), `ut_report_${START_DATE.split('T')[0]}_${END_DATE.split('T')[0]}.md`)

// API 请求
async function makeRequest<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-yunxiao-token': TOKEN,
    },
  })
  return response.json()
}

// 过滤日期范围内的仓库
function filterReposInDateRange(repos: Repo[]): Repo[] {
  const startTime = new Date(START_DATE).getTime()
  const endTime = new Date(END_DATE).getTime()

  return repos.filter(repo => {
    const lastActivity = new Date(repo.lastActivityAt).getTime()
    return lastActivity >= startTime && lastActivity <= endTime
  })
}

// 清理 commit message 开头的标记
function cleanMessage(message: string | undefined): string {
  if (!message) return ''
  return message.replace(/^\[([^\]]{1,2})\]\s*/, '$1: ')
}

// 检查是否为 merge commit
function isMergeCommit(commit: Commit): boolean {
  if (!commit.title) return false
  return /^Merge\s+#/i.test(commit.title)
}

async function main() {
  try {
    console.log(`正在生成 ${dateRange.label} 的 UT 报告...\n`)
    console.log('正在获取仓库列表...')

    const repos = await makeRequest<Repo[]>(
      `https://openapi-rdc.aliyuncs.com/oapi/v1/codeup/organizations/${ORG_ID}/repositories?perPage=100`
    )

    console.log(`找到 ${repos.length} 个仓库`)

    const filteredRepos = filterReposInDateRange(repos)
    console.log(`筛选出 ${filteredRepos.length} 个在 ${dateRange.label} 有更新的仓库`)

    // 按日期和项目存储 commits
    const commitsByDate: Record<string, Record<string, Set<string>>> = {}

    for (const repo of filteredRepos) {
      console.log(`正在处理仓库：${repo.name}`)

      try {
        const branches = await makeRequest<Branch[]>(
          `https://openapi-rdc.aliyuncs.com/oapi/v1/codeup/organizations/${ORG_ID}/repositories/${repo.id}/branches?perPage=100`
        )

        console.log(`  - 找到 ${branches.length} 个分支`)

        for (const branch of branches) {
          try {
            const commits = await makeRequest<Commit[]>(
              `https://openapi-rdc.aliyuncs.com/oapi/v1/codeup/organizations/${ORG_ID}/repositories/${
                repo.id
              }/commits?refName=${encodeURIComponent(branch.name)}&since=${encodeURIComponent(
                START_DATE
              )}&until=${encodeURIComponent(END_DATE)}&perPage=100`
            )

            if (commits && commits.length > 0) {
              const userCommits = USER_EMAIL
                ? commits.filter(
                    c => c.authorEmail === USER_EMAIL || c.committerEmail === USER_EMAIL
                  )
                : commits

              if (userCommits.length > 0) {
                console.log(
                  `    - 分支 ${branch.name}: ${userCommits.length}/${commits.length} 个 commits`
                )
              }

              for (const commit of userCommits) {
                if (isMergeCommit(commit)) continue

                const message = cleanMessage(commit.title)
                const dateOnly = commit.committedDate.split('T')[0]

                if (!commitsByDate[dateOnly]) {
                  commitsByDate[dateOnly] = {}
                }

                if (!commitsByDate[dateOnly][repo.name]) {
                  commitsByDate[dateOnly][repo.name] = new Set()
                }

                commitsByDate[dateOnly][repo.name].add(message)
              }
            }
          } catch (error) {
            console.error(
              `    - 获取分支 ${branch.name} 的 commits 失败:`,
              (error as Error).message
            )
          }
        }
      } catch (error) {
        console.error(`  获取仓库 ${repo.name} 的分支失败:`, (error as Error).message)
      }
    }

    // 生成 markdown 报告
    console.log('\n生成报告...\n')

    const sortedDates = Object.keys(commitsByDate).sort((a, b) => b.localeCompare(a))

    let report = ''

    for (const date of sortedDates) {
      report += `## ${date}\n\n`

      const projects = commitsByDate[date]
      const sortedProjects = Object.keys(projects).sort()

      for (const project of sortedProjects) {
        report += `### ${project}\n\n`

        const messages = Array.from(projects[project])
        for (const message of messages) {
          report += `- ${message}\n`
        }

        report += '\n'
      }
    }

    console.log(report)

    writeFileSync(OUTPUT_PATH, report, 'utf8')
    console.log(`\n报告已保存到：${OUTPUT_PATH}`)
  } catch (error) {
    console.error('错误：', error)
    process.exit(1)
  }
}

main()
