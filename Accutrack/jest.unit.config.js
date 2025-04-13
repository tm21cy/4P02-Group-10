module.exports = {
    testEnvironment: "jsdom", // Use jsdom for React component tests
    rootDir: process.cwd(), // Ensures Jest starts from the project root
    testMatch: ["<rootDir>/src/__tests__/unit/**/*.test.{js,jsx}"], // Look for unit tests
    testPathIgnorePatterns: ["<rootDir>/node_modules/"], // Ignore node_modules
    moduleDirectories: ["node_modules", "src"], // Allow absolute imports
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1", // Support for @ imports
      "^react-router-dom$": "<rootDir>/node_modules/react-router-dom/dist/index.js"
    },
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest" // Transform JSX and JS files with Babel
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Extra setup if needed
  };
  