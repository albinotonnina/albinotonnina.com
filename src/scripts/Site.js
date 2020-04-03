import { debounce } from "throttle-debounce";
import * as utils from "./utilities";
import menu from "../svg/menu/animation";
import scene1 from "../svg/scene1/animation";
import scene2 from "../svg/scene2/animation";
import scene3 from "../svg/scene3/animation";
import scene4 from "../svg/scene4/animation";
import scene5 from "../svg/scene5/animation";
import scene6 from "../svg/scene6/animation";
import getScrollyTelly from "../libs";
import timing from "./timing";
import "../styles/main.scss";
import "../svg/animation.scss";

const scrollyTelly = getScrollyTelly();

const resizeScenes = () => {
  const { innerWidth } = window;
  const clientHeight = window.innerHeight;

  [].forEach.call(document.querySelectorAll("[data-scene] svg"), (scene) => {
    utils.setAttributes(scene, {
      width: innerWidth,
      height: clientHeight,
    });
  });

  [].forEach.call(
    document.querySelectorAll("[data-scene-placeholder]"),
    (placeholder) => {
      placeholder.style.height = `${clientHeight}px`;
    }
  );

  utils.setAttributes(document.querySelector("#menu svg"), {
    width: innerWidth,
    height: (clientHeight * 60) / 768,
  });

  document.querySelector("#menu").style.width = `${innerWidth}px`;
  document.querySelector("#menu").style.height = `${
    (clientHeight * 60) / 768
  }px`;
};

const hideLoader = () => {
  document.querySelector("#loader").setAttribute("uiState", "hidden");
};

export default class {
  constructor() {
    this.scenes = {
      scene1,
      scene2,
      scene3,
      scene5,
      scene4,
      scene6,
    };

    this.timing = timing.scenes;

    this.initEvents();
    this.addEventToReopenBtn();
    this.buildDOMElements();
    this.initScenes();
    hideLoader();
  }

  addEventToReopenBtn() {
    if (document.querySelector("#reopen")) {
      document.querySelector("#reopen").addEventListener("click", (ev) => {
        ev.preventDefault();
        this.show();
      });
    }
  }

  initEvents() {
    window.onresize = debounce(100, false, this.start.bind(this));
    utils.onBeforePrint(this.destroy.bind(this));
  }

  buildDOMElements() {
    this.siteRoot = utils.createElementWithAttrs("figure", { role: "site" });
    this.placeholdersRoot = utils.createElementWithAttrs("figure", {
      role: "placeholder",
    });

    const nav = utils.createElementWithAttrs("nav", { id: "menu" });
    this.siteRoot.appendChild(nav);

    Object.keys(this.timing).forEach((key) => {
      this.siteRoot.appendChild(
        utils.createElementWithAttrs("div", {
          "data-scene": key,
          id: key,
        })
      );

      const fff = utils.createElementWithAttrs("div", {
        "data-scene-placeholder": true,
      });
      const ggg = utils.createElementWithAttrs("div", {
        "data-scene-placeholder": true,
      });

      document.body.appendChild(fff);
      document.body.appendChild(ggg);
    });

    document.body.appendChild(this.siteRoot);
  }

  initScenes() {
    Object.values(this.scenes).forEach((scene) => {
      scene.init(this);
    });

    menu.init(this);
  }

  start() {
    if (utils.shouldFallbackToBoringCV()) {
      this.destroy();
    } else {
      resizeScenes();
      this.show();
    }
  }

  initScrollyTelly() {
    if (!scrollyTelly.get()) {
      this.scrollyTelly = scrollyTelly.init({
        render: (data) => {
          Object.values(this.scenes).forEach((scene) => {
            if (typeof scene.render === "function") {
              scene.render(data);
            }
          });
        },
        beforerender: (data) => {
          Object.values(this.scenes).forEach((scene) => {
            if (typeof scene.beforerender === "function") {
              scene.beforerender(data);
            }
          });
        },
      });

      scrollyTelly.stylesheets.init();

      scrollyTelly.menu.init(this.scrollyTelly, {
        animate: true,
        easing: "swing",
        scenes: this.timing,
        scale: 1,
        duration(currentTop, targetTop) {
          return Math.abs(currentTop - targetTop) * 0.5;
        },
      });
    }

    this.scrollyTelly.refresh();
  }

  show() {
    document.body.setAttribute("data-display", "divertissement");
    document.querySelector("#vignette").setAttribute("uiState", "show");
    this.siteRoot.setAttribute("uiState", "show");
    this.initScrollyTelly();
  }

  destroy() {
    document.body.removeAttribute("style");
    document.body.removeAttribute("data-display");
    document.querySelector("#vignette").setAttribute("uiState", "hidden");
    this.siteRoot.setAttribute("uiState", "hidden");
    if (scrollyTelly.get()) {
      this.scrollyTelly.destroy();
      window.scroll(0, 0);
    }
  }
}
