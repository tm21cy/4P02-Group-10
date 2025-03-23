import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const testUserId = "user_2uQEIwrNRMug7e6xibEdPfcqBYP";

describe("Manage Expenses Backend Automated Tests", () => {
  beforeAll(async () => {
    // Ensure a clean slate by deleting any previous test data
    await prisma.expense.deleteMany({ where: { userId: testUserId } });
    await prisma.income.deleteMany({ where: { userId: testUserId } });

    // Insert test expenses
    await prisma.expense.createMany({
      data: [
        { userId: testUserId, amount: 50.00, description: "Groceries", tag: "Food", date: new Date("2025-03-01") },
        { userId: testUserId, amount: 100.00, description: "Utilities", tag: "Bills", date: new Date("2025-03-05") },
      ],
    });
  });

  afterAll(async () => {
    // Clean up test data after tests run
    await prisma.expense.deleteMany({ where: { userId: testUserId } });
    await prisma.income.deleteMany({ where: { userId: testUserId } });
    await prisma.$disconnect();
  });

  it("should create a new expense entry", async () => {
    const newExpense = await prisma.expense.create({
      data: {
        userId: testUserId,
        amount: 75.00,
        description: "New Expense",
        tag: "Misc",
        date: new Date("2025-03-10"),
      },
    });

    expect(newExpense).toHaveProperty("id");
    expect(Number(newExpense.amount)).toBe(75); // Compare as a number
    expect(newExpense.description).toBe("New Expense");
  });

  it("should read expense entries", async () => {
    const expenses = await prisma.expense.findMany({ where: { userId: testUserId } });

    expect(expenses.length).toBeGreaterThan(0);
    expect(expenses[0]).toHaveProperty("id");
    expect(expenses[0].userId).toBe(testUserId);
  });

  it("should update an expense entry", async () => {
    const updatedExpense = await prisma.expense.updateMany({
      where: { userId: testUserId, description: "Groceries" },
      data: { amount: 60.00 },
    });

    expect(updatedExpense.count).toBe(1);

    const expense = await prisma.expense.findFirst({ where: { userId: testUserId, description: "Groceries" } });
    expect(Number(expense.amount)).toBe(60);  // Compare as a number
  });

  it("should delete an expense entry", async () => {
    const deletedExpense = await prisma.expense.deleteMany({
      where: { userId: testUserId, description: "Utilities" },
    });

    expect(deletedExpense.count).toBe(1);

    const expense = await prisma.expense.findFirst({ where: { userId: testUserId, description: "Utilities" } });
    expect(expense).toBeNull();
  });
});