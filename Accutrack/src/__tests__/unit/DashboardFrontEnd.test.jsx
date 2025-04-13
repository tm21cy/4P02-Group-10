import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import Dashboard from "@/app/(routes)/dashboard/page";
import { useUser } from "@clerk/nextjs";
import { getIncome, getExpenses } from "@/lib/db";
import "@testing-library/jest-dom";


global.ResizeObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  
// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button">Profile</div>,
}));

// Mock database functions
jest.mock("@/lib/db", () => ({
    getIncome: jest.fn(() => Promise.resolve([])),   // Ensure they return an array
    getExpenses: jest.fn(() => Promise.resolve([])),
  }));
  
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));
jest.mock("@/lib/db", () => ({
  getIncome: jest.fn(() => Promise.resolve([
    { id: 1, amount: 1000, description: "Salary", date: "2024-03-10" },
  ])),
  getExpenses: jest.fn(() => Promise.resolve([
    { id: 2, amount: 500, description: "Rent", date: "2024-03-11" },
  ])),
  getInventoryByUser: jest.fn(() => Promise.resolve([])), 
}));

  
describe("Dashboard Component", () => {
  beforeEach(() => {
    console.log("Running beforeEach...");
  
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 0-based
    const day = "02"; // Safe day within most months
  
    // Format: YYYY-MM-DD
    const incomeDate = `${year}-${month}-01`;
    const expenseDate = `${year}-${month}-${day}`;
  
    useUser.mockReturnValue({
      isSignedIn: true,
      user: { id: "test-user-id" },
      isLoaded: true,
    });
  
    getIncome.mockResolvedValue([
      { id: 1, amount: 1000, description: "Salary", date: incomeDate },
    ]);
  
    getExpenses.mockResolvedValue([
      { id: 2, amount: 500, description: "Rent", date: expenseDate },
    ]);
  });
  
  

  it("renders Dashboard correctly", async () => {
    console.log("Rendering Dashboard...");
    
    try {
      await act(async () => {
        render(<Dashboard />);
      });
  
      await waitFor(() => {
        console.log("Checking for Dashboard text...");
        expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
      });
      
  
    } catch (error) {
      console.error("Render Failed: ", error);
      throw error;
    }
  });
  

  it("renders income and expenses data", async () => {
    console.log("Testing income and expenses...");
  
    await act(async () => {
      render(<Dashboard />);
    });
  
    const incomeEls = await screen.findAllByText("$1000.00", { timeout: 10000 });
    const expenseEls = await screen.findAllByText("$500.00", { timeout: 10000 });
  
    expect(incomeEls.length).toBeGreaterThan(0);
    expect(expenseEls.length).toBeGreaterThan(0);
  });
  
  
  
  
  

  it("renders recent transactions", async () => {
    console.log("Testing recent transactions...");

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(async () => {
      const salary = await screen.findByText("Salary");
      const rent = await screen.findByText("Rent");
    
      expect(salary).toBeInTheDocument();
      expect(rent).toBeInTheDocument();
    }, { timeout: 5000 });
    
  });

  it("renders the charts", async () => {
    console.log("Testing charts...");

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText("Trends")).toBeInTheDocument();
      expect(screen.getByText("Monthly Comparison")).toBeInTheDocument();
    });
  });
});