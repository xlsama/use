# AskUserQuestion 模板库

每次调 `AskUserQuestion` 都遵循三条铁律：

1. **2-4 个选项**，每个 `description` 解释「选了之后会发生什么」
2. **推荐项放第一个**，label 末尾标 `(Recommended)`
3. **始终留兜底**：选项里至少一个 `跳过 / 暂不决定` / `先标记为 TBD，继续` / `按假设继续`，且依赖 `AskUserQuestion` 自带的 Other 让用户自填

下面是 7 类常用问题的样板，按需复制改写。

---

## 1. 进门四问（Step 0，一次性问完）

```jsonc
{
  "questions": [
    {
      "question": "本期要梳理哪些文档？（这一题先看说明，下条消息再贴材料）",
      "header": "材料",
      "multiSelect": false,
      "options": [
        { "label": "好的，我下条消息一次性贴",
          "description": "你贴完后我会自动识别每一项是本地路径还是飞书链接，并行解析" },
        { "label": "我只想口述需求，不贴文档",
          "description": "skill 跳过解析步骤，直接走对话式梳理" }
      ]
    },
    {
      "question": "需要关联前端代码仓库吗？",
      "header": "前端仓库",
      "multiSelect": false,
      "options": [
        { "label": "是，路径稍后给 (Recommended)",
          "description": "后续 Explore subagent 会扫前端，标 ✅已有 / 🟡部分 / ⬜新增" },
        { "label": "否，本期不涉及前端",
          "description": "跳过前端扫描" },
        { "label": "跳过 / 暂不决定",
          "description": "先按"未提供"处理，最终摘要里所有页面/组件项一律标新增" }
      ]
    },
    {
      "question": "需要关联后端代码仓库吗？",
      "header": "后端仓库",
      "multiSelect": false,
      "options": [
        { "label": "是，路径稍后给 (Recommended)",
          "description": "后续 Explore subagent 会扫后端" },
        { "label": "否，本期不涉及后端",
          "description": "跳过后端扫描" },
        { "label": "跳过 / 暂不决定",
          "description": "接口/数据模型项一律标新增" }
      ]
    },
    {
      "question": "输出风格？",
      "header": "输出",
      "multiSelect": false,
      "options": [
        { "label": "仅需求摘要 (Recommended)",
          "description": "只生成 requirement-summary.md：通俗易懂的需求总结，能直接当 PR 描述" },
        { "label": "需求摘要 + 技术文档",
          "description": "再多生成 tech-spec.md：详细到能粘给下一个 Claude session 直接开工实现" }
      ]
    }
  ]
}
```

---

## 2. 飞书链接三选一（每条飞书 URL 触发一次）

> skill 自身**不**调任何飞书 API/CLI（公司不批），统一引导用户落到本地文件。

```jsonc
{
  "question": "检测到飞书链接 <这里贴原 URL>，怎么处理？",
  "header": "飞书文档",
  "multiSelect": false,
  "options": [
    { "label": "我用浏览器扩展导出 .md (Recommended)",
      "description": "装 https://github.com/whale4113/cloud-document-converter (Chrome/Edge/Firefox)，在飞书页面工具栏点「下载为 Markdown」，下完把本地 .md 路径贴回来。图片会一起下载，无需企业审批。" },
    { "label": "我用飞书自带「...→下载」导出 .docx 或 .pdf",
      "description": "在飞书页面右上角「...」→「下载」，选 .docx 或 .pdf。下完把本地路径贴回来，会用 docling 解析" },
    { "label": "跳过这份文档",
      "description": "manifest 标 skipped，最终摘要里这份会列在 TBD 区" }
  ]
}
```

---

## 3. 文档版本/期数选择

当解析后发现一份文档同时写了多期需求：

```jsonc
{
  "question": "这份文档里同时出现了 <一期 / 二期 / 三期>，本次梳理哪一期？",
  "header": "期数",
  "multiSelect": false,
  "options": [
    { "label": "二期 (Recommended)",
      "description": "只梳理二期相关章节，其它当背景知识" },
    { "label": "一期",
      "description": "只梳理一期" },
    { "label": "全部都梳理",
      "description": "三期都拆出来，最终摘要分别列" },
    { "label": "跳过 / 暂不决定",
      "description": "先按整篇都算本期处理，最终摘要里加 TBD 提醒你确认" }
  ]
}
```

---

## 4. 术语澄清

```jsonc
{
  "question": "文档里反复出现 \"XX\"，但没有定义。你们语境里它指的是？",
  "header": "术语",
  "multiSelect": false,
  "options": [
    { "label": "<最可能的解释 A>",
      "description": "按这个继续" },
    { "label": "<次可能的解释 B>",
      "description": "按这个继续" },
    { "label": "跳过 / 不影响主流程",
      "description": "最终摘要里把 XX 原样保留，加 TBD 标注" }
  ]
}
```

---

## 5. 文档冲突

```jsonc
{
  "question": "文档 A 说 <X>，文档 B 说 <Y>，以哪个为准？",
  "header": "以谁为准",
  "multiSelect": false,
  "options": [
    { "label": "以 A 为准 (Recommended)",
      "description": "<理由：A 更新 / A 是终稿 / 其他>" },
    { "label": "以 B 为准",
      "description": "<理由>" },
    { "label": "都列出来，最终决策稍后再定",
      "description": "摘要里两种都写，标 TBD" }
  ]
}
```

---

## 6. 字段/交互细节缺失

```jsonc
{
  "question": "这块文档没写细：<具体缺什么>。怎么处理？",
  "header": "缺失项",
  "multiSelect": false,
  "options": [
    { "label": "按假设继续 (Recommended)",
      "description": "我会按 <具体假设> 继续梳理，并在摘要里标注假设" },
    { "label": "先标记为 TBD，继续",
      "description": "不假设，摘要里这条留空+TBD" },
    { "label": "让我补一句说明",
      "description": "走 Other 自己输入" }
  ]
}
```

---

## 7. 仓库对比争议

跑完 Step 4 拿到 Explore subagent 的报告后，对每个标"🟡部分实现"的项目追问：

```jsonc
{
  "question": "<功能 X> 在仓库里只有部分实现 (<file_path:line>)。本期需要：",
  "header": "X 怎么算",
  "multiSelect": false,
  "options": [
    { "label": "补齐到完整 (Recommended)",
      "description": "技术文档里列出还差什么、改哪个文件" },
    { "label": "现有实现就够了，不动",
      "description": "摘要里标 ✅已有，不进新增清单" },
    { "label": "重写",
      "description": "技术文档按全新功能写" },
    { "label": "跳过，让我自己看",
      "description": "原样保留 subagent 的描述" }
  ]
}
```

---

## 调用约定

- 一次最多问 4 个问题，能并到一次的就别拆轮（特别是 Step 0 和飞书三选一批量场景）
- 飞书链接如果用户一次贴了多条，**优先合并为一个 multi-question 调用**（每条占一个 question slot），4 条以上才分批
- 用户回答里如果出现 Other 自填的内容，把它原文存进 manifest 的 `warnings` 字段，最终摘要里的 TBD 区要显式列出
