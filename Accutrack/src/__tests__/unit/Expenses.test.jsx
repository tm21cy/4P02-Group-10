import React from 'react';
import { render, screen, waitFor, act } from "@testing-library/react";
import Expenses from "@/app/(routes)/expenses/page";
// import ExpensesAdd from "@/app/(routes)/expenses/add/page";
// import ExpensesManage from "@/app/(routes)/expenses/manage/page";
import { useUser } from "@clerk/nextjs";
import "@testing-library/jest-dom";

// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button">Profile</div>,
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
    });

    it("renders Expense Management correctly", async () => {
        console.log("Rendering Expense Management...");
        
        try {
          await act(async () => {
            render(<Expenses />);
          });
      
          await waitFor(() => {
            console.log("Checking for Expense Management text...");
            expect(screen.getAllByText("Expense Management").length).toBeGreaterThan(0);
          });
          
      
        } catch (error) {
          console.error("Render Failed: ", error);
          throw error;
        }
    });
});