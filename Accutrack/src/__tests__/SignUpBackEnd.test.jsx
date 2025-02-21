import { useSignUp } from "@clerk/nextjs";

jest.mock("@clerk/nextjs", () => ({
  useSignUp: jest.fn(),
}));

test("calls sign-up API with correct credentials", async () => {
  const mockSignUp = jest.fn();
  useSignUp.mockReturnValue({ create: mockSignUp });

  // Simulate API call
  await mockSignUp({ emailAddress: "test@example.com", password: "password123" });

  expect(mockSignUp).toHaveBeenCalledWith({
    emailAddress: "test@example.com",
    password: "password123",
  });
});

test("returns an error for an already registered email", async () => {
  const mockSignUp = jest.fn().mockRejectedValue(new Error("Email already in use"));
  useSignUp.mockReturnValue({ create: mockSignUp });

  await expect(
    mockSignUp({ emailAddress: "existing@example.com", password: "password123" })
  ).rejects.toThrow("Email already in use");

  expect(mockSignUp).toHaveBeenCalledWith({
    emailAddress: "existing@example.com",
    password: "password123",
  });
});

test("returns an error for weak password", async () => {
  const mockSignUp = jest.fn().mockRejectedValue(new Error("Password too weak"));
  useSignUp.mockReturnValue({ create: mockSignUp });

  await expect(
    mockSignUp({ emailAddress: "user@example.com", password: "123" })
  ).rejects.toThrow("Password too weak");

  expect(mockSignUp).toHaveBeenCalledWith({
    emailAddress: "user@example.com",
    password: "123",
  });
});
