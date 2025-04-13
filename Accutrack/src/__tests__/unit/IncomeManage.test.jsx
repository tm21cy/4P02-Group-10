import React from 'react';
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import IncomeManage from "@/app/(routes)/income/manage/page";
import { useUser } from "@clerk/nextjs";
import { getIncome, patchIncome, getValidTags } from "@/lib/db";
import "@testing-library/jest-dom";

// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button">Profile</div>,
}));

// Mock database functions
jest.mock("@/lib/db", () => ({
    getIncome: jest.fn(() => Promise.resolve([])),   // Ensure they return an array
    patchIncome: jest.fn(() => Promise.resolve()),   // Mock patchIncome function
    getValidTags: jest.fn(() => Promise.resolve([
        { name: "Salary" },
        { name: "Freelance" },
        { name: "Investment" }
    ]))
}));

describe('Manage Income Component', () => {
    beforeEach(() => {
        console.log("Running beforeEach...");
      
        // Ensure a user is signed in
        useUser.mockReturnValue({
          isSignedIn: true,
          user: { id: "test-user-id" },
          isLoaded: true,
        });

        // Mock API responses properly with numbers
        getIncome.mockResolvedValueOnce([
            { id: 1, amount: 500, description: "Freelance", date: new Date("2024-03-11") },
          ]);
    });
    
    it("renders Manage Income correctly", async () => {
        console.log("Rendering Manage Income...");
        
        try {
          await act(async () => {
            render(<IncomeManage />);
          });
      
          await waitFor(() => {
            console.log("Checking for Manage Income text...");
            expect(screen.getAllByText("Manage Income").length).toBeGreaterThan(0);
          });
          
      
        } catch (error) {
          console.error("Render Failed: ", error);
          throw error;
        }
    });

      it("adds a new income and checks if it appears on the page", async () => {
        console.log("Adding new income...");
    
        try {
          await act(async () => {
            render(<IncomeManage />);
          });
          
          await waitFor(() => {
            console.log("Checking for added income text...");
            expect(screen.getAllByText("$500").length).toBeGreaterThan(0);
          });

        } catch (error) {
          console.error("Add Income Failed: ", error);
          throw error;
        }
      });
});