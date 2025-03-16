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
  

describe("Dashboard Component", () => {
  beforeEach(() => {
    console.log("Running beforeEach...");

    // Ensure a user is signed in
    useUser.mockReturnValue({
      isSignedIn: true,
      user: { id: "test-user-id" },
      isLoaded: true,
    });

    // Mock API responses properly
    getIncome.mockResolvedValue([
      { id: 1, amount: "1000", description: "Salary", date: "2024-03-10" },
    ]);

    getExpenses.mockResolvedValue([
      { id: 2, amount: "500", description: "Rent", date: "2024-03-11" },
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

    await waitFor(() => {
      expect(screen.getByText("$1000.00")).toBeInTheDocument();
      expect(screen.getByText("$500.00")).toBeInTheDocument();
    });
  });

  it("renders recent transactions", async () => {
    console.log("Testing recent transactions...");

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText("Salary")).toBeInTheDocument();
      expect(screen.getByText("Rent")).toBeInTheDocument();
    });
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
