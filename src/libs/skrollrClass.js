import updateClass from "./updateClass";
import refresh from "./refresh";
import reset from "./reset";
import createThreshold from "./createThreshold";
import render from "./render";

const SKROLLR_CLASS = "skrollr";
const NO_SKROLLR_CLASS = `no-${SKROLLR_CLASS}`;

class Skrollr {
  constructor(options = {}) {
    this.listeners = {
      // Function to be called right before rendering.
      beforerender: options.beforerender,
      // Function to be called right after finishing rendering.
      render: options.render,
    };

    this.scrollables = [];

    this.maxKeyFrame = 0;

    this.lastTop = 0;

    updateClass(document.documentElement, [SKROLLR_CLASS], [NO_SKROLLR_CLASS]);

    // Triggers parsing of elements and a first reflow.
    this.refresh();

    this.lastTop = render(this, this.scrollables, this.listeners, this.lastTop);

    const some = document.querySelectorAll("[data-scene-placeholder]");

    const observer = new IntersectionObserver(
      () => {
        this.lastTop = render(
          this,
          this.scrollables,
          this.listeners,
          this.lastTop
        );
      },
      {
        rootMargin: "0px",
        threshold: createThreshold(
          this.maxKeyFrame + document.documentElement.clientHeight
        ),
      }
    );
    some.forEach((image) => {
      observer.observe(image);
    });
  }

  /**
   * (Re)parses some or all elements.
   */
  refresh() {
    this.scrollables = refresh();
  }

  getMaxScrollTop() {
    return this.maxKeyFrame;
  }

  destroy() {
    updateClass(document.documentElement, [NO_SKROLLR_CLASS], [SKROLLR_CLASS]);

    let skrollableIndex = 0;
    const skrollablesLength = this.scrollables.length;

    for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
      reset(this.scrollables, this.scrollables[skrollableIndex].element);
    }

    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.documentElement.style.height = "";
    document.body.style.height = "";

    // this = undefined;
    delete this;
    this.listeners = [];
    this.maxKeyFrame = 0;
  }
}

export default Skrollr;
