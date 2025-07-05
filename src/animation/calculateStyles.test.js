/* global describe, it, expect, beforeEach, jest */

import calculateStyles from "./calculateStyles";

// Mock the dependencies
jest.mock("style-object-to-css-string", () => {
  return jest.fn((obj) => {
    // Simple mock implementation that converts object to CSS-like string
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");
  });
});

jest.mock("d3-interpolate", () => ({
  interpolateObject: jest.fn((start, end) => {
    // Mock interpolation function
    return (t) => {
      const result = {};
      Object.keys(start).forEach((key) => {
        if (typeof start[key] === "number" && typeof end[key] === "number") {
          result[key] = start[key] + (end[key] - start[key]) * t;
        } else {
          result[key] = t < 0.5 ? start[key] : end[key];
        }
      });
      return result;
    };
  }),
}));

describe("calculateStyles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("basic functionality", () => {
    it("should return empty array when no transitions provided", () => {
      const result = calculateStyles(100, []);
      expect(result).toEqual([]);
    });

    it("should return empty array when transitions map is empty", () => {
      const transitions = new Map();
      const result = calculateStyles(100, transitions);
      expect(result).toEqual([]);
    });

    it("should calculate styles for a simple transition", () => {
      const transitions = new Map([
        [
          "element1",
          {
            100: { opacity: 0, x: 0 },
            200: { opacity: 1, x: 100 },
          },
        ],
      ]);

      const result = calculateStyles(150, transitions);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        selector: "#element1",
        style: expect.stringContaining("opacity: 0.5"),
      });
    });

    it("should handle multiple elements", () => {
      const transitions = new Map([
        [
          "element1",
          {
            100: { opacity: 0 },
            200: { opacity: 1 },
          },
        ],
        [
          "element2",
          {
            150: { x: 0 },
            250: { x: 100 },
          },
        ],
      ]);

      const result = calculateStyles(175, transitions);

      expect(result).toHaveLength(2);
      expect(result.find((r) => r.selector === "#element1")).toBeDefined();
      expect(result.find((r) => r.selector === "#element2")).toBeDefined();
    });
  });

  describe("frame range handling", () => {
    it("should not process transitions outside of range", () => {
      const transitions = new Map([
        [
          "element1",
          {
            1000: { opacity: 0 },
            2000: { opacity: 1 },
          },
        ],
      ]);

      // Frame 100 is way outside the 1000-2000 range (considering 250 buffer)
      const result = calculateStyles(100, transitions);
      expect(result).toEqual([]);
    });

    it("should process transitions within range buffer", () => {
      const transitions = new Map([
        [
          "element1",
          {
            500: { opacity: 0 },
            600: { opacity: 1 },
          },
        ],
      ]);

      // Frame 300 should be within range due to 250 buffer (500-250=250)
      const result = calculateStyles(300, transitions);
      expect(result).toHaveLength(1);
    });
  });

  describe("frame correction", () => {
    it("should use first frame when current frame is before first", () => {
      const transitions = new Map([
        [
          "element1",
          {
            200: { opacity: 0 },
            300: { opacity: 1 },
          },
        ],
      ]);

      const result = calculateStyles(100, transitions);

      // Should still generate output using corrected frame
      expect(result).toHaveLength(1);
    });

    it("should use last frame when current frame is after last", () => {
      const transitions = new Map([
        [
          "element1",
          {
            200: { opacity: 0 },
            300: { opacity: 1 },
          },
        ],
      ]);

      const result = calculateStyles(400, transitions);

      // Should still generate output using corrected frame
      expect(result).toHaveLength(1);
    });
  });

  describe("interpolation progress calculation", () => {
    it("should calculate correct progress at start of transition", () => {
      const transitions = new Map([
        [
          "element1",
          {
            100: { opacity: 0 },
            200: { opacity: 1 },
          },
        ],
      ]);

      const result = calculateStyles(100, transitions);

      expect(result[0].style).toContain("opacity: 0");
    });

    it("should calculate correct progress at end of transition", () => {
      const transitions = new Map([
        [
          "element1",
          {
            100: { opacity: 0 },
            200: { opacity: 1 },
          },
        ],
      ]);

      const result = calculateStyles(200, transitions);

      expect(result[0].style).toContain("opacity: 1");
    });

    it("should calculate correct progress at midpoint", () => {
      const transitions = new Map([
        [
          "element1",
          {
            100: { opacity: 0 },
            200: { opacity: 1 },
          },
        ],
      ]);

      const result = calculateStyles(150, transitions);

      expect(result[0].style).toContain("opacity: 0.5");
    });
  });

  describe("opacity and display handling", () => {
    it("should set display none when opacity is 0", () => {
      const transitions = new Map([
        [
          "element1",
          {
            100: { opacity: 0 },
            200: { opacity: 1 },
          },
        ],
      ]);

      const result = calculateStyles(100, transitions);

      expect(result[0].style).toContain("display: none");
    });

    it("should not set display none when opacity is greater than 0", () => {
      const transitions = new Map([
        [
          "element1",
          {
            100: { opacity: 0 },
            200: { opacity: 1 },
          },
        ],
      ]);

      const result = calculateStyles(150, transitions);

      expect(result[0].style).not.toContain("display: none");
    });
  });

  describe("CSS output formatting", () => {
    it("should remove newlines and carriage returns from CSS", () => {
      // Mock styleToCss to return CSS with newlines for this specific test
      const styleToCss = jest.requireMock("style-object-to-css-string");
      const originalImpl = styleToCss.getMockImplementation();
      styleToCss.mockReturnValue(
        "opacity: 0.5;\ncolor: red;\r\nbackground: blue"
      );

      const transitions = new Map([
        [
          "element1",
          {
            100: { opacity: 0 },
            200: { opacity: 1 },
          },
        ],
      ]);

      const result = calculateStyles(150, transitions);

      expect(result[0].style).not.toContain("\n");
      expect(result[0].style).not.toContain("\r");

      // Restore original mock
      styleToCss.mockImplementation(originalImpl);
    });

    it("should generate correct selector format", () => {
      const transitions = new Map([
        [
          "myElement",
          {
            100: { opacity: 0 },
            200: { opacity: 1 },
          },
        ],
      ]);

      const result = calculateStyles(150, transitions);

      expect(result[0].selector).toBe("#myElement");
    });
  });

  describe("complex transitions", () => {
    it("should handle multiple keyframes", () => {
      const transitions = new Map([
        [
          "element1",
          {
            100: { opacity: 0, x: 0 },
            200: { opacity: 0.5, x: 50 },
            300: { opacity: 1, x: 100 },
          },
        ],
      ]);

      // Test first transition (100-200) - at 150, we're 50% through
      const result1 = calculateStyles(150, transitions);
      expect(result1).toHaveLength(1);
      // At frame 150 between frames 100-200, interpolating between opacity 0 and 0.5
      // Progress = (150-100)/(200-100) = 0.5, so opacity = 0 + (0.5-0)*0.5 = 0.25
      expect(result1[0].style).toContain("opacity: 0.25");
      expect(result1[0].style).toContain("x: 25");

      // Test second transition (200-300) - at 250, we're 50% through
      const result2 = calculateStyles(250, transitions);
      expect(result2).toHaveLength(1);
      expect(result2[0].style).toContain("opacity: 0.75");
      expect(result2[0].style).toContain("x: 75");
    });

    it("should handle unordered keyframes", () => {
      const transitions = new Map([
        [
          "element1",
          {
            300: { opacity: 1 },
            100: { opacity: 0 },
            200: { opacity: 0.5 },
          },
        ],
      ]);

      const result = calculateStyles(150, transitions);

      expect(result).toHaveLength(1);
      // Should still interpolate correctly despite unordered input - 50% between 0 and 0.5 = 0.25
      expect(result[0].style).toContain("opacity: 0.25");
    });
  });

  describe("edge cases", () => {
    it("should handle transitions with single keyframe", () => {
      const transitions = new Map([
        [
          "element1",
          {
            100: { opacity: 0.5 },
          },
        ],
      ]);

      const result = calculateStyles(100, transitions);

      // Should not generate output for single keyframe (no next keyframe to interpolate to)
      expect(result).toEqual([]);
    });

    it("should handle empty transition object", () => {
      const transitions = new Map([["element1", {}]]);

      const result = calculateStyles(100, transitions);
      expect(result).toEqual([]);
    });

    it("should handle non-numeric property values", () => {
      const transitions = new Map([
        [
          "element1",
          {
            100: { color: "red", opacity: 0 },
            200: { color: "blue", opacity: 1 },
          },
        ],
      ]);

      const result = calculateStyles(150, transitions);

      expect(result).toHaveLength(1);
      // Should handle both numeric and non-numeric properties
      expect(result[0].style).toContain("opacity: 0.5");
    });
  });
});
