import dotenv from "dotenv";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";

dotenv.config();

//const API_URL = "https://api.clerk.com/v1";
const API_URL = "https://stirring-rooster-86.clerk.accounts.dev";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_TESTING_TOKEN = process.env.CLERK_TESTING_TOKEN;

const testEmail = "sangmitra.m06+clerk_test@gmail.com";
const verificationCode = "424242"; 
describe("Clerk Authentication - Test Sign In", () => {
  let sessionToken = null;

  it("should successfully sign in a registered user using OTP", async () => {
    const signInStart = await fetch(`${API_URL}/sign_ins?__clerk_testing_token=${CLERK_TESTING_TOKEN}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier: testEmail }),
    });

    const signInStartText = await signInStart.text();
    console.log("🔹 Sign-In Start Response:", signInStartText, "Status:", signInStart.status);

    if (signInStart.status !== 200) {
      throw new Error(` Clerk Sign-In Failed! Status: ${signInStart.status}`);
    }

    let signInStartData = JSON.parse(signInStartText);
    expect(signInStart.status).toBe(200);
    expect(signInStartData.id).toBeDefined();
    const signInId = signInStartData.id;

    const otpVerification = await fetch(`${API_URL}/sign_ins/${signInId}/attempt_first_factor?__clerk_testing_token=${CLERK_TESTING_TOKEN}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        strategy: "email_code",
        code: verificationCode, 
      }),
    });

    const otpVerificationText = await otpVerification.text();
    console.log("🔹 OTP Verification Response:", otpVerificationText, "Status:", otpVerification.status);

    let otpVerificationData = JSON.parse(otpVerificationText);
    expect(otpVerification.status).toBe(200);
    expect(otpVerificationData.status).toBe("complete");

    sessionToken = otpVerificationData.client_sign_in_token;

    const createSession = await fetch(`${API_URL}/sessions?__clerk_testing_token=${CLERK_TESTING_TOKEN}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: otpVerificationData.user_id,
        client_sign_in_token: sessionToken,
      }),
    });

    const sessionText = await createSession.text();
    console.log("🔹 Session Creation Response:", sessionText, "Status:", createSession.status);

    let sessionData = JSON.parse(sessionText);
    expect(createSession.status).toBe(200);
    expect(sessionData.id).toBeDefined();
  });

  it("should fail sign-in with incorrect OTP", async () => {
    const signInStart = await fetch(`${API_URL}/sign_ins?__clerk_testing_token=${CLERK_TESTING_TOKEN}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier: testEmail }),
    });

    const signInStartText = await signInStart.text();
    console.log("🔹 Incorrect Sign-In Start Response:", signInStartText, "Status:", signInStart.status);

    if (signInStart.status !== 200) {
      throw new Error(` Clerk Sign-In Failed! Status: ${signInStart.status}`);
    }

    let signInStartData = JSON.parse(signInStartText);
    expect(signInStart.status).toBe(200);
    expect(signInStartData.id).toBeDefined();
    const signInId = signInStartData.id;

    const otpVerification = await fetch(`${API_URL}/sign_ins/${signInId}/attempt_first_factor?__clerk_testing_token=${CLERK_TESTING_TOKEN}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        strategy: "email_code",
        code: "123456", 
      }),
    });

    const otpVerificationText = await otpVerification.text();
    console.log("🔹 Incorrect OTP Response:", otpVerificationText, "Status:", otpVerification.status);

    let signInFailData = JSON.parse(otpVerificationText);
    expect(otpVerification.status).toBe(401); // Should return 401 Unauthorized
    expect(signInFailData.errors).toBeDefined();
    expect(signInFailData.errors[0].message.toLowerCase()).toContain("incorrect code");
  });
});
