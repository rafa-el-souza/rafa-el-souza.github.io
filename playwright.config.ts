import { defineConfig, devices } from "@playwright/test";

// The build is served the way a static host would serve it (vite preview, an
// unknown path answered with 404.html as on GitHub Pages), and every journey
// runs in the three engines of the major browsers (docs/design.md, NFR-03).
const URL = "http://127.0.0.1:4173/";

export default defineConfig({
  testDir: "e2e",
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: { baseURL: URL },
  webServer: {
    command: "npm run build && npm run preview",
    url: URL,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
