import { debounce } from "throttle-debounce";
import * as utils from "./utilities";
import menu from "../scenes/menu/animation";
import scene1 from "../scenes/scene1/animation";
import scene2 from "../scenes/scene2/animation";
import scene3 from "../scenes/scene3/animation";
import scene4 from "../scenes/scene4/animation";
import scene5 from "../scenes/scene5/animation";
import scene6 from "../scenes/scene6/animation";
import ScrollyTelly from "../scrollytelly";
import parseScrollyTellyStylesheets from "../scrollytelly/parseStylesheets";
import timing from "./timing";
import "../styles/main.scss";
import "../scenes/animation.scss";

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

    // this.scrollyTellyScripts = getScrollyTelly();

    this.timing = timing.scenes;

    this.maxScroll = Object.values(this.timing).reduce(
      (acc, { duration }) => acc + parseInt(duration, 0),
      0
    );

    this.initEvents();
    this.buildDOMElements();
    this.initScenes();
    hideLoader();
  }

  resizePlaceholders() {
    // const { innerWidth } = window;
    const { clientHeight } = document.documentElement;

    const screens = Math.round(this.maxScroll / clientHeight);

    const arrayScreens = Array.from(Array(screens).keys());

    document
      .querySelectorAll("[data-scene-placeholder]")
      .forEach((placeholder) => {
        placeholder.parentNode.removeChild(placeholder);
      });

    arrayScreens.forEach(() => {
      const placeholder = utils.createElementWithAttrs("div", {
        "data-scene-placeholder": true,
      });

      document.body.insertBefore(placeholder, this.siteRoot);
    });

    document
      .querySelectorAll("[data-scene-placeholder]")
      .forEach((placeholder) => {
        placeholder.style.height = `${clientHeight}px`;
      });
  }

  doInterObs() {
    const some = document.querySelectorAll("[data-scene-placeholder]");

    // document.body.style.height = `${
    //   maxScroll + document.documentElement.clientHeight
    // }px`;

    const threshold = utils.createThreshold(
      this.maxScroll + document.documentElement.clientHeight
    );

    const observer = new IntersectionObserver(
      () => this.scrollyTelly.render(),
      {
        rootMargin: "0px",
        threshold,
      }
    );
    some.forEach((image) => {
      observer.observe(image);
    });
  }

  initEvents() {
    window.onresize = debounce(100, false, this.start.bind(this));
    utils.onBeforePrint(this.destroy.bind(this));

    if (document.querySelector("#reopen")) {
      document.querySelector("#reopen").addEventListener("click", (ev) => {
        ev.preventDefault();
        this.show();
      });
    }
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
      this.initScrollyTelly();

      this.resizePlaceholders();
      this.doInterObs();
      this.show();
    }
  }

  initScrollyTelly() {
    this.scrollyTelly = new ScrollyTelly({
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
