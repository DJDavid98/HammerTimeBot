/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/archive/'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
  resolver: 'jest-ts-webcompat-resolver',
  setupFilesAfterEnv: ['./tests/setup-tests.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coveragePathIgnorePatterns: [
    'src/index.ts',
  ],
};

export default config;
