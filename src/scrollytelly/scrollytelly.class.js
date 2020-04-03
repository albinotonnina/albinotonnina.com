import updateClass from "./updateClass";
import refresh from "./refresh";
import reset from "./reset";
import createThreshold from "./createThreshold";
import render from "./render";

const SCROLLER_CLASS = "scrollyTelly";
const NO_SCROLLER_CLASS = `no-${SCROLLER_CLASS}`;

class ScrollyTelly {
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

    updateClass(
      document.documentElement,
      [SCROLLER_CLASS],
      [NO_SCROLLER_CLASS]
    );

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
    updateClass(
      document.documentElement,
      [NO_SCROLLER_CLASS],
      [SCROLLER_CLASS]
    );

    this.scrollables.forEach((scrollable) => {
      reset(this.scrollables, scrollable.element);
    });

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

export default ScrollyTelly;
