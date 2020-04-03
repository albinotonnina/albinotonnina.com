/* eslint-disable no-underscore-dangle */
import easings from "./easings";
import { addEvent, removeEvent, removeAllEvents } from "./eventHandling";
import updateClass from "./updateClass";
import refresh from "./refresh";
import reset from "./reset";
import createThreshold from "./createThreshold";
import render from "./render";

const SKROLLR_CLASS = "skrollr";
const NO_SKROLLR_CLASS = `no-${SKROLLR_CLASS}`;
const SKROLLR_DESKTOP_CLASS = `${SKROLLR_CLASS}-desktop`;

const DEFAULT_EASING = "linear";
const DEFAULT_DURATION = 1000; // ms

const rxCamelCase = /-([a-z0-9_])/g;
const rxCamelCaseFn = (str, letter) => letter.toUpperCase();

const _now = Date.now;

const skrollrFunc = (window, document) => {
  // Singleton
  let _instance;

  // They will be filled when skrollr gets initialized.
  let documentElement;
  let body;

  let _skrollables;

  let _skrollrBody;

  let _listeners;

  let _maxKeyFrame = 0;

  // The last time we called the render method (doesn't mean we rendered!).

  // For detecting if it actually resized (#271).
  let _lastViewportWidth = 0;
  let _lastViewportHeight = 0;

  // Will contain data about a running scrollbar animation, if any.
  let _scrollAnimation;

  // Can be set by any operation/event to force rendering even if the scrollbar didn't move.
  let _forceRender;

  // Animation frame id returned by RequestAnimationFrame (or timeout when RAF is not supported).
  let _animFrame;

  let _requestReflow = false;

  /**
   * Constructor.
   */
  class Skrollr {
    constructor(options = {}) {
      documentElement = document.documentElement;
      body = document.body;

      _instance = this;

      _listeners = {
        // Function to be called right before rendering.
        beforerender: options.beforerender,

        // Function to be called right after finishing rendering.
        render: options.render,

        // Function to be called whenever an element with the `data-emit-events` attribute passes a keyframe.
        keyframe: options.keyframe,
      };

      updateClass(
        documentElement,
        [SKROLLR_CLASS, SKROLLR_DESKTOP_CLASS],
        [NO_SKROLLR_CLASS]
      );

      // Triggers parsing of elements and a first reflow.
      this.refresh();

      addEvent(window, "resize orientationchange", () => {
        const width = documentElement.clientWidth;
        const height = documentElement.clientHeight;

        // Only reflow if the size actually changed (#271).
        if (height !== _lastViewportHeight || width !== _lastViewportWidth) {
          _lastViewportHeight = height;
          _lastViewportWidth = width;

          _requestReflow = true;
        }
      });

      render(
        _instance,
        _skrollables,
        _requestReflow,
        _scrollAnimation,
        _forceRender,
        _maxKeyFrame,
        _listeners
      );

      const some = document.querySelectorAll("[data-scene-placeholder]");

      const observer = new IntersectionObserver(
        () => {
          render(
            _instance,
            _skrollables,
            _requestReflow,
            _scrollAnimation,
            _forceRender,
            _maxKeyFrame,
            _listeners
          );
        },
        {
          rootMargin: "0px",
          threshold: createThreshold(
            _maxKeyFrame + documentElement.clientHeight
          ),
        }
      );
      some.forEach((image) => {
        observer.observe(image);
      });

      return this;
    }

    /**
     * (Re)parses some or all elements.
     */
    refresh(elements) {
      _skrollables = refresh(
        elements,
        _skrollables,
        _instance,
        documentElement,
        _maxKeyFrame,
        _forceRender
      );
    }

    /**
     * Animates scroll top to new position.
     */
    animateTo(top, options = {}) {
      const now = _now();
      const scrollTop = this.getScrollTop();

      // Setting this to a new value will automatically cause the current animation to stop, if any.
      _scrollAnimation = {
        startTop: scrollTop,
        topDiff: top - scrollTop,
        targetTop: top,
        duration: options.duration || DEFAULT_DURATION,
        startTime: now,
        endTime: now + (options.duration || DEFAULT_DURATION),
        easing: easings[options.easing || DEFAULT_EASING],
        done: options.done,
      };

      // Don't queue the animation if there's nothing to animate.
      if (!_scrollAnimation.topDiff) {
        if (_scrollAnimation.done) {
          _scrollAnimation.done.call(this, false);
        }

        _scrollAnimation = undefined;
      }

      return this;
    }

    /**
     * Stops animateTo animation.
     */
    stopAnimateTo() {
      if (_scrollAnimation && _scrollAnimation.done) {
        _scrollAnimation.done.call(this, true);
      }

      _scrollAnimation = undefined;
    }

    setScrollTop(top, force) {
      _forceRender = force === true;

      window.scrollTo(0, top);

      return this;
    }

    getScrollTop() {
      return (
        window.pageYOffset || documentElement.scrollTop || body.scrollTop || 0
      );
    }

    getMaxScrollTop() {
      return _maxKeyFrame;
    }

    on(name, fn) {
      _listeners[name] = fn;

      return this;
    }

    off(name) {
      delete _listeners[name];

      return this;
    }

    destroy() {
      window.cancelAnimationFrame(_animFrame);
      removeAllEvents();

      updateClass(
        documentElement,
        [NO_SKROLLR_CLASS],
        [SKROLLR_CLASS, SKROLLR_DESKTOP_CLASS]
      );

      let skrollableIndex = 0;
      const skrollablesLength = _skrollables.length;

      for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
        reset(_skrollables, _skrollables[skrollableIndex].element);
      }

      documentElement.style.overflow = body.style.overflow = "";
      documentElement.style.height = body.style.height = "";

      if (_skrollrBody) {
        skrollr.setStyle(_skrollrBody, "transform", "none");
      }

      // this = undefined;
      delete this;
      _skrollrBody = undefined;
      _listeners = undefined;
      _maxKeyFrame = 0;
      _direction = "down";
      _lastTop = -1;
      _lastViewportWidth = 0;
      _lastViewportHeight = 0;
      _requestReflow = false;
      _scrollAnimation = undefined;

      _forceRender = undefined;
    }

    setStyle(el, propS, val) {
      const { style } = el;

      // Camel case.
      const prop = propS.replace(rxCamelCase, rxCamelCaseFn).replace("-", "");

      // Make sure z-index gets a <integer>.
      // This is the only <integer> case we need to handle.
      if (prop === "zIndex") {
        if (isNaN(val)) {
          // If it's not a number, don't touch it.
          // It could for example be "auto" (#351).
          style[prop] = val;
        } else {
          // Floor the number.
          style[prop] = `${val || 0}`;
        }
      }
      // #64: "float" can't be set across browsers. Needs to use "cssFloat" for all except IE.
      else if (prop === "float") {
        style.styleFloat = style.cssFloat = val;
      } else {
        // Need try-catch for old IE.
        try {
          // Set unprefixed.
          style[prop] = val;
        } catch (ignore) {
          console.log("ignore", ignore);
        }
      }
    }
  }

  /*
   * Global api.
   */
  const skrollr = {
    get() {
      return _instance;
    },
    // Main entry point.
    init(options) {
      return _instance || new Skrollr(options);
    },
    VERSION: "0.6.26",
  };

  skrollr.addEvent = addEvent;
  skrollr.removeEvent = removeEvent;

  return skrollr;
};

export default skrollrFunc;
