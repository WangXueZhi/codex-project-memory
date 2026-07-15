import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  outputDir: "./test-results/playwright",
  fullyParallel: false,
  reporter: "line",
  use: {
    headless: true,
    locale: "zh-CN",
    colorScheme: "light",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-1440", use: { viewport: { width: 1440, height: 900 } } },
    {
      name: "mobile-390",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
