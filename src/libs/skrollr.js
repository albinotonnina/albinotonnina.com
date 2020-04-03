/* eslint-disable no-underscore-dangle */

// import { addEvent } from "./eventHandling";

import Skrollr from "./skrollrClass";

const skrollrFunc = () => {
  // The last time we called the render method (doesn't mean we rendered!).

  // Will contain data about a running scrollbar animation, if any.

  // Can be set by any operation/event to force rendering even if the scrollbar didn't move.

  /**
   * Constructor.
   */

  /*
   * Global api.
   */

  // Singleton
  let _instance;

  const skrollr = {
    get() {
      return _instance;
    },
    // Main entry point.
    init(options) {
      // Singleton
      _instance = _instance || new Skrollr(options);

      return _instance;
    },
  };

  return skrollr;
};

export default skrollrFunc;
