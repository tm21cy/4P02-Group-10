import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

test.describe("Dashboard E2E Test", () => {
  console.log("Starting Dashboard E2E Test");
  test.beforeEach(async ({ page }) => {

    await page.goto("http://localhost:3000/sign-in");

    // Fill in the login form using environment variables
    await page.fill('input[name="identifier"]', process.env.TEST_EMAIL);
    await page.click('button:has(svg path[d="m7.25 5-3.5-2.25v4.5L7.25 5Z"])');
    await page.fill('input[name="password"]', process.env.TEST_PASSWORD);
    await page.click('button:has(svg path[d="m7.25 5-3.5-2.25v4.5L7.25 5Z"])');
    
    // Wait for navigation to dashboard
    await page.waitForURL("http://localhost:3000/dashboard");
    await page.getByText("Year to Date").click();

    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test("should display backend data on the frontend", async ({ page }) => {

    // Check income display
    const incomeLocator = page.locator(".text-3xl.font-bold.text-sky-400");
    await expect(incomeLocator).toHaveText("$500.00");

    // Check expenses display
    const expenseLocator = page.locator(".text-3xl.font-bold.text-rose-400");
    await expect(expenseLocator).toHaveText("$100.00");

    // Check net cash flow
    const netCashLocator = page.locator(".text-3xl.font-bold.text-emerald-400");
    await expect(netCashLocator).toHaveText("$400.00");
  });
});

