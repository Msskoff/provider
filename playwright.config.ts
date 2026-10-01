import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    // Le contenu doit être lisible sans JavaScript (Google, robots d'IA).
    javaScriptEnabled: false,
    locale: "fr-MA",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], javaScriptEnabled: false },
    },
  ],
  // Les tests tournent sur le build de production, comme en ligne.
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
