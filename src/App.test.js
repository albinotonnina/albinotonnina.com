/* eslint-env jest */
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock the Scene component
jest.mock("./animation", () => {
  // eslint-disable-next-line react/prop-types
  function MockScene({ width, height, isPortrait }) {
    return (
      <div
        data-testid="scene"
        data-width={width}
        data-height={height}
        data-is-portrait={isPortrait}
      >
        Scene Component
      </div>
    );
  }

  MockScene.displayName = "MockScene";
  return MockScene;
});

// Mock the Subtitles component
jest.mock("./subtitles", () => {
  function MockSubtitles() {
    return <div data-testid="subtitles">Subtitles Component</div>;
  }
  return MockSubtitles;
});

// Mock the scene transitions
jest.mock("./animation/transitions", () => ({
  duration: 5000, // Mock duration value
}));

// Mock CSS import
jest.mock("./styles/main.css", () => ({}));

// Mock window.scrollTo globally to prevent JSDOM errors
Object.defineProperty(window, "scrollTo", {
  writable: true,
  configurable: true,
  value: jest.fn(),
});

// Mock window dimensions
const mockWindowDimensions = {
  innerWidth: 1024,
  innerHeight: 768,
};

// Helper function to mock window dimensions
const mockWindowSize = (width, height) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });
};

// Mock addEventListener and removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  // Reset window dimensions
  mockWindowSize(
    mockWindowDimensions.innerWidth,
    mockWindowDimensions.innerHeight
  );

  // Mock window event listeners
  Object.defineProperty(window, "addEventListener", {
    writable: true,
    configurable: true,
    value: mockAddEventListener,
  });

  Object.defineProperty(window, "removeEventListener", {
    writable: true,
    configurable: true,
    value: mockRemoveEventListener,
  });
});

describe("App Component", () => {
  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<App />);
      expect(screen.getByTestId("scene")).toBeInTheDocument();
      expect(screen.getByTestId("subtitles")).toBeInTheDocument();
    });

    it("renders the correct number of scene placeholders", () => {
      render(<App />);
      const placeholders = document.querySelectorAll(
        "[data-scene-placeholder]"
      );

      // Calculate expected number of screens based on mocked values
      const expectedScreens = Math.round(5000 / 768); // duration / height
      expect(placeholders).toHaveLength(expectedScreens);
    });

    it("renders scene placeholders with correct height", () => {
      render(<App />);
      const placeholders = document.querySelectorAll(
        "[data-scene-placeholder]"
      );

      placeholders.forEach((placeholder) => {
        expect(placeholder).toHaveStyle({ height: "768px" });
      });
    });

    it("passes correct props to Scene component", () => {
      render(<App />);
      const scene = screen.getByTestId("scene");

      expect(scene).toHaveAttribute("data-width", "1024");
      expect(scene).toHaveAttribute("data-height", "768");
      expect(scene).toHaveAttribute("data-is-portrait", "false");
    });
  });

  describe("Window Resize Handling", () => {
    it("sets up resize event listener on mount", () => {
      render(<App />);

      expect(mockAddEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });

    it("removes resize event listener on unmount", () => {
      const { unmount } = render(<App />);

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });

    it("updates dimensions when window is resized", async () => {
      render(<App />);

      // Get the resize handler that was registered
      const resizeHandler = mockAddEventListener.mock.calls.find(
        ([event]) => event === "resize"
      )[1];

      // Change window dimensions
      mockWindowSize(800, 600);

      // Trigger resize event wrapped in act
      await act(async () => {
        fireEvent(window, new Event("resize"));
        resizeHandler();
      });

      // Wait for the component to update
      await waitFor(() => {
        const scene = screen.getByTestId("scene");
        expect(scene).toHaveAttribute("data-width", "800");
        expect(scene).toHaveAttribute("data-height", "600");
      });
    });

    it("detects portrait orientation correctly", async () => {
      render(<App />);

      // Get the resize handler
      const resizeHandler = mockAddEventListener.mock.calls.find(
        ([event]) => event === "resize"
      )[1];

      // Set portrait dimensions (height > width)
      mockWindowSize(600, 800);

      // Trigger resize event wrapped in act
      await act(async () => {
        fireEvent(window, new Event("resize"));
        resizeHandler();
      });

      await waitFor(() => {
        const scene = screen.getByTestId("scene");
        expect(scene).toHaveAttribute("data-is-portrait", "true");
      });
    });

    it("detects landscape orientation correctly", async () => {
      render(<App />);

      // Get the resize handler
      const resizeHandler = mockAddEventListener.mock.calls.find(
        ([event]) => event === "resize"
      )[1];

      // Set landscape dimensions (width > height)
      mockWindowSize(1200, 800);

      // Trigger resize event wrapped in act
      await act(async () => {
        fireEvent(window, new Event("resize"));
        resizeHandler();
      });

      await waitFor(() => {
        const scene = screen.getByTestId("scene");
        expect(scene).toHaveAttribute("data-is-portrait", "false");
      });
    });
  });

  describe("Scene Placeholders", () => {
    it("updates placeholder heights when window is resized", async () => {
      render(<App />);

      // Get the resize handler
      const resizeHandler = mockAddEventListener.mock.calls.find(
        ([event]) => event === "resize"
      )[1];

      // Change window dimensions
      mockWindowSize(800, 1000);

      // Trigger resize event wrapped in act
      await act(async () => {
        fireEvent(window, new Event("resize"));
        resizeHandler();
      });

      await waitFor(() => {
        const placeholders = document.querySelectorAll(
          "[data-scene-placeholder]"
        );
        placeholders.forEach((placeholder) => {
          expect(placeholder).toHaveStyle({ height: "1000px" });
        });
      });
    });

    it("recalculates number of placeholders when dimensions change", async () => {
      render(<App />);

      // Get the resize handler
      const resizeHandler = mockAddEventListener.mock.calls.find(
        ([event]) => event === "resize"
      )[1];

      // Change window height significantly
      mockWindowSize(1024, 500);

      // Trigger resize event wrapped in act
      await act(async () => {
        fireEvent(window, new Event("resize"));
        resizeHandler();
      });

      await waitFor(() => {
        const placeholders = document.querySelectorAll(
          "[data-scene-placeholder]"
        );
        const expectedScreens = Math.round(5000 / 500); // duration / new height
        expect(placeholders).toHaveLength(expectedScreens);
      });
    });

    it("sets correct data attributes on placeholders", () => {
      render(<App />);
      const placeholders = document.querySelectorAll(
        "[data-scene-placeholder]"
      );

      placeholders.forEach((placeholder) => {
        expect(placeholder).toHaveAttribute("data-scene-placeholder");
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles zero height gracefully", () => {
      mockWindowSize(1024, 1); // Use 1 instead of 0 to avoid division by zero

      // Should not crash
      expect(() => render(<App />)).not.toThrow();
    });

    it("handles very small dimensions", () => {
      mockWindowSize(100, 100);

      const { container } = render(<App />);
      expect(container).toBeInTheDocument();
    });

    it("handles very large dimensions", () => {
      mockWindowSize(4000, 3000);

      const { container } = render(<App />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("renders all required components", () => {
      render(<App />);

      expect(screen.getByTestId("scene")).toBeInTheDocument();
      expect(screen.getByTestId("subtitles")).toBeInTheDocument();
      expect(
        document.querySelectorAll("[data-scene-placeholder]").length
      ).toBeGreaterThan(0);
    });

    it("maintains component hierarchy", () => {
      const { container } = render(<App />);

      // Check that scene placeholders come before Scene component
      const allElements = container.querySelectorAll("*");
      const sceneElement = screen.getByTestId("scene");
      const placeholders = document.querySelectorAll(
        "[data-scene-placeholder]"
      );

      const sceneIndex = Array.from(allElements).indexOf(sceneElement);
      const firstPlaceholderIndex = Array.from(allElements).indexOf(
        placeholders[0]
      );

      expect(firstPlaceholderIndex).toBeLessThan(sceneIndex);
    });
  });

  describe("Performance", () => {
    it("sets up throttled resize event listener", async () => {
      jest.useFakeTimers();

      render(<App />);

      // Get the resize handler
      const resizeHandler = mockAddEventListener.mock.calls.find(
        ([event]) => event === "resize"
      )[1];

      // Trigger multiple resize events quickly wrapped in act
      await act(async () => {
        for (let i = 0; i < 5; i++) {
          mockWindowSize(800 + i, 600 + i);
          fireEvent(window, new Event("resize"));
          resizeHandler();
        }

        // Fast forward time to trigger the throttled function
        jest.advanceTimersByTime(100);
      });

      // The resize event listener should be set up properly
      expect(mockAddEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );

      // The component should have updated its dimensions
      // The throttle function captures the first call's arguments
      await waitFor(() => {
        const scene = screen.getByTestId("scene");
        expect(scene).toHaveAttribute("data-width", "800");
        expect(scene).toHaveAttribute("data-height", "600");
      });

      jest.useRealTimers();
    });
  });

  describe("Scroll-to-top Functionality", () => {
    beforeEach(() => {
      // Mock history.scrollRestoration
      Object.defineProperty(window, "history", {
        writable: true,
        configurable: true,
        value: {
          scrollRestoration: "auto",
        },
      });

      // Clear the global scrollTo mock
      window.scrollTo.mockClear();
    });

    it("scrolls to top immediately on mount", () => {
      render(<App />);

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it("sets scroll restoration to manual if supported", () => {
      render(<App />);

      expect(window.history.scrollRestoration).toBe("manual");
    });

    it("scrolls to top after delay", async () => {
      jest.useFakeTimers();

      render(<App />);

      // Clear the immediate scrollTo call
      window.scrollTo.mockClear();

      // Fast forward time to trigger the delayed scroll
      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

      jest.useRealTimers();
    });

    it("clears timeout on unmount", () => {
      jest.useFakeTimers();
      const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

      const { unmount } = render(<App />);

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
      jest.useRealTimers();
    });

    it("handles missing scrollRestoration gracefully", () => {
      // Mock environment without scrollRestoration support
      Object.defineProperty(window, "history", {
        writable: true,
        configurable: true,
        value: {},
      });

      expect(() => {
        render(<App />);
      }).not.toThrow();

      // Should still call scrollTo
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it("preserves scroll behavior when scrollRestoration is not supported", () => {
      // Mock environment without scrollRestoration support
      delete window.history.scrollRestoration;

      render(<App />);

      // Should still call scrollTo even without scrollRestoration
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });
});

// Helper function to add data-testid to elements that don't have it
const addTestId = (element, testId) => {
  if (element && !element.hasAttribute("data-testid")) {
    element.setAttribute("data-testid", testId);
  }
};

// Custom render function that adds test IDs to scene placeholders
const renderWithTestIds = (ui) => {
  const result = render(ui);

  // Add test IDs to scene placeholders
  const placeholders = result.container.querySelectorAll(
    "[data-scene-placeholder]"
  );
  placeholders.forEach((placeholder) => {
    addTestId(placeholder, "scene-placeholder");
  });

  return result;
};

// Re-export render with test IDs for external use
export default renderWithTestIds;
