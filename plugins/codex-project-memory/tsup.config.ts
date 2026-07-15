import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "project-memory": "src/cli.ts",
    "hook-stop": "src/hook-stop.ts",
  },
  format: ["esm"],
  platform: "node",
  target: "node22",
  clean: true,
  bundle: true,
  noExternal: [/.*/],
  splitting: false,
  sourcemap: false,
  minify: false,
  outDir: "dist",
  outExtension: () => ({ js: ".mjs" }),
});
