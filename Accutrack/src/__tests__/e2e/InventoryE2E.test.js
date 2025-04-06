import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

dotenv.config(); // Load environment variables

test.describe("Inventory E2E Test", () => {
  console.log("Starting Inventory E2E Test");
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

  test("Manually add new item using add item page", async ({ page }) => {

    await page.goto("http://localhost:3000/inventory");

    await page.waitForTimeout(2000); // Wait for 2 seconds
    await page.click('h2:has-text("Add Inventory")');

    //console.log(await page.content());
    await expect(page.locator('h1:has-text("Add New Inventory Item")')).toBeVisible();

    // Fill out the form fields
    await page.fill('input[name="itemId"]', "1234"); // Fill in the amount
    await page.fill('input[name="name"]', "Shirt"); // Fill in the amount
    await page.fill('textarea[name="description"]', "Brand shirt"); // Fill in the description
    await page.fill('input[name="quantity"]', "5"); // Fill in the description
    await page.fill('input[name="unitPrice"]', "30"); // Fill in the description
    await page.selectOption('select[name="category"]', { label: "Finished Goods" }); // Select a category
    await page.click('button:has-text("Add Item")');
    await page.click('button:has-text("Back")');

    await page.waitForTimeout(2000); // Wait for 2 seconds

    const item = await prisma.inventory.findFirst({
      where: {
        name: "Shirt",
        amount: 5,
        unitPrice: 30,
      },
    });
    
    expect(item).not.toBeNull(); // Ensure the item was added
    console.log("Item added to database:", item);
  });

  // Disconnect Prisma after all tests
  test.afterAll(async () => {
    await prisma.$disconnect();
  });
});

