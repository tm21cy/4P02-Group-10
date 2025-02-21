export default {
    testEnvironment: "node", // Use Node.js environment
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest", // Use babel-jest for JS/JSX files
    },
    // Allow node-fetch (in node_modules) to be transformed
    transformIgnorePatterns: ["/node_modules/(?!node-fetch)"],
    testMatch: ["**/__tests__/integration/**/*.test.js"],
    moduleDirectories: ["node_modules", "src"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
    },
    setupFiles: ["dotenv/config"], // Automatically load environment variables
  };
  