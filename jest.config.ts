import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
  ],

  // ignore purely-type or setup modules that cannot contribute
  coveragePathIgnorePatterns: [
    "<rootDir>/src/services/auth/auth.types.ts",
    "<rootDir>/src/services/tasks/task.types.ts",
    "<rootDir>/src/teste/setupTests.ts",
  ],

  // thresholds de cobertura
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85,
    },
  },
};

export default createJestConfig(config);