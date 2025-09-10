# Playwright Browser Automation & Testing

This project includes [Playwright](https://playwright.dev/) and [Playwright MCP](https://github.com/microsoft/playwright-mcp) for browser automation and UI testing.

## Available Scripts

### Testing
- `npm test` - Run all Playwright tests
- `npm run test:ui` - Open Playwright test UI (interactive mode)
- `npm run test:debug` - Debug tests step by step
- `npm run test:headed` - Run tests with visible browser

### Automation
- `npm run automate` - Run the browser automation script
- `npm run playwright:install` - Install Playwright browsers

## Browser Automation

The `scripts/browser-automation.js` script demonstrates:
- Page navigation
- Screenshot capture
- Element interaction
- Keyboard navigation
- Accessibility testing

Run it with:
```bash
npm run automate
```

Screenshots will be saved to the `screenshots/` directory.

## Writing Tests

Tests are located in the `tests/` directory. Example test:

```javascript
const { test, expect } = require('@playwright/test');

test('should display main elements', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Document Intelligence');
});
```

## Playwright MCP Capabilities

With Playwright MCP installed, you have access to:
- **Navigation**: browser_navigate, browser_back, browser_forward
- **Interaction**: browser_click, browser_type, browser_select_option
- **Screenshots**: browser_take_screenshot, browser_snapshot
- **Network**: browser_network_requests
- **Verification**: browser_verify_element_visible, browser_verify_text_visible

## Troubleshooting

1. If browsers aren't installed:
   ```bash
   npx playwright install
   ```

2. For debugging failing tests:
   ```bash
   npm run test:debug
   ```

3. To see tests running:
   ```bash
   npm run test:headed
   ```

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Debugging Tests](https://playwright.dev/docs/debug)
