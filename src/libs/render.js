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
const render = (
  _instance,
  _skrollables,
  _requestReflow,
  _scrollAnimation,
  _forceRender,
  _maxKeyFrame,
  _listeners
) => {
  // Current direction (up/down).
  let direction = "down";

  // The last top offset value. Needed to determine direction.
  let _lastTop = -1;

  // We may render something else than the actual scrollbar position.
  const renderTop = getScrollTop();

  // If there's an animation, which ends in current render call, call the callback after rendering.

  // Remember in which direction are we scrolling?
  direction =
    renderTop > _lastTop ? "down" : renderTop < _lastTop ? "up" : direction;

  const listenerParams = {
    curTop: renderTop,
    lastTop: _lastTop,
    maxTop: _maxKeyFrame,
    direction,
  };

  // Tell the listener we are about to render.
  const continueRendering =
    _listeners.beforerender &&
    _listeners.beforerender.call(_instance, listenerParams);

  // The beforerender listener function is able the cancel rendering.
  if (continueRendering !== false) {
    // Now actually interpolate all the styles.
    calcSteps(_instance, renderTop, _skrollables, direction);

    // Remember when we last rendered.
    _lastTop = renderTop;

    if (_listeners.render) {
      _listeners.render.call(_instance, listenerParams);
    }
  }
};

export default render;
