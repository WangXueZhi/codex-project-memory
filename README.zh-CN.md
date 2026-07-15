# Codex Project Memory

[English](README.md) | 简体中文

Codex Project Memory 是一个本地 Codex 插件，用于为每个项目分别保存长期上下文。它在
Codex 支持结构化交互时让用户审核记忆；交互不可用时执行明确标记的自动保存；同时支持
文件式知识图谱和显式的单向跨项目只读链接。

[![CI](https://github.com/WangXueZhi/codex-project-memory/actions/workflows/ci.yml/badge.svg)](https://github.com/WangXueZhi/codex-project-memory/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

## 核心原则

- 本地优先：数据保存在 `CODEX_HOME` 下，插件运行时不访问网络。
- 可检查存储：审核通过的记忆以 Markdown 保存，不写入项目目录。
- 项目隔离：每个已注册项目拥有独立记忆空间。
- 交互感知：可用时显示结构化保存选项，不可用时自动保存并明确回执。
- 知识图谱：记忆可通过审核后的类型化关系连接，并通过 Markdown 或离线 HTML 浏览。
- 只读链接：跨项目访问必须显式、单向授权，且不授予写权限。
- 来源可追溯：每条记忆可记录证据、报告、流程和参考文件，并分别检查过期状态。

## 环境要求

- 支持本地插件和 Skill 的 Codex
- Node.js 22.13 或更高版本
- pnpm 10.30.2

## 从源码安装

```bash
git clone https://github.com/WangXueZhi/codex-project-memory.git
cd codex-project-memory
pnpm install --frozen-lockfile
pnpm build
codex plugin marketplace add "$PWD"
codex plugin add codex-project-memory@codex-project-memory
```

安装后新建一个 Codex 任务。可以显式调用 `@codex-project-memory`，或让 Codex 加载当前
项目已保存的上下文。

## 首次使用

1. 让 Codex 检测当前项目。
2. 检查识别出的根目录、Git 和 worktree 信息。
3. 明确确认注册，生成本地项目 ID。
4. 可选：生成受管理的 `AGENTS.md` 绑定片段，以便后续任务稳定加载。
5. 完成有价值的工作后，选择“保存全部 / 选择保存 / 暂不保存”；交互不可用时，插件会
   自动保存全部候选项并在回执中说明。

可以用 `guide` 理解项目知识，用 `relations`、`path` 和 `graph` 继续探索。图谱支持
JSON、Mermaid、可读 Markdown 和单文件离线 HTML。HTML 默认先显示知识导览，包括推荐
阅读、知识缺口、证据状态、建议问题和待审核关联线索；深色关系图与层级阅读布局用于进一步
探索。普通 `load` 和 `search` 不会自动展开关联记忆。

项目 B 如需读取项目 A，应先注册两个项目，再批准单向 `B -> A` 链接。除非另行批准
反向链接，否则项目 A 无权读取项目 B。

## 数据位置

外部文件存储默认位于：

```text
${CODEX_HOME:-~/.codex}/project-memory/v1/
```

目录结构：

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

记忆正文和来源保存在 `MEMORY.md`，正式关系保存在 `RELATIONS.json`。
`KNOWLEDGE_GRAPH.html` 是只读快照，不是事实来源。插件不会向已注册项目写入记忆文件。

开发或测试时可以通过 `CODEX_PROJECT_MEMORY_HOME` 使用隔离目录。也可以在数据目录下创建
`config.json`，增加拒绝访问的路径规则：

```json
{
  "denyPatterns": ["private/**", "**/*.secret"]
}
```

## 开发

```bash
pnpm install
pnpm check
pnpm test:visual
```

可分发插件位于 `plugins/codex-project-memory`。构建过程会打包 Skill CLI、Stop Hook 和
Preact/Cytoscape/FCoSE 浏览器资源。最终知识图谱将所有资源嵌入一个私有离线 HTML 文件。

## 当前限制

- 记忆只保存在本机，不会跨设备同步。
- HTML 只读，不提供编辑界面或后台自动抽取。
- 来源和记忆检索为文本检索，不维护持久化索引。
- 图谱关系不会自动影响搜索排名，也不会自动隐藏被替代的记忆。
- 关联线索必须经用户明确审核后才能成为正式关系。
- Stop Hook 首次运行需要用户信任并批准。
- `request_user_input` 不可用时会自动提交全部候选项，并在最终回执中注明。
- 早期开发版本的 `memory.sqlite3` 不会自动导入。

参阅[架构说明](docs/architecture.zh-CN.md)、[安全策略](SECURITY.zh-CN.md)和
[贡献指南](CONTRIBUTING.zh-CN.md)。

## 许可证

本项目使用 Apache License 2.0，详见 [LICENSE](LICENSE)。许可证文件保留官方英文原文。
