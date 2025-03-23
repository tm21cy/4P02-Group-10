import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const testUserId = "user_2uQEIwrNRMug7e6xibEdPfcqBYP";

describe("Manage Income Backend Automated Tests", () => {
  beforeAll(async () => {
    // Ensure a clean slate by deleting any previous test data
    await prisma.income.deleteMany({ where: { userId: testUserId } });
    await prisma.expense.deleteMany({ where: { userId: testUserId } });

    // Insert test income
    await prisma.income.createMany({
      data: [
        { userId: testUserId, amount: 150.50, description: "Freelance Work", tag: "Work", date: new Date("2025-03-01") },
        { userId: testUserId, amount: 300.75, description: "Consulting", tag: "Business", date: new Date("2025-03-05") },
      ],
    });
  });

  afterAll(async () => {
    // Clean up test data after tests run
    await prisma.income.deleteMany({ where: { userId: testUserId } });
    await prisma.expense.deleteMany({ where: { userId: testUserId } });
    await prisma.$disconnect();
  });

  it("should create a new income entry", async () => {
    const newIncome = await prisma.income.create({
      data: {
        userId: testUserId,
        amount: 200.00,
        description: "New Income",
        tag: "Misc",
        date: new Date("2025-03-10"),
      },
    });

    expect(newIncome).toHaveProperty("id");
    expect(Number(newIncome.amount)).toBe(200); // Compare as a number
    expect(newIncome.description).toBe("New Income");
  });

  it("should read income entries", async () => {
    const incomes = await prisma.income.findMany({ where: { userId: testUserId } });

    expect(incomes.length).toBeGreaterThan(0);
    expect(incomes[0]).toHaveProperty("id");
    expect(incomes[0].userId).toBe(testUserId);
  });

  it("should update an income entry", async () => {
    const updatedIncome = await prisma.income.updateMany({
      where: { userId: testUserId, description: "Freelance Work" },
      data: { amount: 200.00 },
    });

    expect(updatedIncome.count).toBe(1);

    const income = await prisma.income.findFirst({ where: { userId: testUserId, description: "Freelance Work" } });
    expect(Number(income.amount)).toBe(200);  // Compare as a number
  });

  it("should delete an income entry", async () => {
    const deletedIncome = await prisma.income.deleteMany({
      where: { userId: testUserId, description: "Consulting" },
    });

    expect(deletedIncome.count).toBe(1);

    const income = await prisma.income.findFirst({ where: { userId: testUserId, description: "Consulting" } });
    expect(income).toBeNull();
  });
});