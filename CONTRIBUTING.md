# Contributing

English | [简体中文](CONTRIBUTING.zh-CN.md)

Use Node.js 22.13 or newer and pnpm 10.30.2.

To prepare the repository and run the full local check:

```bash
pnpm install
pnpm check
```

`pnpm check` runs type checks, code-quality checks, unit tests, a production build, integration tests,
and project validation. Run `pnpm test:visual` as well when changing the offline browser.

Changes that read or write files need tests for blocked paths, attempts to leave the project,
symbolic links, private permissions, interrupted writes, and one-way project links. If a change
alters stored files, explain how existing users can keep reading old data or provide a clear
migration path.

Do not add telemetry, runtime network access, writes inside registered projects, or cross-project
writes without a separate design proposal. Changes to save behavior must also explain whether the
user reviews each item or an automatic fallback can commit it.
