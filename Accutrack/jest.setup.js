import "@testing-library/jest-dom";
import React from "react";

// Polyfill TextEncoder for Jest
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock("recharts", () => {
    const OriginalModule = jest.requireActual("recharts");
    return {
      ...OriginalModule,
      ResponsiveContainer: ({ children }) => <div>{children}</div>, // Mock container
    };
  });
  