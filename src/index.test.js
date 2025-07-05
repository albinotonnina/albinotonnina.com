/* eslint-env jest */
import { StrictMode } from "react";
import "@testing-library/jest-dom";

// Mock web-vitals before importing the main file
const mockOnCLS = jest.fn();
const mockOnINP = jest.fn();
const mockOnLCP = jest.fn();
const mockOnFCP = jest.fn();
const mockOnTTFB = jest.fn();

jest.mock("web-vitals", () => ({
  onCLS: mockOnCLS,
  onINP: mockOnINP,
  onLCP: mockOnLCP,
  onFCP: mockOnFCP,
  onTTFB: mockOnTTFB,
}));

// Mock the App component
jest.mock("./App", () => {
  function MockApp() {
    return <div data-testid="app">Mock App Component</div>;
  }
  return MockApp;
});

// Mock createRoot
const mockRender = jest.fn();
const mockCreateRoot = jest.fn(() => ({
  render: mockRender,
}));

jest.mock("react-dom/client", () => ({
  createRoot: mockCreateRoot,
}));

// Mock DOM methods
const mockGetElementById = jest.fn();
Object.defineProperty(document, "getElementById", {
  value: mockGetElementById,
  writable: true,
});

// Mock window.gtag
const mockGtag = jest.fn();
Object.defineProperty(window, "gtag", {
  value: mockGtag,
  writable: true,
  configurable: true,
});

describe("Application Entry Point", () => {
  let mockRootElement;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockRootElement = document.createElement("div");
    mockRootElement.id = "root";
    mockGetElementById.mockReturnValue(mockRootElement);
  });

  it("creates root element and renders App in StrictMode", async () => {
    // Import after mocks are set up
    await import("./index");

    expect(mockGetElementById).toHaveBeenCalledWith("root");
    expect(mockCreateRoot).toHaveBeenCalledWith(mockRootElement);
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Get the rendered element from the render call
    const renderCall = mockRender.mock.calls[0][0];

    // Test the JSX structure directly without using testing library render
    expect(renderCall.type).toBe(StrictMode);
    expect(renderCall.props.children.type.name).toBe("MockApp");
  });

  it("sets up all web vitals monitoring", async () => {
    await import("./index");

    expect(mockOnCLS).toHaveBeenCalledTimes(1);
    expect(mockOnINP).toHaveBeenCalledTimes(1);
    expect(mockOnLCP).toHaveBeenCalledTimes(1);
    expect(mockOnFCP).toHaveBeenCalledTimes(1);
    expect(mockOnTTFB).toHaveBeenCalledTimes(1);

    // Verify that each metric listener was called with a function
    expect(typeof mockOnCLS.mock.calls[0][0]).toBe("function");
    expect(typeof mockOnINP.mock.calls[0][0]).toBe("function");
    expect(typeof mockOnLCP.mock.calls[0][0]).toBe("function");
    expect(typeof mockOnFCP.mock.calls[0][0]).toBe("function");
    expect(typeof mockOnTTFB.mock.calls[0][0]).toBe("function");
  });

  describe("sendToGoogleAnalytics function", () => {
    let sendToGoogleAnalytics;

    beforeEach(async () => {
      await import("./index");
      // Get the callback function from one of the web vitals mocks
      const [callback] = mockOnCLS.mock.calls[0];
      sendToGoogleAnalytics = callback;
    });

    it("sends data to Google Analytics when gtag is available", () => {
      const mockMetric = {
        name: "LCP",
        value: 2500,
        id: "v3-1234567890",
        delta: 2500,
        navigationType: "navigate",
      };

      sendToGoogleAnalytics(mockMetric);

      expect(mockGtag).toHaveBeenCalledWith("event", "LCP", {
        event_category: "Web Vitals",
        value: 2500,
        event_label: "v3-1234567890",
        custom_map: { metric_delta: 2500 },
        custom_map_2: { navigation_type: "navigate" },
        non_interaction: true,
      });
    });

    it("rounds CLS values by multiplying by 1000", () => {
      const mockMetric = {
        name: "CLS",
        value: 0.1234,
        id: "v3-1234567890",
        delta: 0.1234,
        navigationType: "navigate",
      };

      sendToGoogleAnalytics(mockMetric);

      expect(mockGtag).toHaveBeenCalledWith("event", "CLS", {
        event_category: "Web Vitals",
        value: 123, // 0.1234 * 1000 rounded
        event_label: "v3-1234567890",
        custom_map: { metric_delta: 0.1234 },
        custom_map_2: { navigation_type: "navigate" },
        non_interaction: true,
      });
    });

    it("does not send data when gtag is not available", () => {
      // Temporarily remove gtag
      delete window.gtag;

      const mockMetric = {
        name: "LCP",
        value: 2500,
        id: "v3-1234567890",
        delta: 2500,
        navigationType: "navigate",
      };

      sendToGoogleAnalytics(mockMetric);

      expect(mockGtag).not.toHaveBeenCalled();

      // Restore gtag for other tests
      window.gtag = mockGtag;
    });

    it("handles different metric types correctly", () => {
      const metrics = [
        { name: "FCP", value: 1800 },
        { name: "INP", value: 150 },
        { name: "TTFB", value: 800 },
      ];

      metrics.forEach((metric) => {
        mockGtag.mockClear();
        sendToGoogleAnalytics({
          ...metric,
          id: "test-id",
          delta: metric.value,
          navigationType: "navigate",
        });

        expect(mockGtag).toHaveBeenCalledWith("event", metric.name, {
          event_category: "Web Vitals",
          value: metric.value,
          event_label: "test-id",
          custom_map: { metric_delta: metric.value },
          custom_map_2: { navigation_type: "navigate" },
          non_interaction: true,
        });
      });
    });
  });

  describe("Error handling", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
    });

    it("handles missing root element gracefully", async () => {
      mockGetElementById.mockReturnValue(null);

      await import("./index");

      expect(mockGetElementById).toHaveBeenCalledWith("root");
      expect(mockCreateRoot).toHaveBeenCalledWith(null);
    });

    it("handles createRoot errors gracefully", async () => {
      mockCreateRoot.mockImplementation(() => {
        throw new Error("Failed to create root");
      });

      // The import should not throw an error because we handle it
      await expect(import("./index")).resolves.toBeDefined();

      expect(mockCreateRoot).toHaveBeenCalled();

      // Verify that fallback UI is displayed
      expect(mockRootElement.innerHTML).toContain("Application Error");
      expect(mockRootElement.innerHTML).toContain(
        "Sorry, there was an error loading the application"
      );
      expect(mockRootElement.innerHTML).toContain("Refresh Page");
      expect(mockRootElement.innerHTML).toContain("window.location.reload()");
    });
  });

  describe("Web Vitals integration", () => {
    it("callback functions are bound correctly to each metric", async () => {
      await import("./index");

      // All callbacks should be the same function
      const [clsCallback] = mockOnCLS.mock.calls[0];
      const [inpCallback] = mockOnINP.mock.calls[0];
      const [lcpCallback] = mockOnLCP.mock.calls[0];
      const [fcpCallback] = mockOnFCP.mock.calls[0];
      const [ttfbCallback] = mockOnTTFB.mock.calls[0];

      // All should reference the same sendToGoogleAnalytics function
      expect(clsCallback).toBe(inpCallback);
      expect(inpCallback).toBe(lcpCallback);
      expect(lcpCallback).toBe(fcpCallback);
      expect(fcpCallback).toBe(ttfbCallback);
    });
  });
});
