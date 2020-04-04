import * as utils from "./utilities";

const resizeScenes = () => {
  const { innerWidth } = window;
  const clientHeight = window.innerHeight;

  document.querySelectorAll("[data-scene] svg").forEach((scene) => {
    utils.setAttributes(scene, {
      width: innerWidth,
      height: clientHeight,
    });
  });

  utils.setAttributes(document.querySelector("#menu svg"), {
    width: innerWidth,
    height: (clientHeight * 60) / 768,
  });

  document.querySelector("#menu").style.width = `${innerWidth}px`;
  document.querySelector("#menu").style.height = `${
    (clientHeight * 60) / 768
  }px`;
};

export default resizeScenes;
