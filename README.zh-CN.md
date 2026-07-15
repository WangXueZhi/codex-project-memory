# Codex Project Memory

[English](README.md) | 简体中文

Codex Project Memory 是一个本地 Codex 插件，为每个项目建立独立的长期记忆。它可以让
Codex 在不同任务之间记住重要决策、已验证结论、可复用流程及其来源文件，同时不会把私人
记忆文件放进项目仓库。

[![CI](https://github.com/WangXueZhi/codex-project-memory/actions/workflows/ci.yml/badge.svg)](https://github.com/WangXueZhi/codex-project-memory/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

## 这个项目要解决什么问题

Codex 可以很好地完成当前任务，但开始下一个任务时，之前积累的项目背景可能无法继续使用。
实际工作中通常会遇到这些问题：

| 痛点 | 日常表现 |
| --- | --- |
| 重要背景丢失 | 每次新建任务，都要重新解释架构、历史决策和已经完成的工作。 |
| 不同项目的记忆混在一起 | A 项目的规则可能被错误地用到 B 项目。 |
| 只记住结论，不知道依据 | Codex 记得答案，却找不到支持答案的报告、数据或代码。 |
| 旧结论看起来仍然有效 | 来源文件已经改变，保存的记忆却没有任何提醒。 |
| 记忆文件污染项目仓库 | 放在项目里的 `memory.md` 可能进入 Git 历史、产生无关改动，甚至被误传到公开仓库。 |
| 记忆越多越难理解 | 能找到单条记录，却看不清决策、证据和结论之间的关系。 |
| 保存过程容易被忽略 | 任务完成了，但用户不知道保存了什么，或者有没有保存。 |

Codex Project Memory 通过项目隔离、可审核保存、来源追踪、过期检查和知识导览来解决这些
问题。

## 它能带来什么

- **每个项目拥有独立记忆空间。** A 项目的记忆不会悄悄加载到 B 项目。
- **记忆不会写进项目仓库。** 数据保存在 Codex 的私人目录中，不进入项目 Git 历史。
- **存储内容可以直接检查。** 正式记忆保存在普通的 `MEMORY.md`，关系保存在
  `RELATIONS.json`，不需要查看或迁移 SQLite 数据库。
- **保存结果清楚可见。** Codex 支持交互选择时，可以“保存全部、选择保存、暂不保存”；
  交互不可用时，插件会执行自动保存，并明确告诉用户发生了什么。
- **结论可以追溯到来源。** 每条记忆可以引用证据、报告、流程和参考文件，还能记录文件中
  的具体位置。
- **来源变化会提醒。** 每个引用文件都会单独检查；文件变更、丢失或失去访问权限时，记忆
  会显示为过期，而不是继续被默默信任。
- **先给导览，再看图谱。** 离线知识工作台会告诉你先读什么、有哪些主题、哪些证据不足、
  哪些记忆是孤立的，以及下一步可以问什么。
- **跨项目复用有明确边界。** 一个项目只有在用户批准单向只读链接后，才能读取另一个项目。
- **默认私有、完全离线。** 插件没有 MCP 服务器、云端服务、遥测或运行时网络请求。

## 和其他记忆方式有什么区别

这个插件不是为了取代 Codex 内置记忆，而是对它进行项目级补充。

| 方式 | 更适合保存什么 | 用于项目工作时的主要不足 |
| --- | --- | --- |
| Codex 内置记忆 | 跨对话可能有用的通用偏好和背景 | 它不是一个专属于某个本地项目、可以逐条审核并追溯来源的知识库。 |
| 项目仓库里的 `memory.md` | 确实需要跟随代码一起共享的少量说明 | 容易产生 Git 改动，也可能把私人工作背景暴露给协作者或公开仓库。 |
| Codex Project Memory | 私人的项目决策、结论、流程、证据和它们之间的关系 | 默认只保存在当前电脑，除非用户主动导出或复制。 |

通用的个人偏好可以交给内置记忆。某条信息如果必须只属于一个项目、需要关联本地来源、需要
跨 Codex 任务长期保留，但又不应该进入 Git，就适合交给这个插件。

## 一次任务中它是怎么工作的

正常流程如下：

1. **识别项目。** Codex 检测当前项目根目录，只有用户确认后才会注册。
2. **读取相关记忆。** 插件加载当前项目的有效记忆，并检查引用文件是否仍然有效。
3. **完成实际任务。** 当前代码、文件和测试始终是更可靠的事实来源；记忆只是辅助背景。
4. **整理值得长期保存的内容。** 在重要任务结束时，Codex 只应提出决策、已验证结论、流程、
   稳定约定和反复出现的坑等长期有用内容。
5. **完成保存。** 可以交互时由用户审核；不能交互时执行自动保存，并在回复中明确说明。
6. **在以后继续使用。** 新任务可以加载、搜索、追踪、导出或查看这个项目已经保存的知识。

临时日志、猜测、密钥和单纯的聊天摘要不应该成为长期记忆。

## 知识导览和知识图谱

经过审核的记忆可以建立“依赖、支持、矛盾、替代、来源于、相关”等关系。插件提供四种查看
方式：

- JSON：供工具或其他程序使用。
- Mermaid：生成简单关系图。
- Markdown：生成容易阅读和转发的文字报告。
- 私有单文件 HTML：在本地进行完整导览和探索。

HTML 不会一打开就把用户丢进一张难懂的关系网，而是先显示知识导览：项目概况、推荐阅读、
主题分类、证据状态、知识缺口和建议问题。需要继续梳理时，再进入图谱或详情阅读模式，查看
记忆关系、完整结论和来源文件。

系统生成的关联线索只是建议。只有用户明确要求审核并保存后，它们才会成为正式关系。

## 环境要求

- 支持本地插件和 Skill 的 Codex
- Codex 可使用 Node.js 22.13 或更高版本
- 从源码安装时需要 pnpm 10.30.2

## 从源码安装

```bash
git clone https://github.com/WangXueZhi/codex-project-memory.git
cd codex-project-memory
pnpm install --frozen-lockfile
pnpm build
codex plugin marketplace add "$PWD"
codex plugin add codex-project-memory@codex-project-memory
```

安装后新建一个 Codex 任务。可以显式调用 `@codex-project-memory`，也可以让 Codex 检测并
加载当前项目的记忆。

## 第一次使用

1. 让 Codex 检测当前项目。
2. 检查识别出的根目录、Git 和 worktree 信息。
3. 明确确认注册，生成私有的本地项目 ID。
4. 可选：让 Codex 生成受管理的 `AGENTS.md` 绑定片段，使后续任务更稳定地加载 Skill。
5. 完成一次有价值的任务，并在结束时检查记忆保存结果。
6. 想梳理项目知识时，直接让 Codex“查看当前项目的知识图谱”。

如果项目 B 需要读取项目 A，应先注册两个项目，再批准单向 `B -> A` 链接。这不会让 A
反向读取 B，两个项目也都不能修改对方。

## 记忆保存在哪里

私人文件目录默认为：

```text
${CODEX_HOME:-~/.codex}/project-memory/v1/
```

主要文件如下：

```text
registry.json
links.json
projects/<project-id>/project.json
projects/<project-id>/MEMORY.md
projects/<project-id>/RELATIONS.json
projects/<project-id>/KNOWLEDGE_GRAPH.html
projects/<project-id>/proposals/<proposal-id>.json
projects/<project-id>/audit.jsonl
```

简单来说：

- `MEMORY.md` 保存审核通过的记忆和来源。
- `RELATIONS.json` 保存审核通过的记忆关系。
- `KNOWLEDGE_GRAPH.html` 是用于浏览的只读快照。
- proposal 文件保存等待接受或拒绝的候选项。
- `audit.jsonl` 记录重要的记忆操作。

插件不会向已注册项目写入记忆文件。开发或测试时，可以通过
`CODEX_PROJECT_MEMORY_HOME` 使用独立数据目录。也可以在数据目录中增加可选
`config.json`，禁止插件读取更多路径：

```json
{
  "denyPatterns": ["private/**", "**/*.secret"]
}
```

## 这个项目不会做什么

- 不会在不同电脑或团队成员之间同步记忆。
- 不会通过 HTML 编辑记忆，知识工作台是只读的。
- 不会持续扫描项目，也不会在后台自动生成记忆。
- 不使用 embeddings 或持久化搜索索引，当前搜索是普通文本匹配。
- 不会自动信任关联线索，也不会让图谱关系自动改变搜索排名。
- 不会自动导入早期开发版本留下的 `memory.sqlite3`。
- 当结构化交互不可用时，无法保证逐条人工审核；当前回退策略会保存全部候选项，并明确回执。

这些限制让插件保持本地、容易理解，也容易完全删除。

## 开发

```bash
pnpm install
pnpm check
pnpm test:visual
```

可分发插件位于 `plugins/codex-project-memory`。`pnpm build` 会打包 Skill CLI、Stop Hook 和
离线浏览器资源。生成的知识图谱将所有资源放在一个本地文件中，运行时不会访问网络。

更深入的技术说明请查看[架构说明](docs/architecture.zh-CN.md)、
[安全策略](SECURITY.zh-CN.md)和[贡献指南](CONTRIBUTING.zh-CN.md)。

## 许可证

本项目使用 Apache License 2.0，详见 [LICENSE](LICENSE)。许可证文件保留官方英文原文。
