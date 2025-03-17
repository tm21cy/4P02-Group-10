import { test, expect } from "@playwright/test";

test.describe("Dashboard E2E Test", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure backend has test data
    const response = await fetch("http://localhost:3000/api/seed-test-data", { method: "POST" });
    const json = await response.json();
    console.log("Seed Data Response:", json); // Debugging

    // Wait for backend processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Go to dashboard page
    await page.goto("http://localhost:3000/dashboard");

    // Wait for the page to fully load and hydrate
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(5000); // Allow React hydration

    // Ensure test elements exist
    await page.waitForSelector("[data-testid='total-income']", { timeout: 20000 });
  });

  test("should display backend data on the frontend", async ({ page }) => {
    // Debugging: Log page content if test fails
    console.log(await page.content());

    // Check income display
    const incomeText = await page.locator("[data-testid='total-income']").textContent();
    console.log("Income Text:", incomeText); // Debugging
    expect(incomeText).toContain("$500.00");

    // Check expenses display
    const expenseText = await page.locator("[data-testid='total-expenses']").textContent();
    console.log("Expenses Text:", expenseText); // Debugging
    expect(expenseText).toContain("$100.00");

    // Check net cash flow
    const netCashFlowText = await page.locator("[data-testid='net-cash-flow']").textContent();
    console.log("Net Cash Flow Text:", netCashFlowText); // Debugging
    expect(netCashFlowText).toContain("$400.00");
  });
});
