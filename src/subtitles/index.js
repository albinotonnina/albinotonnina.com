import React from "react";
import subtitlesData from "./subtitles.json";
import sceneTransitions1 from "../scene/transitions";

import "./style.css";

const getSubtitle = () =>
  subtitlesData.find(
    ({ start, end }) => start <= window.pageYOffset && end >= window.pageYOffset
  ) || {
    text: "",
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
  const [currentSubtitle, setCurrentSubtitle] = React.useState(null);

  const onTick = () => {
    const { text } = getSubtitle();
    if (currentSubtitle !== text) {
      setCurrentSubtitle(text);
    }
  };

  const observer = new IntersectionObserver(onTick, {
    threshold: createThreshold(sceneTransitions1.duration + window.innerHeight),
  });

  React.useEffect(() => {
    getTicker(observer);

    return () => {
      observer.disconnect();
    };
  });

  return (
    <div id="subContainer">
      {currentSubtitle && <div id="subtitles">{currentSubtitle}</div>}
    </div>
  );
}
