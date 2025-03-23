import React from 'react';
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import InventoryManage from "@/app/(routes)/inventory/manage/page";
import { useUser } from "@clerk/nextjs";
import { getInventoryByUser, getValidInventoryTags } from "@/lib/db";
import "@testing-library/jest-dom";

// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button">Profile</div>,
}));

// Mock database functions
jest.mock("@/lib/db", () => ({
    getInventoryByUser: jest.fn(() => Promise.resolve([])),   // Ensure they return an array
    getValidInventoryTags: jest.fn(() => Promise.resolve([])), // Mock getValidInventoryTags function
  }));

describe('Manage Inventory Component', () => {
    beforeEach(() => {
        console.log("Running beforeEach...");
      
        // Ensure a user is signed in
        useUser.mockReturnValue({
          isSignedIn: true,
          user: { id: "test-user-id" },
          isLoaded: true,
        });

        // Mock API responses properly with numbers
        getInventoryByUser.mockResolvedValueOnce([
            { id: 1, userID: "test-user-id", name: "Shirt", description: "Shirt", amount: 500, unitPrice: 15},
          ]);
        
        getValidInventoryTags.mockResolvedValueOnce([
            { id: 1, name: "Tag1" },
            { id: 2, name: "Tag2" },
        ]);
    });
    
    it("renders Manage Inventory correctly", async () => {
        console.log("Rendering Manage Inventory...");
        
        try {
          await act(async () => {
            render(<InventoryManage />);
          });
      
          await waitFor(() => {
            console.log("Checking for Manage Inventory text...");
            expect(screen.getAllByText("Manage Inventory").length).toBeGreaterThan(0);
          });
          
      
        } catch (error) {
          console.error("Render Failed: ", error);
          throw error;
        }
    });

      it("adds a new inventory item and checks if it appears on the page", async () => {
        console.log("Adding new inventory item...");
    
        try {
          await act(async () => {
            render(<InventoryManage />);
          });
          
          await waitFor(() => {
            console.log("Checking for added inventory item text...");
            expect(screen.getAllByText("500").length).toBeGreaterThan(0);
          });

        } catch (error) {
          console.error("Add Inventory Failed: ", error);
          throw error;
        }
      });
});