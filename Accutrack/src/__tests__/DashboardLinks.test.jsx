import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
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
jest.mock("@/lib/db", () => ({
    getIncome: jest.fn(() => Promise.resolve([])),
    getExpenses: jest.fn(() => Promise.resolve([])),
  }));
  
describe("Dashboard Navigation Links", () => {
  test("navigates to correct pages when links are rendered", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Check for multiple links and ensure at least one exists
    expect(screen.getAllByRole("link", { name: /inventory/i })[0]).toHaveAttribute("href", "/inventory");
    expect(screen.getAllByRole("link", { name: /expenses/i })[0]).toHaveAttribute("href", "/expenses");
    expect(screen.getAllByRole("link", { name: /income/i })[0]).toHaveAttribute("href", "/income");
    expect(screen.getAllByRole("link", { name: /transactions/i })[0]).toHaveAttribute("href", "/transactions");
  });
});
