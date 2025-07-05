import { useState, useEffect } from "react";
import subtitlesData from "./subtitles.json";
import sceneTransitions1 from "../scene/transitions";

import "./style.css";

const getSubtitle = () =>
  subtitlesData.find(
    ({ start, end }) => start <= window.pageYOffset && end >= window.pageYOffset
  ) || {
    text: "",
    position: null,
  };

const createThreshold = (height) => {
  const count = window.Math.ceil(height / 1);
  const t = [];
  const ratio = 1 / count;
  for (let i = 0; i < count; i += 1) {
    t.push(i * ratio);
  }
  return t;
};

const getTicker = (observer) => {
  document
    .querySelectorAll("[data-scene-placeholder]")
    .forEach((placeholder) => {
      observer.observe(placeholder);
    });
};

export default function Subtitles() {
  const [currentSubtitle, setCurrentSubtitle] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  const onTick = () => {
    const subtitle = getSubtitle();
    if (currentSubtitle !== subtitle.text) {
      setCurrentSubtitle(subtitle.text);
      setCurrentPosition(subtitle.position);
    }
  };

  const observer = new IntersectionObserver(onTick, {
    threshold: createThreshold(sceneTransitions1.duration + window.innerHeight),
  });

  useEffect(() => {
    getTicker(observer);

    return () => {
      observer.disconnect();
    };
  });

  // Determine container class based on current subtitle's position settings
  const getContainerClass = () => {
    if (!currentPosition) {
      return ""; // Use default responsive behavior
    }

    const isPortrait = window.innerHeight > window.innerWidth;
    const orientation = isPortrait ? "portrait" : "landscape";
    const positionSetting = currentPosition[orientation];

    switch (positionSetting) {
      case "bottom":
        return "bottom-position";
      case "top":
        return "top-position";
      default:
        return ""; // Use default responsive behavior
    }
  };

  return (
    <div id="subContainer" className={getContainerClass()}>
      {currentSubtitle && <div id="subtitles">{currentSubtitle}</div>}
    </div>
  );
}
