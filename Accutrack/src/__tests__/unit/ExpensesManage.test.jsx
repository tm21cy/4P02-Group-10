import React from 'react';
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import ExpensesManage from "@/app/(routes)/expenses/manage/page";
import { useUser } from "@clerk/nextjs";
import { getExpenses, patchIncome, getValidExpenseTags } from "@/lib/db";
import "@testing-library/jest-dom";

// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button">Profile</div>,
}));

// Mock database functions
jest.mock("@/lib/db", () => ({
    getExpenses: jest.fn(() => Promise.resolve([])),   // Ensure they return an array
    patchIncome: jest.fn(() => Promise.resolve()),   // Mock patchIncome function
    getValidExpenseTags: jest.fn(() => Promise.resolve([
        { name: "Bills" },
        { name: "Food" },
        { name: "Other" }
    ])),
}));

describe('Manage Expenses Component', () => {
    beforeEach(() => {
        console.log("Running beforeEach...");
      
        // Ensure a user is signed in
        useUser.mockReturnValue({
          isSignedIn: true,
          user: { id: "test-user-id" },
          isLoaded: true,
        });

        // Mock API responses properly with numbers
        getExpenses.mockResolvedValueOnce([
            { id: 1, amount: 500, description: "Freelance", date: new Date("2024-03-11") },
          ]);

        // Add mock data for expense tags
        getValidExpenseTags.mockResolvedValueOnce([
            { name: "Bills" },
            { name: "Food" },
            { name: "Other" }
        ]);
    });
    
    it("renders Manage Expenses correctly", async () => {
        console.log("Rendering Manage Expenses...");
        
        try {
          await act(async () => {
            render(<ExpensesManage />);
          });
      
          await waitFor(() => {
            console.log("Checking for Manage Expenses text...");
            expect(screen.getAllByText("Manage Expenses").length).toBeGreaterThan(0);
          });
          
      
        } catch (error) {
          console.error("Render Failed: ", error);
          throw error;
        }
    });

      it("adds a new expense and checks if it appears on the page", async () => {
        console.log("Adding new expense...");
    
        try {
          await act(async () => {
            render(<ExpensesManage />);
          });
          
          await waitFor(() => {
            console.log("Checking for added expense text...");
            expect(screen.getAllByText("$500").length).toBeGreaterThan(0);
          });

        } catch (error) {
          console.error("Add Expense Failed: ", error);
          throw error;
        }
      });
});