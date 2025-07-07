import '@testing-library/jest-dom';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Suppress warning/error messages in tests
  warn: jest.fn(),
  error: jest.fn(),
};
