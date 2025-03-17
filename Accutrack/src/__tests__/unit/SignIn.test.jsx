import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignIn } from "@clerk/nextjs";
import "@testing-library/jest-dom";

// ✅ Define MockSignIn outside jest.mock()
const MockSignIn = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (email === "unregistered@example.com") {
      setError("No account found with this identifier. Please check and try again.");
    } else {
      setSuccess(true);
    }
  };

  return (
    <div data-testid="signin-form">
      <h1>Sign in to My Application</h1>
      {!success ? (
        <>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubmit}>Continue</button>
          {error && <p data-testid="error-message">{error}</p>}
        </>
      ) : (
        <p data-testid="code-entry">Enter the code sent to your email</p>
      )}
    </div>
  );
};

// ✅ Mock Clerk's SignIn component (using the separate function)
jest.mock("@clerk/nextjs", () => ({
  SignIn: () => <MockSignIn />,  // Use the separate function here
}));

import SignInPage from "@/app/(auth)/sign-in/[[...sign-in]]/page";

describe("Sign-In Page", () => {
  it("renders the Sign-In form correctly", () => {
    render(<SignInPage />);
    expect(screen.getByTestId("signin-form")).toBeInTheDocument();
  });

  it("displays the correct welcome message", () => {
    render(<SignInPage />);
    expect(screen.getByText("Sign in to My Application")).toBeInTheDocument();
  });

  it("renders the email input field", () => {
    render(<SignInPage />);
    expect(screen.getByPlaceholderText("Enter your email address")).toBeInTheDocument();
  });

  it("shows an error if an unregistered email is entered", async () => {
    render(<SignInPage />);
    
    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const continueButton = screen.getByRole("button", { name: /continue/i });

    fireEvent.change(emailInput, { target: { value: "unregistered@example.com" } });
    fireEvent.click(continueButton);

    expect(await screen.findByTestId("error-message")).toBeInTheDocument();
  });

  it("navigates to the code entry step when a valid email is entered", async () => {
    render(<SignInPage />);
    
    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const continueButton = screen.getByRole("button", { name: /continue/i });

    fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByTestId("code-entry")).toBeInTheDocument();
    });
  });
});
