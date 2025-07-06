import { useState, useEffect } from "react";
import sceneTransitions1 from "./animation/transitions";
import Scene from "./animation";
import Subtitles from "./subtitles";
import "./styles/main.css";

function throttle(func, wait, immediate) {
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
}

const getDimentions = () => ({
  height: window.innerHeight,
  width: window.innerWidth,
  isPortrait: window.innerHeight > window.innerWidth,
});

// Fast scroll configuration
const FAST_SCROLL_CONFIG = {
  threshold: 100, // pixels per frame to trigger fast scroll handling
  useRAF: true, // use requestAnimationFrame for smooth handling
};

export default function App() {
  const [dimensions, setDimensions] = useState(getDimentions);

  const screens = Math.round(sceneTransitions1.duration / dimensions.height);
  const arrayScreens = Array.from(Array(screens).keys());

  // Scroll to top on mount to ensure animations start from the correct position
  useEffect(() => {
    // Disable scroll restoration to prevent browser from restoring scroll position
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Force scroll to top immediately on mount
    window.scrollTo(0, 0);

    // Also scroll to top after a brief delay to ensure it takes effect
    const scrollTimeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => {
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    const debouncedHandleResize = throttle(
      setDimensions.bind(null, getDimentions),
      100,
      true
    );
    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  // Enhanced scroll monitoring to handle fast scrolling
  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const handleFastScroll = () => {
      const currentScrollY = window.pageYOffset;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);

      // If scrolling too fast (more than 100px per frame), trigger additional updates
      if (scrollDelta > FAST_SCROLL_CONFIG.threshold) {
        // Dispatch a custom event to notify the animation system
        window.dispatchEvent(
          new CustomEvent("fastScroll", {
            detail: { scrollY: currentScrollY, delta: scrollDelta },
          })
        );
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        if (FAST_SCROLL_CONFIG.useRAF) {
          requestAnimationFrame(handleFastScroll);
        } else {
          handleFastScroll();
        }
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Development helper for testing fast scroll solution
  if (process.env.NODE_ENV === "development") {
    let fastScrollCount = 0;
    let totalScrollEvents = 0;

    const logFastScroll = () => {
      fastScrollCount++;
      // eslint-disable-next-line no-console
      console.log(`🚀 Fast scroll detected! Count: ${fastScrollCount}`);
    };

    const logScroll = () => {
      totalScrollEvents++;
    };

    window.addEventListener("fastScroll", logFastScroll);
    window.addEventListener("scroll", logScroll);

    // Expose stats for debugging
    window.fastScrollStats = {
      getFastScrollCount: () => fastScrollCount,
      getTotalScrollCount: () => totalScrollEvents,
      getConfig: () => FAST_SCROLL_CONFIG,
      reset: () => {
        fastScrollCount = 0;
        totalScrollEvents = 0;
      },
    };
  }

  return (
    <>
      {arrayScreens.map((el) => (
        <div
          key={el}
          data-scene-placeholder
          style={{ height: dimensions.height }}
        ></div>
      ))}

      <Scene
        width={dimensions.width}
        height={dimensions.height}
        isPortrait={dimensions.isPortrait}
      />
      <Subtitles />
    </>
  );
}
