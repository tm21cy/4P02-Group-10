import dotenv from "dotenv";
import fetch from "node-fetch"; 

dotenv.config();

const API_URL = "https://api.clerk.com/v1";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

console.log("Using Clerk Secret Key:", CLERK_SECRET_KEY);

let testEmail;
let testPassword = "Hungerhanger_123";


beforeAll(() => {
  // Generate a unique email to avoid duplicate conflicts for sign-up tests
  testEmail = `testuser-${Date.now()}+clerk_test@example.com`;
});

describe("Clerk Authentication - Sign Up", () => {
  it("should successfully create a new user", async () => {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email_address: [testEmail],
        password: testPassword,
      }),
    });

    const text = await response.text();
    console.log("Sign-Up RAW RESPONSE:", text, "Status:", response.status);

    if (!text) {
      throw new Error(`Empty response from Clerk API. Status: ${response.status}`);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error("Invalid JSON response from Clerk API");
    }

    expect([200, 201]).toContain(response.status);
    expect(data.id).toBeDefined();
    expect(data.email_addresses[0].email_address).toBe(testEmail);
  });

  it("should fail for already registered email", async () => {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email_address: [testEmail], 
        password: testPassword,
      }),
    });

    const text = await response.text();
    console.log("Duplicate Sign-Up RAW RESPONSE:", text, "Status:", response.status);

    if (!text) {
      throw new Error(`Empty response from Clerk API. Status: ${response.status}`);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error("Invalid JSON response from Clerk API");
    }

    const errorMessage = data.errors?.[0]?.message.toLowerCase() || "";
    expect(errorMessage).toContain("that email address is taken. please try another.");
  });
});

