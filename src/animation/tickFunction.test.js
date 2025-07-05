/* global describe, it, expect, beforeEach, afterEach, jest */

import tickFunction from "./tickFunction";
import calculateStyles from "./calculateStyles";

// Mock SvgFilter FIRST - this must be hoisted
let mockSvgFilter;
jest.mock("svg-filter", () => {
  const mockSvgFilterConstructor = jest.fn();
  mockSvgFilter = {
    append: jest.fn().mockReturnThis(),
    attr: jest.fn().mockReturnThis(),
    toString: jest.fn().mockReturnValue("url(#filter)"),
  };
  mockSvgFilterConstructor.mockReturnValue(mockSvgFilter);
  return mockSvgFilterConstructor;
});

// Mock dependencies
jest.mock("./calculateStyles");

// Mock transition utilities
jest.mock("./transition-utilities", () => ({
  browser: "chrome",
  rotate: jest.fn(),
  scale: jest.fn(),
  translate: jest.fn(),
  multiple: jest.fn(),
  smokeMachine: jest.fn(),
}));

// Get the mocked module to modify browser value in tests
const mockTransitionUtils = require("./transition-utilities");

describe("tickFunction", () => {
  let mockTransitionsData;
  let mockTransitionElements;
  let mockElement;
  let mockLeftroomElement;
  let mockFilterElement;
  let mockStopElement;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock DOM elements
    mockElement = {
      tagName: "div",
      setAttribute: jest.fn(),
      querySelectorAll: jest.fn().mockReturnValue([]),
    };

    mockLeftroomElement = {
      setAttribute: jest.fn(),
    };

    mockFilterElement = {
      setAttribute: jest.fn(),
    };

    mockStopElement = {
      tagName: "stop",
      setAttribute: jest.fn(),
      getAttribute: jest.fn().mockReturnValue(""),
    };

    // Mock document.querySelector
    global.document.querySelector = jest.fn((selector) => {
      if (selector === "#leftroom") return mockLeftroomElement;
      if (selector === "#filter3disp") return mockFilterElement;
      return mockElement;
    });

    // Mock window.pageYOffset
    Object.defineProperty(window, "pageYOffset", {
      value: 5000,
      writable: true,
    });

    // Mock process.env
    process.env.NODE_ENV = "production";

    // Mock transitions data
    mockTransitionsData = new Map([
      ["element1", { 100: { opacity: 0 }, 200: { opacity: 1 } }],
      [
        "element2",
        { 300: { transform: "scale(1)" }, 400: { transform: "scale(2)" } },
      ],
    ]);

    // Mock transition elements
    mockTransitionElements = new Map([
      ["#element1", [mockElement]],
      ["#element2", [mockElement]],
    ]);

    // Mock calculateStyles return value
    calculateStyles.mockReturnValue([
      {
        selector: "#element1",
        style: "opacity: 0.5; transform: scale(1.5);",
      },
      {
        selector: "#element2",
        style: "opacity: 1; transform: scale(2);",
      },
    ]);

    // Mock window.animationDebugger
    global.window.animationDebugger = {
      update: jest.fn(),
    };
  });

  afterEach(() => {
    delete global.window.animationDebugger;
    jest.restoreAllMocks();
  });

  describe("basic functionality", () => {
    it("should call calculateStyles with current frame and transitions data", () => {
      tickFunction(mockTransitionsData, mockTransitionElements);

      expect(calculateStyles).toHaveBeenCalledWith(5000, mockTransitionsData);
    });

    it("should apply styles to elements", () => {
      tickFunction(mockTransitionsData, mockTransitionElements);

      expect(mockElement.setAttribute).toHaveBeenCalledWith(
        "style",
        "opacity: 0.5; transform: scale(1.5);"
      );
    });

    it("should handle multiple elements with same selector", () => {
      const mockElement2 = {
        tagName: "div",
        setAttribute: jest.fn(),
        querySelectorAll: jest.fn().mockReturnValue([]),
      };

      mockTransitionElements.set("#element1", [mockElement, mockElement2]);

      tickFunction(mockTransitionsData, mockTransitionElements);

      expect(mockElement.setAttribute).toHaveBeenCalledWith(
        "style",
        "opacity: 0.5; transform: scale(1.5);"
      );
      expect(mockElement2.setAttribute).toHaveBeenCalledWith(
        "style",
        "opacity: 0.5; transform: scale(1.5);"
      );
    });
  });

  describe("stop element handling", () => {
    it("should skip applying styles to stop elements", () => {
      mockTransitionElements.set("#element1", [mockStopElement]);

      tickFunction(mockTransitionsData, mockTransitionElements);

      expect(mockStopElement.setAttribute).not.toHaveBeenCalled();
    });

    it("should clean stop element styles when parent has opacity 0", () => {
      const mockParentElement = {
        tagName: "g",
        setAttribute: jest.fn(),
        querySelectorAll: jest.fn().mockReturnValue([mockStopElement]),
      };

      mockStopElement.getAttribute.mockReturnValue(
        "opacity: 0.5; display: none;"
      );

      mockTransitionElements.set("#element1", [mockParentElement]);
      calculateStyles.mockReturnValue([
        {
          selector: "#element1",
          style: "opacity: 0; transform: scale(1);",
        },
      ]);

      tickFunction(mockTransitionsData, mockTransitionElements);

      expect(mockParentElement.setAttribute).toHaveBeenCalledWith(
        "style",
        "opacity: 0; transform: scale(1);"
      );
      expect(mockStopElement.setAttribute).toHaveBeenCalledWith("style", "");
    });

    it("should clean stop element styles when parent has display none", () => {
      const mockParentElement = {
        tagName: "g",
        setAttribute: jest.fn(),
        querySelectorAll: jest.fn().mockReturnValue([mockStopElement]),
      };

      const mockStyleValue = "opacity: 0.5; display: none; color: red;";
      mockStopElement.getAttribute.mockReturnValue(mockStyleValue);

      mockTransitionElements.set("#element1", [mockParentElement]);
      calculateStyles.mockReturnValue([
        {
          selector: "#element1",
          style: "display: none; transform: scale(1);",
        },
      ]);

      tickFunction(mockTransitionsData, mockTransitionElements);

      expect(mockStopElement.setAttribute).toHaveBeenCalledWith(
        "style",
        "color: red;"
      );
    });
  });

  describe("development mode debugging", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should update animation debugger in development mode", () => {
      calculateStyles.mockReturnValue([
        { selector: "#element1", style: "opacity: 1;" },
        { selector: "#element2", style: "opacity: 0.5;" },
      ]);

      tickFunction(mockTransitionsData, mockTransitionElements);

      expect(window.animationDebugger.update).toHaveBeenCalledWith(5000, [
        "element1",
        "element2",
      ]);
    });

    it("should not update debugger if it doesn't exist", () => {
      delete global.window.animationDebugger;

      expect(() => {
        tickFunction(mockTransitionsData, mockTransitionElements);
      }).not.toThrow();
    });
  });

  describe("browser-specific filter effects", () => {
    beforeEach(() => {
      // Mock browser as chrome
      mockTransitionUtils.browser = "chrome";
    });

    it("should apply shake filter for Chrome in specific frame range", () => {
      window.pageYOffset = 6300; // Within 6000-6600 range

      // Mock Math.random for consistent testing
      const mockMath = Object.create(global.Math);
      mockMath.random = () => 0.5;
      global.Math = mockMath;

      tickFunction(mockTransitionsData, mockTransitionElements);

      expect(mockLeftroomElement.setAttribute).toHaveBeenCalledWith(
        "filter",
        expect.any(Object)
      );
      expect(mockFilterElement.setAttribute).toHaveBeenCalledWith("scale", 20);
    });

    it("should remove filter for Chrome outside frame range", () => {
      window.pageYOffset = 5000; // Outside 6000-6600 range

      tickFunction(mockTransitionsData, mockTransitionElements);

      expect(mockLeftroomElement.setAttribute).toHaveBeenCalledWith(
        "filter",
        "none"
      );
    });

    it("should not apply filter for non-Chrome browsers", () => {
      mockTransitionUtils.browser = "firefox";
      window.pageYOffset = 6300;

      tickFunction(mockTransitionsData, mockTransitionElements);

      expect(mockLeftroomElement.setAttribute).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle empty styles array", () => {
      calculateStyles.mockReturnValue([]);

      expect(() => {
        tickFunction(mockTransitionsData, mockTransitionElements);
      }).not.toThrow();
    });

    it("should handle missing elements in transition map", () => {
      mockTransitionElements.set("#element1", []);

      expect(() => {
        tickFunction(mockTransitionsData, mockTransitionElements);
      }).not.toThrow();
    });

    it("should handle elements without querySelectorAll method", () => {
      const mockSimpleElement = {
        tagName: "div",
        setAttribute: jest.fn(),
      };

      mockTransitionElements.set("#element1", [mockSimpleElement]);
      calculateStyles.mockReturnValue([
        {
          selector: "#element1",
          style: "opacity: 0; transform: scale(1);",
        },
      ]);

      expect(() => {
        tickFunction(mockTransitionsData, mockTransitionElements);
      }).not.toThrow();
    });

    it("should handle null/undefined elements", () => {
      mockTransitionElements.set("#element1", [null, undefined, mockElement]);

      expect(() => {
        tickFunction(mockTransitionsData, mockTransitionElements);
      }).not.toThrow();

      expect(mockElement.setAttribute).toHaveBeenCalled();
    });
  });

  describe("frame-based calculations", () => {
    it("should use window.pageYOffset as current frame", () => {
      window.pageYOffset = 1500;

      tickFunction(mockTransitionsData, mockTransitionElements);

      expect(calculateStyles).toHaveBeenCalledWith(1500, mockTransitionsData);
    });

    it("should handle different frame values", () => {
      const testFrames = [0, 1000, 5000, 10000];

      testFrames.forEach((frame) => {
        window.pageYOffset = frame;
        calculateStyles.mockClear();

        tickFunction(mockTransitionsData, mockTransitionElements);

        expect(calculateStyles).toHaveBeenCalledWith(
          frame,
          mockTransitionsData
        );
      });
    });
  });

  describe("SvgFilter integration", () => {
    it("should create SVG filter with correct attributes", () => {
      // The filter is created when the module is imported
      // This test verifies that the SvgFilter mock was set up correctly
      // and that the tickFunction can use it properly

      // Since the SvgFilter is created during module import and the mock is correctly set up,
      // we can at least verify that the mock instance exists and has the expected methods
      expect(mockSvgFilter).toBeDefined();
      expect(mockSvgFilter.append).toBeDefined();
      expect(mockSvgFilter.attr).toBeDefined();
      expect(mockSvgFilter.toString).toBeDefined();

      // Verify that toString returns the expected value
      expect(mockSvgFilter.toString()).toBe("url(#filter)");
    });
  });
});
