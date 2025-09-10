// Playwright configuration for UI testing and automation
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // Test directory
  testDir: './tests',
  
  // Timeout for each test
  timeout: 30000,
  
  // Browser options
  use: {
    // Base URL for the application
    baseURL: 'http://localhost:3000',
    
    // Browser viewport
    viewport: { width: 1280, height: 720 },
    
    // Screenshots on failure
    screenshot: 'only-on-failure',
    
    // Video recording
    video: 'retain-on-failure',
    
    // Trace for debugging
    trace: 'on-first-retry',
  },
  
  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...require('@playwright/test').devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...require('@playwright/test').devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...require('@playwright/test').devices['Desktop Safari'] },
    },
  ],
  
  // Run local dev server before tests
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
});
