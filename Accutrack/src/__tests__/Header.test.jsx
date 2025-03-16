// Tests if the header renders the correct information when signed in and out, must be updated if the header is updated 

import React from "react";
import { render, screen } from "@testing-library/react";
import { useUser } from "@clerk/nextjs";
import Header from "@/app/_components/Header";
import "@testing-library/jest-dom";


jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button">Profile</div>,
}));

describe("Header Component", () => {
  test("renders AccuTrack logo", () => {
    useUser.mockReturnValue({ isSignedIn: false });

    render(<Header />);
    
    expect(screen.getByText("AccuTrack")).toBeInTheDocument();
  });

  test("shows Dashboard and Get Started when signed out", () => {
    useUser.mockReturnValue({ isSignedIn: false });
  
    render(<Header />);
  
    // Expect at least one "Get Started" button
    expect(screen.getAllByRole("button", { name: "Get Started" }).length).toBeGreaterThan(0);
  
    // Expect "Dashboard" to NOT be visible when signed out
    expect(screen.queryByRole("button", { name: "Dashboard" })).not.toBeInTheDocument();
  });
  
  

  test("shows Dashboard, Expenses, Income, and Profile when signed in", () => {
    useUser.mockReturnValue({ isSignedIn: true });
  
    render(<Header />);
    
    // Check for at least one "Dashboard" button
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
  
    // Check for multiple "Expenses" buttons
    expect(screen.getAllByText("Expenses").length).toBeGreaterThan(0);
  
    // Check for "Income" and "Profile"
    expect(screen.getAllByText("Income").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("user-button").length).toBeGreaterThan(0);
  });
  
  
});
