/* eslint-disable no-underscore-dangle */

import ScrollyTelly from "./scrollytelly.class";

export default () => {
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

  return {
    get() {
      return _instance;
    },
    // Main entry point.
    init(options) {
      // Singleton
      _instance = _instance || new ScrollyTelly(options);

      return _instance;
    },
  };
};
