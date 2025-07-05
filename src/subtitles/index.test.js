/* eslint-env jest */
import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Subtitles from "./index";

// Mock the subtitles data
jest.mock("./subtitles.json", () => [
  {
    start: 400,
    end: 700,
    text: "My name is Albino Tonnina",
    position: {
      portrait: "bottom",
      landscape: "top",
    },
  },
  {
    start: 700,
    end: 900,
    text: "I'm a self-taught web engineer",
    position: {
      portrait: "top",
      landscape: "bottom",
    },
  },
  {
    start: 1000,
    end: 1200,
    text: "I've been a freelancer",
    position: null,
  },
]);

// Mock the scene transitions
jest.mock("../scene/transitions", () => ({
  duration: 1000,
}));

// Mock CSS import
jest.mock("./style.css", () => ({}));

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock DOM methods
const mockQuerySelectorAll = jest.fn();
document.querySelectorAll = mockQuerySelectorAll;

describe("Subtitles Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuerySelectorAll.mockReturnValue([
      { dataset: { scenePlaceholder: true } },
      { dataset: { scenePlaceholder: true } },
    ]);

    // Mock window dimensions
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });

    // Mock window.pageYOffset
    Object.defineProperty(window, "pageYOffset", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it("renders without crashing", () => {
    render(<Subtitles />);
    expect(document.getElementById("subContainer")).toBeInTheDocument();
  });

  it("sets up IntersectionObserver correctly", () => {
    render(<Subtitles />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: expect.any(Array),
      })
    );
  });

  it("observes scene placeholder elements", () => {
    const mockObserve = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    });

    render(<Subtitles />);

    expect(mockQuerySelectorAll).toHaveBeenCalledWith(
      "[data-scene-placeholder]"
    );
    expect(mockObserve).toHaveBeenCalledTimes(2);
  });

  it("displays subtitle when within range", () => {
    // Set pageYOffset to be within first subtitle range
    Object.defineProperty(window, "pageYOffset", {
      value: 500,
    });

    const { rerender } = render(<Subtitles />);

    // Trigger the intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback();
    });

    rerender(<Subtitles />);

    expect(screen.getByText("My name is Albino Tonnina")).toBeInTheDocument();
  });

  it("hides subtitle when outside range", () => {
    // Set pageYOffset to be outside any subtitle range
    Object.defineProperty(window, "pageYOffset", {
      value: 100,
    });

    const { rerender } = render(<Subtitles />);

    // Trigger the intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback();
    });

    rerender(<Subtitles />);

    expect(
      screen.queryByText("My name is Albino Tonnina")
    ).not.toBeInTheDocument();
  });

  it("applies correct position class for portrait bottom", () => {
    // Mock portrait orientation
    Object.defineProperty(window, "innerHeight", {
      value: 1200,
    });
    Object.defineProperty(window, "innerWidth", {
      value: 800,
    });

    // Set pageYOffset to be within first subtitle range (portrait: bottom)
    Object.defineProperty(window, "pageYOffset", {
      value: 500,
    });

    const { rerender } = render(<Subtitles />);

    // Trigger the intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback();
    });

    rerender(<Subtitles />);

    const container = document.getElementById("subContainer");
    expect(container).toHaveClass("bottom-position");
  });

  it("applies correct position class for landscape top", () => {
    // Mock landscape orientation
    Object.defineProperty(window, "innerHeight", {
      value: 800,
    });
    Object.defineProperty(window, "innerWidth", {
      value: 1200,
    });

    // Set pageYOffset to be within first subtitle range (landscape: top)
    Object.defineProperty(window, "pageYOffset", {
      value: 500,
    });

    const { rerender } = render(<Subtitles />);

    // Trigger the intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback();
    });

    rerender(<Subtitles />);

    const container = document.getElementById("subContainer");
    expect(container).toHaveClass("top-position");
  });

  it("applies no position class when position is null", () => {
    // Set pageYOffset to be within third subtitle range (position: null)
    Object.defineProperty(window, "pageYOffset", {
      value: 1100,
    });

    const { rerender } = render(<Subtitles />);

    // Trigger the intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback();
    });

    rerender(<Subtitles />);

    const container = document.getElementById("subContainer");
    expect(container).not.toHaveClass("bottom-position");
    expect(container).not.toHaveClass("top-position");
  });

  it("disconnects observer on unmount", () => {
    const mockDisconnect = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: mockDisconnect,
    });

    const { unmount } = render(<Subtitles />);
    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("updates subtitle when pageYOffset changes", () => {
    const { rerender } = render(<Subtitles />);

    // First subtitle
    Object.defineProperty(window, "pageYOffset", {
      value: 500,
    });

    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback();
    });

    rerender(<Subtitles />);
    expect(screen.getByText("My name is Albino Tonnina")).toBeInTheDocument();

    // Second subtitle
    Object.defineProperty(window, "pageYOffset", {
      value: 800,
    });

    act(() => {
      observerCallback();
    });

    rerender(<Subtitles />);
    expect(
      screen.getByText("I'm a self-taught web engineer")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("My name is Albino Tonnina")
    ).not.toBeInTheDocument();
  });
});

describe("Utility Functions", () => {
  describe("createThreshold", () => {
    it("creates correct threshold array for given height", () => {
      const height = 10;
      const count = Math.ceil(height / 1);
      const ratio = 1 / count;
      const expectedThreshold = [];

      for (let i = 0; i < count; i += 1) {
        expectedThreshold.push(i * ratio);
      }

      // Since createThreshold is not exported, we test it indirectly
      // by checking that IntersectionObserver is called with correct threshold
      render(<Subtitles />);

      const observerOptions = mockIntersectionObserver.mock.calls[0][1];
      expect(observerOptions.threshold).toHaveLength(1800); // 1000 + 800 (window.innerHeight)
    });
  });

  describe("getSubtitle", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockQuerySelectorAll.mockReturnValue([
        { dataset: { scenePlaceholder: true } },
        { dataset: { scenePlaceholder: true } },
      ]);
    });

    it("finds subtitle within range", () => {
      Object.defineProperty(window, "pageYOffset", {
        value: 500,
      });

      const { rerender } = render(<Subtitles />);

      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      act(() => {
        observerCallback();
      });

      rerender(<Subtitles />);

      expect(screen.getByText("My name is Albino Tonnina")).toBeInTheDocument();
    });

    it("returns empty subtitle when no match", () => {
      Object.defineProperty(window, "pageYOffset", {
        value: 100,
      });

      const { rerender } = render(<Subtitles />);

      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      act(() => {
        observerCallback();
      });

      rerender(<Subtitles />);

      expect(
        screen.queryByText("My name is Albino Tonnina")
      ).not.toBeInTheDocument();
    });
  });
});
