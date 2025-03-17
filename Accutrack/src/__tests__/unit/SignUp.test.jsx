import React from "react";
import { render, screen } from "@testing-library/react";
import { SignUp } from "@clerk/nextjs";
import "@testing-library/jest-dom";

// Mocking Clerk's SignUp component
jest.mock("@clerk/nextjs", () => ({
  SignUp: () => (
    <div data-testid="signup-form">
      <h1>Create your account</h1>
      <input type="email" placeholder="Enter your email address" />
      <input type="password" placeholder="Enter your password" />
      <button>Continue</button>
    </div>
  ),
}));

import SignUpPage from "@/app/(auth)/sign-up/[[...sign-up]]/page";

describe("Sign-Up Page", () => {
  it("renders the Sign-Up form correctly", () => {
    render(<SignUpPage />);
    const signUpForm = screen.getByTestId("signup-form");
    expect(signUpForm).toBeInTheDocument();
    expect(signUpForm).toBeVisible(); // Ensures it is visible
  });

  it("displays the correct form title", () => {
    render(<SignUpPage />);
    const title = screen.getByText("Create your account");
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible(); 
  });

  it("renders email and password input fields", () => {
    render(<SignUpPage />);
    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    expect(emailInput).toBeVisible(); 
    expect(passwordInput).toBeVisible(); 
  });

  it("renders the continue button and it is visible", () => {
    render(<SignUpPage />);
    const continueButton = screen.getByRole("button", { name: /continue/i });

    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toBeVisible(); // Ensures button is visible
  });
});
