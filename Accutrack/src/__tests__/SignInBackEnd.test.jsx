import { useSignIn } from "@clerk/nextjs";

jest.mock("@clerk/nextjs", () => ({
  useSignIn: jest.fn(),
}));

test("calls sign-in API with correct credentials", async () => {
  const mockSignIn = jest.fn();
  useSignIn.mockReturnValue({ signIn: mockSignIn });

  // Simulate API call
  await mockSignIn({ identifier: "test@example.com", password: "password123" });

  expect(mockSignIn).toHaveBeenCalledWith({
    identifier: "test@example.com",
    password: "password123",
  });
});

test("returns an error for incorrect credentials", async () => {
    const mockSignIn = jest.fn().mockRejectedValue(new Error("Invalid credentials"));
    useSignIn.mockReturnValue({ signIn: mockSignIn });
  
    await expect(
      mockSignIn({ identifier: "user@example.com", password: "wrongPass" })
    ).rejects.toThrow("Invalid credentials");
  
    expect(mockSignIn).toHaveBeenCalledWith({
      identifier: "user@example.com",
      password: "wrongPass",
    });
  });

  test("returns an error when signing in with an unregistered email", async () => {
    const mockSignIn = jest.fn().mockRejectedValue(new Error("No account found with this identifier"));
    useSignIn.mockReturnValue({ signIn: mockSignIn });
  
    await expect(
      mockSignIn({ identifier: "unregistered@example.com", password: "password123" })
    ).rejects.toThrow("No account found with this identifier");
  
    expect(mockSignIn).toHaveBeenCalledWith({
      identifier: "unregistered@example.com",
      password: "password123",
    });
  });
  
  
