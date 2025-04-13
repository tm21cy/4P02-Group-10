import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

dotenv.config(); // Load environment variables

test.describe("Income E2E Test", () => {
  console.log("Starting Income E2E Test");
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

  test("Manually add new income using add income page", async ({ page }) => {

    await page.goto("http://localhost:3000/income");

    await page.waitForTimeout(2000); // Wait for 2 seconds
    await page.click('h2:has-text("Add Income")');

    //console.log(await page.content());
    await expect(page.locator('h1:has-text("Add New Income")')).toBeVisible();

    // Fill out the form fields
    await page.fill('input[name="amount"]', "1500"); // Fill in the amount
    await page.fill('input[name="description"]', "Freelance Work"); // Fill in the description
    await page.selectOption('select[name="tag"]', { label: "Salary" }); // Select a category
    await page.fill('input[name="date"]', "2025-04-05"); // Fill in the date
    await page.click('button:has-text("Add Income")');
    await page.click('button:has-text("Back")');

    await page.waitForTimeout(2000); // Wait for 2 seconds


    const income = await prisma.income.findFirst({
      where: {
        description: "Freelance Work",
        amount: 1500,
        date: new Date("2025-04-05"),
      },
    });
    
    expect(income).not.toBeNull(); // Ensure the income was added
    console.log("Income added to database:", income);
  });

  // Disconnect Prisma after all tests
  test.afterAll(async () => {
    await prisma.$disconnect();
  });
});

