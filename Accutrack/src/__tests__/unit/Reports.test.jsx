import React from 'react';
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Reports from "@/app/(routes)/reports/page";
import { useUser } from "@clerk/nextjs";
import { getIncome, getExpenses } from "@/lib/db";
import { generateIncomeStatement } from "@/lib/reports/generateIncomeStatement";
import "@testing-library/jest-dom";
jest.mock("@prisma/client");

jest.mock("lucide-react", () => ({
    FileText: () => "FileText Icon",
    Download: () => "Download Icon",
    Eye: () => "Eye Icon",
    BarChart4: () => "BarChart4 Icon",
    ArrowUpDown: () => "ArrowUpDown Icon",
    Receipt: () => "Receipt Icon",
    Package: () => "Package Icon",
}));

// Mock the generateIncomeStatement function
jest.mock("@/lib/reports/generateIncomeStatement", () => ({
    generateIncomeStatement: jest.fn(),
}));

// Mock database functions
jest.mock("@/lib/db", () => ({
    getIncome: jest.fn(),
    getExpenses: jest.fn(),
}));
  
// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button">Profile</div>,
}));

describe('Reports Component', () => {
    beforeEach(() => {
        console.log("Running beforeEach...");
      
        // Ensure a user is signed in
        useUser.mockReturnValue({
          isSignedIn: true,
          user: { id: "test-user-id" },
          isLoaded: true,
        });

        // Mock income and expense data
        getIncome.mockResolvedValue([
            { id: 1, amount: 500, description: "Salary", date: "2025-03-02", tag: "Salary" },
        ]);
        getExpenses.mockResolvedValue([
            { id: 1, amount: 100, description: "Groceries", date: "2025-03-03", tag: "Food" },
        ]);
    });

    it("renders Reports Management correctly", async () => {
        console.log("Rendering Generate Reports...");
        
        try {
          await act(async () => {
            render(<Reports />);
          });
      
          await waitFor(() => {
            console.log("Checking for Generate Reports text...");
            expect(screen.getAllByText("Generate Reports").length).toBeGreaterThan(0);
          });
          
      
        } catch (error) {
          console.error("Render Failed: ", error);
          throw error;
        }
    });

    it("generates a report after entering a date range and clicking the button", async () => {
        // Render the component
        render(<Reports />);
    
        // Simulate entering the start and end dates
        fireEvent.change(screen.getByLabelText("Start Date"), { target: { value: "2025-03-01" } });
        fireEvent.change(screen.getByLabelText("End Date"), { target: { value: "2025-03-31" } });
    
        // Simulate clicking the "Preview Report" button
        fireEvent.click(screen.getByText(/Preview Report/));
    
        // Wait for the preview data to be displayed
        await waitFor(() => {
          expect(screen.getByText("Report Preview")).toBeInTheDocument();
        });
        console.log("Rendered DOM:", screen.getByText("Report Preview").outerHTML);
    
        expect(getIncome).toHaveBeenCalledWith("test-user-id");
        console.log("Mocked Income Data:", getIncome.mock.results[0].value);
        
        expect(getExpenses).toHaveBeenCalledWith("test-user-id");
        console.log("Mocked Expense Data:", getExpenses.mock.results[0].value);

    
        // Verify that the preview data contains the expected report
        expect(screen.getByText(/"totalIncome": 500/)).toBeInTheDocument();
        expect(screen.getByText(/"totalExpenses": 100/)).toBeInTheDocument();
        expect(screen.getByText(/"netIncome": 400/)).toBeInTheDocument();
      });
});