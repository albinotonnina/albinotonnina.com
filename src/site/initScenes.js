import * as utils from "./utilities";
import timing from "./timing";
import menu from "../scenes/menu/animation";
import getScenes from "./getScenes";

const initSceneJs = (instance) => {
  Object.values(getScenes()).forEach((scene) => {
    scene.init(instance);
  });

  menu.init(instance);
};

const buildDOMElements = ({ siteRoot }) => {
  const nav = utils.createElementWithAttrs("nav", { id: "menu" });
  siteRoot.appendChild(nav);

  Object.keys(timing.scenes).forEach((key) => {
    siteRoot.appendChild(
      utils.createElementWithAttrs("div", {
        "data-scene": key,
        id: key,
      })
    );
  });

  document.body.appendChild(siteRoot);
};

export default (siteRoot) => {
  buildDOMElements(siteRoot);
  initSceneJs(siteRoot);
};
