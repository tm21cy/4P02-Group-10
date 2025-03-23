import React from 'react';
import { render, screen, waitFor, act } from "@testing-library/react";
import Inventory from "@/app/(routes)/inventory/page";
import { useUser } from "@clerk/nextjs";
import "@testing-library/jest-dom";

// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button">Profile</div>,
}));

describe('Inventory Component', () => {
    beforeEach(() => {
        console.log("Running beforeEach...");
      
        // Ensure a user is signed in
        useUser.mockReturnValue({
          isSignedIn: true,
          user: { id: "test-user-id" },
          isLoaded: true,
        });
    });

    it("renders Inventory Management correctly", async () => {
        console.log("Rendering Inventory Management...");
        
        try {
          await act(async () => {
            render(<Inventory />);
          });
      
          await waitFor(() => {
            console.log("Checking for Inventory Management text...");
            expect(screen.getAllByText("Inventory Management").length).toBeGreaterThan(0);
          });
          
      
        } catch (error) {
          console.error("Render Failed: ", error);
          throw error;
        }
    });
});