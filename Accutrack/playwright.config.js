import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "src/__tests__/e2e",
  webServer: {
    command: "npm run build:start",
    port: 3000,
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
});
