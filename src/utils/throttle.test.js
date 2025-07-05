/* eslint-env jest */

// Extract and test the throttle function
const throttle = (func, wait, immediate) => {
  let timeout;
  return (...args) => {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

describe("throttle utility function", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should throttle function calls", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    // Call the throttled function multiple times
    throttledFn();
    throttledFn();
    throttledFn();

    // Function should be called only once initially
    expect(mockFn).toHaveBeenCalledTimes(0);

    // Fast forward time
    jest.advanceTimersByTime(100);

    // Function should be called once after the wait period
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should call function immediately when immediate flag is true", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100, true);

    throttledFn();

    // Function should be called immediately
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should pass arguments to the throttled function", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn("arg1", "arg2");

    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("should handle multiple calls with different arguments", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn("first");
    throttledFn("second");
    throttledFn("third");

    jest.advanceTimersByTime(100);

    // The function should be called once with the arguments from the first call
    // This is because only the first call (when !timeout is true) sets up the setTimeout,
    // and the later() function uses the args from that first call's closure
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("first");
  });

  it("should allow function to be called again after wait period", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    jest.advanceTimersByTime(100);

    throttledFn();
    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should handle immediate mode with subsequent calls", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100, true);

    throttledFn();
    throttledFn();
    throttledFn();

    // Should be called immediately only once
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);

    // No additional calls should be made
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
