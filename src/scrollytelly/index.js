import updateClass from "./updateClass";
import processProps from "./processProps";
import parseScrollyTellyStylesheets from "./parseStylesheets";
import render from "./render";

const SCROLLER_CLASS = "scrollyTelly";
const NO_SCROLLER_CLASS = `no-${SCROLLER_CLASS}`;

class ScrollyTelly {
  constructor(options = {}) {
    this.listeners = {
      beforerender: options.beforerender,
      render: options.render,
    };

    this.scrollables = [];
    this.lastTop = 0;

    updateClass(
      document.documentElement,
      [SCROLLER_CLASS],
      [NO_SCROLLER_CLASS]
    );
    parseScrollyTellyStylesheets();
    this.processProps();
  }

  render() {
    this.lastTop = render(this, this.scrollables, this.listeners, this.lastTop);
  }

  processProps() {
    this.scrollables = processProps();
  }

  destroy() {
    updateClass(
      document.documentElement,
      [NO_SCROLLER_CLASS],
      [SCROLLER_CLASS]
    );

    delete this;
  }
}

export default ScrollyTelly;
