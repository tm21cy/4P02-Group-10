import React from 'react';
import { render, screen, waitFor, act } from "@testing-library/react";
import ExpensesAdd from "@/app/(routes)/expenses/add/page";
import { useUser } from "@clerk/nextjs";
import "@testing-library/jest-dom";

// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button">Profile</div>,
}));

// Mock the getValidTags function from your database
jest.mock("@/lib/db", () => ({
  getValidExpenseTags: jest.fn(), // Mock getValidTags function
}));

describe('Expenses Component', () => {
    beforeEach(() => {
        console.log("Running beforeEach...");
      
        // Ensure a user is signed in
        useUser.mockReturnValue({
          isSignedIn: true,
          user: { id: "test-user-id" },
          isLoaded: true,
        });

          // Mock getValidTags to return a specific response
        require("@/lib/db").getValidExpenseTags.mockResolvedValue([{id: '1', name: "Rent"}, {id: '2', name: "Salary"}]);
    });

    it("renders Expense Add correctly", async () => {
      console.log("Rendering Expense Add...");
      console.log("Mocked useUser:", useUser());  // Log what Jest is returning
  
      await act(async () => {
          const { debug } = render(<ExpensesAdd />);
          await waitFor(() => debug()); // Wait until it renders
      });
  
      await waitFor(() => {
        expect(screen.getByText("Add New Expense")).toBeInTheDocument();
    });
    // Ensure the mocked tags are used correctly in the component
    await waitFor(() => {
      expect(screen.getByText('Rent')).toBeInTheDocument();
      expect(screen.getByText('Salary')).toBeInTheDocument();
    });
    
  });
  
});