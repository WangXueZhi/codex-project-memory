# Contributing

English | [简体中文](CONTRIBUTING.zh-CN.md)

Use Node.js 22.13 or newer and pnpm 10.30.2.

```bash
pnpm install
pnpm check
```

Changes that affect filesystem access must include denial, traversal, symlink, permissions, atomic-write, and directional-link tests. Changes to the file-store schema must define compatibility or an explicit migration path. Do not add telemetry, network access, automatic memory commits, writes into registered projects, or cross-project writes without an explicit design proposal.
