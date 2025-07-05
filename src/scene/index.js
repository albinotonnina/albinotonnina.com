import React, { useEffect } from "react";
import Svg from "./scene.svg";

import sceneTransitions1 from "./transitions";
import "../images/albinotonnina.com.mp4";
import { getTransitionElements } from "./transition-utilities";
import onTick from "./tickFunction";

const getTicker = (observer) => {
  document
    .querySelectorAll("[data-scene-placeholder]")
    .forEach((placeholder) => {
      observer.observe(placeholder);
    });
};

const createThreshold = (height) => {
  const count = Math.ceil(height / 1);
  const thresholds = [];
  const ratio = 1 / count;
  for (let i = 0; i < count; i += 1) {
    thresholds.push(i * ratio);
  }
  return thresholds;
};

// Font family to weight mapping
const FONT_WEIGHT_MAP = {
  "Roboto-Thin": "100",
  "Roboto-Light": "300",
  "Roboto-Regular": "400",
  "Roboto-Black": "900",
};

// Button configurations
const BUTTON_CONFIGS = {
  contactsbutton: {
    url: "https://www.linkedin.com/in/albinotonnina/",
    type: "link",
  },
  githubbutton: {
    url: "https://github.com/albinotonnina/albinotonnina.com/",
    type: "link",
  },
  emailbutton: {
    type: "email",
    user: "albinotonnina+website",
    domain: "gmail.com",
  },
};

// eslint-disable-next-line react/prop-types
export default function Scene({ width = 0, height = 0, isPortrait = false }) {
  // Font replacement effect
  useEffect(() => {
    const replaceFonts = () => {
      const textElements = document.querySelectorAll("text, tspan");
      textElements.forEach((element) => {
        const fontFamily = element.getAttribute("font-family");
        if (fontFamily) {
          // Use the font weight mapping
          const fontEntries = Object.keys(FONT_WEIGHT_MAP);
          const matchedFont = fontEntries.find((font) =>
            fontFamily.includes(font)
          );
          if (matchedFont) {
            element.setAttribute("font-weight", FONT_WEIGHT_MAP[matchedFont]);
            element.removeAttribute("font-family");
          }
        }
      });
    };

    // Run font replacement after component mounts
    const timeoutId = setTimeout(replaceFonts, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // Intersection observer effect
  useEffect(() => {
    const transitionsData = sceneTransitions1.transitions(isPortrait);
    const transitionElements = getTransitionElements(transitionsData);

    const observer = new IntersectionObserver(
      onTick.bind(null, transitionsData, transitionElements),
      {
        threshold: createThreshold(
          sceneTransitions1.duration + window.innerHeight
        ),
      }
    );

    getTicker(observer);

    return () => {
      observer.disconnect();
    };
  }, [isPortrait]);

  // Button event handlers effect
  useEffect(() => {
    const eventHandlers = [];

    // Setup button event listeners
    const buttonKeys = Object.keys(BUTTON_CONFIGS);
    buttonKeys.forEach((buttonId) => {
      const config = BUTTON_CONFIGS[buttonId];
      const button = document.querySelector(`#${buttonId}`);
      if (button) {
        const handleClick = () => {
          if (config.type === "email") {
            const email = `${config.user}@${config.domain}`;
            window.open(`mailto:${email}`);
          } else {
            window.open(config.url);
          }
        };

        button.addEventListener("click", handleClick);
        eventHandlers.push({ button, handleClick });
      }
    });

    // Cleanup function
    return () => {
      eventHandlers.forEach(({ button, handleClick }) => {
        button.removeEventListener("click", handleClick);
      });
    };
  }, []);

  return <Svg width={width} height={height} />;
}
