import { debounce } from "throttle-debounce";
import * as utils from "./utilities";
import initScrollyTelly from "./initScrollyTelly";
import initScenes from "./initScenes";
import getScenes from "./getScenes";
import resizeScenes from "./resizeScenes";
import resizePlaceholders from "./resizePlaceholders";
import getTicker from "./getTicker";

import timing from "./timing";
import "../styles/main.scss";
import "../scenes/animation.scss";

const hideLoader = () => {
  document.querySelector("#loader").setAttribute("uiState", "hidden");
};

export default class {
  constructor() {
    this.scenes = getScenes();
    this.sceneTimings = timing.scenes;
    this.maxScroll = timing.maxScroll;
    this.siteRoot = utils.createElementWithAttrs("figure", { role: "site" });
    this.initEvents();
    initScenes(this);
    hideLoader();
  }

  initEvents() {
    window.onresize = debounce(100, false, this.start.bind(this));
    utils.onBeforePrint(this.destroy.bind(this));

    document.querySelector("#reopen").addEventListener("click", (ev) => {
      ev.preventDefault();
      this.show();
    });
  }

  start() {
    if (utils.shouldFallbackToBoringCV()) {
      this.destroy();
    } else {
      resizeScenes();
      this.scrollyTelly = initScrollyTelly();

      resizePlaceholders({
        maxScroll: this.maxScroll,
        siteRoot: this.siteRoot,
      });

      getTicker(() => this.scrollyTelly.render());
      this.show();
    }
  }

  show() {
    document.body.setAttribute("data-display", "divertissement");
    document.querySelector("#vignette").setAttribute("uiState", "show");
    this.siteRoot.setAttribute("uiState", "show");
  }

  destroy() {
    document.body.removeAttribute("style");
    document.body.removeAttribute("data-display");
    document.querySelector("#vignette").setAttribute("uiState", "hidden");
    this.siteRoot.setAttribute("uiState", "hidden");

    this.scrollyTelly.destroy();
    window.scroll(0, 0);
  }
}
