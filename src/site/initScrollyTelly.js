import ScrollyTelly from "../scrollytelly";
import getScenes from "./getScenes";

const initScrollyTelly = () =>
  new ScrollyTelly({
    render: (data) => {
      Object.values(getScenes()).forEach((scene) => {
        if (typeof scene.render === "function") {
          scene.render(data);
        }
      });
    },
    beforerender: (data) => {
      Object.values(getScenes()).forEach((scene) => {
        if (typeof scene.beforerender === "function") {
          scene.beforerender(data);
        }
      });
    },
  });

export default initScrollyTelly;
