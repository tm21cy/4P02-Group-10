import dotenv from "dotenv";
import fetch from "node-fetch"; // Ensure node-fetch v2 is used

dotenv.config();

const API_URL = "https://api.clerk.com/v1/users"; // Clerk API endpoint
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

console.log("Using Clerk Secret Key:", CLERK_SECRET_KEY);

describe("Clerk Authentication - Sign Up", () => {
  it("should successfully create a new user", async () => {
    // Generate a unique email to avoid duplicate conflicts
    const uniqueEmail = `testuser-${Date.now()}@example.com`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email_address: [uniqueEmail], // ✅ FIX: email_address should be an ARRAY
        password: "Hungerhanger_123", // ✅ Ensure strong password
      }),
    });

    const text = await response.text();
    console.log("RAW RESPONSE:", text, "Status:", response.status);

    if (!text) {
      throw new Error(`Empty response from Clerk API. Status: ${response.status}`);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error("Invalid JSON response from Clerk API");
    }

    // Clerk should return 200 or 201 for successful user creation
    expect([200, 201]).toContain(response.status);
    expect(data.id).toBeDefined();
    expect(data.email_addresses[0].email_address).toBe(uniqueEmail);
  });

  it("should fail for already registered email", async () => {
    const existingEmail = "sangmitra.m06@gmail.com"; // Ensure this email exists in Clerk

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email_address: [existingEmail], // ✅ FIX: email_address should be an ARRAY
        password: "SecurePass123!", // ✅ Ensure strong password
      }),
    });

    const text = await response.text();
    console.log("RAW RESPONSE:", text, "Status:", response.status);

    if (!text) {
      throw new Error(`Empty response from Clerk API. Status: ${response.status}`);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error("Invalid JSON response from Clerk API");
    }

    // Instead of checking for 422, check for Clerk's error message indicating duplicate email
    const errorMessage = data.errors?.[0]?.message || "";

    expect(errorMessage.toLowerCase()).toContain("that email address is taken. please try another.");
  });
});
