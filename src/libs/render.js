import reflow from "./reflow";
import calcSteps from "./calcSteps";
import easings from "./easings";

const _now = Date.now;

const getScrollTop = () => {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
};
const DEFAULT_SMOOTH_SCROLLING_DURATION = 200; // ms
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
  let _direction = "down";

  // The last top offset value. Needed to determine direction.
  let _lastTop = -1;
  let _lastRenderCall = _now();
  // let _requestReflow = true;
  const _smoothScrollingDuration = DEFAULT_SMOOTH_SCROLLING_DURATION;

  // Will contain settins for smooth scrolling if enabled.
  let _smoothScrolling = {
    targetTop: getScrollTop(),
  };

  if (_requestReflow) {
    _requestReflow = false;
    _maxKeyFrame = reflow(_instance, _skrollables, document.documentElement);

    _forceRender = true;
  }

  // We may render something else than the actual scrollbar position.
  let renderTop = getScrollTop();

  // If there's an animation, which ends in current render call, call the callback after rendering.
  let afterAnimationCallback;
  const now = _now();
  let progress;

  // Before actually rendering handle the scroll animation, if any.
  if (_scrollAnimation) {
    // It's over
    if (now >= _scrollAnimation.endTime) {
      renderTop = _scrollAnimation.targetTop;
      afterAnimationCallback = _scrollAnimation.done;
      _scrollAnimation = undefined;
    } else {
      // Map the current progress to the new progress using given easing function.
      progress = _scrollAnimation.easing(
        (now - _scrollAnimation.startTime) / _scrollAnimation.duration
      );

      renderTop =
        _scrollAnimation.startTop + progress * _scrollAnimation.topDiff || 0;
    }

    _instance.setScrollTop(renderTop, true);
  }
  // Smooth scrolling only if there's no animation running and if we're not forcing the rendering.
  else if (!_forceRender) {
    const smoothScrollingDiff = _smoothScrolling.targetTop - renderTop;

    // The user scrolled, start new smooth scrolling.
    if (smoothScrollingDiff) {
      _smoothScrolling = {
        startTop: _lastTop,
        topDiff: renderTop - _lastTop,
        targetTop: renderTop,
        startTime: _lastRenderCall,
        endTime: _lastRenderCall + _smoothScrollingDuration,
      };
    }

    // Interpolate the internal scroll position (not the actual scrollbar).
    if (now <= _smoothScrolling.endTime) {
      // Map the current progress to the new progress using easing function.
      progress = easings.sqrt(
        (now - _smoothScrolling.startTime) / _smoothScrollingDuration
      );

      renderTop =
        _smoothScrolling.startTop + progress * _smoothScrolling.topDiff || 0;
    }
  }

  // Did the scroll position even change?
  if (_forceRender || _lastTop !== renderTop) {
    // Remember in which direction are we scrolling?
    _direction =
      renderTop > _lastTop ? "down" : renderTop < _lastTop ? "up" : _direction;

    _forceRender = false;

    const listenerParams = {
      curTop: renderTop,
      lastTop: _lastTop,
      maxTop: _maxKeyFrame,
      direction: _direction,
    };

    // Tell the listener we are about to render.
    const continueRendering =
      _listeners.beforerender &&
      _listeners.beforerender.call(_instance, listenerParams);

    // The beforerender listener function is able the cancel rendering.
    if (continueRendering !== false) {
      // Now actually interpolate all the styles.
      calcSteps(
        _instance,
        renderTop,
        _instance.getScrollTop(),
        _skrollables,
        _direction
      );

      // Remember when we last rendered.
      _lastTop = renderTop;

      if (_listeners.render) {
        _listeners.render.call(_instance, listenerParams);
      }
    }

    if (afterAnimationCallback) {
      afterAnimationCallback.call(_instance, false);
    }
  }

  _lastRenderCall = now;
};

export default render;
