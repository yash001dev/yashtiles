// Simple test script to verify token validation
// Run this in the browser console or as a Node.js script

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Test function to validate token
async function testTokenValidation(token) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/validate?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();
    console.log("Token validation result:", result);
    return result;
  } catch (error) {
    console.error("Token validation error:", error);
    return { isValid: false, message: error.message };
  }
}

// Test cases
console.log("Testing token validation...");

// Test 1: No token
testTokenValidation("").then((result) => {
  console.log("Test 1 - No token:", result);
});

// Test 2: Invalid token
testTokenValidation("invalid-token").then((result) => {
  console.log("Test 2 - Invalid token:", result);
});

// Test 3: Valid token (if you have one)
// testTokenValidation("your-valid-token-here").then(result => {
//   console.log("Test 3 - Valid token:", result);
// });

console.log("Token validation tests completed!");
