// jest.subscription.config.js
module.exports = {
    testEnvironment: "jsdom", // Required to simulate the browser for UI interactions
    testMatch: ["<rootDir>/src/__tests__/subscription/**/*.test.{js,jsx}"], // Your test path
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    transformIgnorePatterns: ["/node_modules/(?!node-fetch)"],
    moduleDirectories: ["node_modules", "src"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
      "^@/app/\\(routes\\)/(.*)$": "<rootDir>/src/app/(routes)/$1",
    },
    setupFiles: ["dotenv/config"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Include RTL matchers, etc.
    
    reporters: [
      "default",
      ["jest-ctrf-json-reporter", {
        outputFile: "jest-report/subscription-ctrf-report.json"
      }]
    ],
    
};

  