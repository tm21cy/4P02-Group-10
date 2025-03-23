import React from 'react';
import { render, screen, waitFor, act } from "@testing-library/react";
import InventoryAdd from "@/app/(routes)/inventory/add/page";
import { useUser } from "@clerk/nextjs";
import "@testing-library/jest-dom";

// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button">Profile</div>,
}));

// Mock the getValidTags function from your database
jest.mock("@/lib/db", () => ({
    getValidInventoryTags: jest.fn(), // Mock getValidInventoryTags function
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

          // Mock getValidTags to return a specific response
        require("@/lib/db").getValidInventoryTags.mockResolvedValue([{id: '1', name: "Shirt"}, {id: '2', name: "Candle"}]);
    });

    it("renders Inventory Add correctly", async () => {
      console.log("Rendering Inventory Add...");
      console.log("Mocked useUser:", useUser());  // Log what Jest is returning
  
      await act(async () => {
          const { debug } = render(<InventoryAdd />);
          await waitFor(() => debug()); // Wait until it renders
      });
  
      await waitFor(() => {
        expect(screen.getByText("Add New Inventory Item")).toBeInTheDocument();
    });
    // Ensure the mocked tags are used correctly in the component
    await waitFor(() => {
      expect(screen.getByText('Shirt')).toBeInTheDocument();
      expect(screen.getByText('Candle')).toBeInTheDocument();
    });
    
  });
  
});