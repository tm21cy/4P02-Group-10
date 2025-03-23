import React from 'react';
import { render, screen, waitFor, act } from "@testing-library/react";
import Income from "@/app/(routes)/income/page";
import { useUser } from "@clerk/nextjs";
import "@testing-library/jest-dom";

// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button">Profile</div>,
}));

describe('Income Component', () => {
    beforeEach(() => {
        console.log("Running beforeEach...");
      
        // Ensure a user is signed in
        useUser.mockReturnValue({
          isSignedIn: true,
          user: { id: "test-user-id" },
          isLoaded: true,
        });
    });

    it("renders Income Management correctly", async () => {
        console.log("Rendering Income Management...");
        
        try {
          await act(async () => {
            render(<Income />);
          });
      
          await waitFor(() => {
            console.log("Checking for Income Management text...");
            expect(screen.getAllByText("Income Management").length).toBeGreaterThan(0);
          });
          
      
        } catch (error) {
          console.error("Render Failed: ", error);
          throw error;
        }
    });
});