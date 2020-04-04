import calcSteps from "./calcSteps";

const getScrollTop = () => {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
};

/**
 * Renders all elements.
 */
const render = (_instance, scrollables, _listeners, lastTop) => {
  // Current direction (up/down).

  // The last top offset value. Needed to determine direction.

  // We may render something else than the actual scrollbar position.
  const curTop = getScrollTop();

  // If there's an animation, which ends in current render call, call the callback after rendering.

  // Remember in which direction are we scrolling?
  const direction = curTop > lastTop ? "down" : "up";

  const listenerParams = {
    curTop,
    direction,
  };

  // Tell the listener we are about to render.
  const continueRendering =
    _listeners.beforerender &&
    _listeners.beforerender.call(_instance, listenerParams);

  // The beforerender listener function is able the cancel rendering.
  if (continueRendering !== false) {
    // Now actually interpolate all the styles.
    calcSteps(curTop, scrollables);

    if (_listeners.render) {
      _listeners.render.call(_instance, listenerParams);
    }
  }

  return curTop;
};

export default render;
