import React from "react";
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
  const count = window.Math.ceil(height / 1);
  const t = [];
  const ratio = 1 / count;
  for (let i = 0; i < count; i += 1) {
    t.push(i * ratio);
  }
  return t;
};

export default function scene(props) {
  React.useEffect(() => {
    const transitionsData = sceneTransitions1.transitions(props.isPortrait);
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
  });

  React.useEffect(() => {
    document.querySelector("#contactsbutton").addEventListener("click", () => {
      window.open("https://www.linkedin.com/in/albinotonnina/");
    });
  });
  React.useEffect(() => {
    document.querySelector("#githubbutton").addEventListener("click", () => {
      window.open("https://github.com/albinotonnina/albinotonnina.com/");
    });
  });

  return <Svg width={props.width} height={props.height} />;
}
