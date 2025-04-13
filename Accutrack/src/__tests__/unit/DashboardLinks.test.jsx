import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "@/app/(routes)/dashboard/page";
import { useUser } from "@clerk/nextjs";

// Mock ResizeObserver to avoid chart warnings
global.ResizeObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(() => ({
    isSignedIn: true,
    user: { id: "test-user-id" },
    isLoaded: true,
  })),
  UserButton: () => <div data-testid="user-button">Profile</div>,
}));

// Mock db calls
jest.mock("@/lib/db", () => ({
  getIncome: jest.fn(() => Promise.resolve([])),
  getExpenses: jest.fn(() => Promise.resolve([])),
  getInventoryByUser: jest.fn(() => Promise.resolve([])),
}));

// Mock router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("Dashboard Navigation Links", () => {
  test("navigates to correct pages when links are rendered", async () => {
    render(<Dashboard />);

    const inventoryLinks = await screen.findAllByRole("link", { name: /inventory/i });
    const expensesLinks = await screen.findAllByRole("link", { name: /expenses/i });
    const incomeLinks = await screen.findAllByRole("link", { name: /income/i });
    const transactionsLinks = await screen.findAllByRole("link", { name: /transactions/i });

    expect(inventoryLinks.some(link => link.getAttribute("href") === "/inventory")).toBe(true);
    expect(expensesLinks.some(link => link.getAttribute("href") === "/expenses")).toBe(true);
    expect(incomeLinks.some(link => link.getAttribute("href") === "/income")).toBe(true);
    expect(transactionsLinks.some(link => link.getAttribute("href") === "/transactions")).toBe(true);
  });
});
