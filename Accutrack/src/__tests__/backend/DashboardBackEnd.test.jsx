import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const testUserId = "user_2uQEIwrNRMug7e6xibEdPfcqBYP";

describe("Dashboard Backend Automated Tests", () => {
  beforeAll(async () => {
    // Ensure a clean slate by deleting any previous test data
    await prisma.income.deleteMany({ where: { userId: testUserId } });
    await prisma.expense.deleteMany({ where: { userId: testUserId } });

    await prisma.income.createMany({
      data: [
        {
          userId: testUserId,
          amount: 150.50,
          taxAmount: 0.0,
          taxRate: 0.0, 
          description: "Freelance Work",
          tag: "Work",
          date: new Date("2025-03-01"),
        },
        {
          userId: testUserId,
          amount: 300.75,
          taxAmount: 0.0,
          taxRate: 0.0, 
          description: "Consulting",
          tag: "Business",
          date: new Date("2025-03-05"),
        },
      ],
    });
    
    

    // Insert test expenses
    await prisma.expense.createMany({
      data: [
        {
          userId: testUserId,
          amount: 50.00,
          taxRate: 0.0, 
          taxAmount: 0.0, 
          description: "T-shirt",
          tag: "Clothes",
          date: new Date("2025-03-16"),
        },
        {
          userId: testUserId,
          amount: 24.98,
          taxRate: 0.0,
          taxAmount: 0.0,
          description: "Apples",
          tag: "Groceries",
          date: new Date("2025-03-17"),
        },
        {
          userId: testUserId,
          amount: 100.14,
          taxRate: 0.0,
          taxAmount: 0.0,
          description: "Flowers",
          tag: "Miscellaneous",
          date: new Date("2025-03-17"),
        },
      ],
    });
    
  });

  afterAll(async () => {
    // Clean up test data after tests run
    await prisma.income.deleteMany({ where: { userId: testUserId } });
    await prisma.expense.deleteMany({ where: { userId: testUserId } });
    await prisma.$disconnect();
  });

  it("should calculate total income correctly", async () => {
    const incomeRecords = await prisma.income.findMany({ where: { userId: testUserId } });
    const totalIncome = incomeRecords.reduce((sum, record) => sum + Number(record.amount), 0);

    console.log("Total Income:", totalIncome);
    expect(totalIncome).toBe(150.50 + 300.75); // Expected: 451.25
  });

  it("should calculate total expenses correctly", async () => {
    const expenseRecords = await prisma.expense.findMany({ where: { userId: testUserId } });
    const totalExpenses = expenseRecords.reduce((sum, record) => sum + Number(record.amount), 0);

    console.log("Total Expenses:", totalExpenses);
    expect(totalExpenses).toBe(50.00 + 24.98 + 100.14); // Expected: 175.12
  });

  it("should calculate net cash flow correctly", async () => {
    const incomeRecords = await prisma.income.findMany({ where: { userId: testUserId } });
    const expenseRecords = await prisma.expense.findMany({ where: { userId: testUserId } });

    const totalIncome = incomeRecords.reduce((sum, record) => sum + Number(record.amount), 0);
    const totalExpenses = expenseRecords.reduce((sum, record) => sum + Number(record.amount), 0);
    const netCashFlow = totalIncome - totalExpenses;

    console.log("Net Cash Flow:", netCashFlow);
    expect(netCashFlow).toBe((150.50 + 300.75) - (50.00 + 24.98 + 100.14)); // Expected: 276.13
  });

  it("should retrieve the most recent transactions first", async () => {
    const expenses = await prisma.expense.findMany({
      where: { userId: testUserId },
      orderBy: [{ date: "desc" }, { id: "desc" }], // Order by date, then ID
    });
  
    console.log("Recent Transactions:", expenses);
  
    expect(expenses.length).toBeGreaterThan(0);
    expect(expenses[0].description).toBe("Flowers"); // Most recent transaction (March 17, highest ID)
    expect(expenses[1].description).toBe("Apples"); // Second most recent (March 17, lower ID)
  });
  
});
