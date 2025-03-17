module.exports = {
    testEnvironment: "node", // Use Node.js for backend tests
    testMatch: ["**/__tests__/backend/**/*.test.js?(x)"], // Match backend test files
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    moduleDirectories: ["node_modules", "src"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testTimeout: 30000
  };
  