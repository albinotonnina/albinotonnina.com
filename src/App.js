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
