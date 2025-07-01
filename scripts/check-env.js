#!/usr/bin/env node

/**
 * Environment Variables Checker
 * This script validates that all required environment variables are set
 */

const requiredEnvVars = [
  "NEXT_PUBLIC_BASE_URL",
  "NEXT_PUBLIC_APP_NAME",
  "NEXT_PUBLIC_ENVIRONMENT",
];

const optionalEnvVars = [
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_APP_VERSION",
  "NEXT_PUBLIC_ENABLE_DEBUG",
  "NEXT_PUBLIC_ENABLE_ANALYTICS",
];

console.log("🔍 Checking environment variables...\n");

// Check required variables
let missingRequired = [];
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    missingRequired.push(varName);
    console.log(`❌ ${varName}: Missing (Required)`);
  } else {
    console.log(`✅ ${varName}: ${value}`);
  }
});

console.log("\n📋 Optional variables:");
// Check optional variables
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`⚠️  ${varName}: Not set (Optional)`);
  } else {
    console.log(`✅ ${varName}: ${value}`);
  }
});

console.log("\n🌍 Environment Info:");
console.log(`   NODE_ENV: ${process.env.NODE_ENV || "not set"}`);
console.log(
  `   Environment: ${process.env.NEXT_PUBLIC_ENVIRONMENT || "not set"}`
);
console.log(`   Base URL: ${process.env.NEXT_PUBLIC_BASE_URL || "not set"}`);

if (missingRequired.length > 0) {
  console.log("\n❌ Error: Missing required environment variables:");
  missingRequired.forEach((varName) => {
    console.log(`   - ${varName}`);
  });
  console.log(
    "\n💡 Make sure to copy .env.example to .env.local and fill in the values."
  );
  process.exit(1);
} else {
  console.log("\n✅ All required environment variables are set!");
}
