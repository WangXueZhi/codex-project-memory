# Security Policy

English | [简体中文](SECURITY.zh-CN.md)

## Trust Model

Codex Project Memory is a local process with access to paths that the user explicitly registers. Cross-project access requires a directional link. The plugin does not provide cross-project writes and does not use the network.

The plugin blocks common sensitive paths and file types, rejects parent traversal and symlink escapes, limits file sizes and search output, and rejects likely credentials in memory proposals. Plugin state stays outside registered projects. Storage directories use private permissions and file replacement is atomic where supported. These controls reduce risk but are not a substitute for keeping secrets outside source trees.

When Codex exposes `request_user_input`, the Skill asks whether to save all, select items, or skip.
When that tool is unavailable, the configured fallback commits all proposed memories and
relationships automatically. The final response must identify the fallback. Users who require
mandatory review should not enable this policy without changing the Skill instructions.

## Reporting

Do not include real credentials, private source code, or project-memory state files in public
security reports. Report vulnerabilities through a private security advisory:

https://github.com/WangXueZhi/codex-project-memory/security/advisories/new

## Data Removal

Use `memory_forget` for selected entries. To remove all plugin data, stop Codex and delete the configured project-memory data directory. Back up that directory first if recovery may be needed.
