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
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Get Started")).toBeInTheDocument();
    expect(screen.queryByText("Expenses")).not.toBeInTheDocument();
    expect(screen.queryByText("Income")).not.toBeInTheDocument();
  });

  test("shows Dashboard, Expenses, Income, and Profile when signed in", () => {
    useUser.mockReturnValue({ isSignedIn: true });

    render(<Header />);
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByTestId("user-button")).toBeInTheDocument();  });
});
