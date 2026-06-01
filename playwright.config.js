import { defineConfig } from "@playwright/test";

// The app is a single static file with no build step, so tests load it
// directly over file:// — no dev server required.
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: "list",
  use: { browserName: "chromium" },
});
