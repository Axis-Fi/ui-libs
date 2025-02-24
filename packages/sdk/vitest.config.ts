import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    browser: {
      provider: "playwright",
      enabled: true,
      headless: true,
      instances: [{ browser: "chromium" }],
      screenshotFailures: false,
    },
    restoreMocks: true,
    coverage: {
      provider: "istanbul",
      reporter: ["text"],
    },
  },
});
