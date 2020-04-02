/* eslint-disable no-underscore-dangle */
import easings from "./easings";

const createThreshold = (height) => {
  const count = Math.ceil(height / 1);
  const t = [];
  const ratio = 1 / count;
  for (let i = 0; i < count; i += 1) {
    t.push(i * ratio);
  }
  return t;
};

// Minify optimization.
const hasProp = Object.prototype.hasOwnProperty;
const { Math } = window;
const getStyle = window.getComputedStyle;

const SKROLLABLE_CLASS = "skrollable";
const SKROLLABLE_BEFORE_CLASS = `${SKROLLABLE_CLASS}-before`;
const SKROLLABLE_BETWEEN_CLASS = `${SKROLLABLE_CLASS}-between`;
const SKROLLABLE_AFTER_CLASS = `${SKROLLABLE_CLASS}-after`;

const SKROLLR_CLASS = "skrollr";
const NO_SKROLLR_CLASS = `no-${SKROLLR_CLASS}`;
const SKROLLR_DESKTOP_CLASS = `${SKROLLR_CLASS}-desktop`;
const SKROLLR_MOBILE_CLASS = `${SKROLLR_CLASS}-mobile`;

const DEFAULT_EASING = "linear";
const DEFAULT_DURATION = 1000; // ms
const DEFAULT_MOBILE_DECELERATION = 0.004; // pixel/ms²

const DEFAULT_SMOOTH_SCROLLING_DURATION = 200; // ms

const ANCHOR_START = "start";
const ANCHOR_END = "end";
const ANCHOR_CENTER = "center";
const ANCHOR_BOTTOM = "bottom";

// The property which will be added to the DOM element to hold the ID of the skrollable.
const SKROLLABLE_ID_DOM_PROPERTY = "___skrollable_id";

// Find all data-attributes. data-[_constant]-[offset]-[anchor]-[anchor].
const rxKeyframeAttribute = /^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/;

const rxPropValue = /\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi;

// Easing function names follow the property in square brackets.
const rxPropEasing = /^(@?[a-z\-]+)\[(\w+)\]$/;

const rxCamelCase = /-([a-z0-9_])/g;
const rxCamelCaseFn = (str, letter) => letter.toUpperCase();

// Numeric values with optional sign.
const rxNumericValue = /[\-+]?[\d]*\.?[\d]+/g;

// Used to replace occurences of {?} with a number.
const rxInterpolateString = /\{\?\}/g;

// Finds rgb(a) colors, which don't use the percentage notation.
const rxRGBAIntegerColor = /rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g;

// Finds all gradients.
const rxGradient = /[a-z\-]+-gradient/g;

const rxTrim = /^\s+|\s+$/g;

const _untrim = (a) => ` ${a} `;

const _trim = (a) => a.replace(rxTrim, "");

const _now = Date.now;

const _keyFrameComparator = ({ frame }, { frame: frameB }) => frame - frameB;

const skrollrFunc = (window, document) => {
  // Singleton
  let _instance;

  // They will be filled when skrollr gets initialized.
  let documentElement;
  let body;

  let _skrollables;

  let _skrollrBody;

  let _listeners;
  let _forceHeight;
  let _maxKeyFrame = 0;

  let _scale = 1;
  let _constants;

  let _mobileDeceleration;

  // Current direction (up/down).
  let _direction = "down";

  // The last top offset value. Needed to determine direction.
  let _lastTop = -1;

  // The last time we called the render method (doesn't mean we rendered!).
  let _lastRenderCall = _now();

  // For detecting if it actually resized (#271).
  let _lastViewportWidth = 0;
  let _lastViewportHeight = 0;

  let _requestReflow = true;

  // Will contain data about a running scrollbar animation, if any.
  let _scrollAnimation;

  let _smoothScrollingEnabled;

  let _smoothScrollingDuration;

  // Will contain settins for smooth scrolling if enabled.
  let _smoothScrolling;

  // Can be set by any operation/event to force rendering even if the scrollbar didn't move.
  let _forceRender;

  // Each skrollable gets an unique ID incremented for each skrollable.
  // The ID is the index in the _skrollables array.
  let _skrollableIdCounter = 0;

  let _edgeStrategy;

  // If the browser supports 3d transforms, this will be filled with 'translateZ(0)' (empty string otherwise).
  let _translateZ;

  // Will contain data about registered events by skrollr.
  let _registeredEvents = [];

  // Animation frame id returned by RequestAnimationFrame (or timeout when RAF is not supported).
  let _animFrame;
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

  /**
   * Cross browser event handling.
   */
  const _addEvent = (element, namesString, callback) => {
    const intermediate = (e = window.event) => {
      if (!e.target) {
        e.target = e.srcElement;
      }

      if (!e.preventDefault) {
        e.preventDefault = () => {
          e.returnValue = false;
          e.defaultPrevented = true;
        };
      }

      return callback.call(this, e);
    };

    const names = namesString.split(" ");

    let name;
    let nameCounter = 0;
    const namesLength = names.length;

    for (; nameCounter < namesLength; nameCounter++) {
      name = names[nameCounter];

      if (element.addEventListener) {
        element.addEventListener(name, callback, false);
      } else {
        element.attachEvent(`on${name}`, intermediate);
      }

      // Remember the events to be able to flush them later.
      _registeredEvents.push({
        element,
        name,
        listener: callback,
      });
    }
  };

  const _removeEvent = (element, namesString, callback) => {
    const names = namesString.split(" ");

    let nameCounter = 0;
    const namesLength = names.length;

    for (; nameCounter < namesLength; nameCounter++) {
      if (element.removeEventListener) {
        element.removeEventListener(names[nameCounter], callback, false);
      } else {
        element.detachEvent(`on${names[nameCounter]}`, callback);
      }
    }
  };

  const _removeAllEvents = () => {
    let eventData;
    let eventCounter = 0;
    const eventsLength = _registeredEvents.length;

    for (; eventCounter < eventsLength; eventCounter++) {
      eventData = _registeredEvents[eventCounter];

      _removeEvent(eventData.element, eventData.name, eventData.listener);
    }

    _registeredEvents = [];
  };

  const _emitEvent = (element, name, direction) => {
    if (_listeners.keyframe) {
      _listeners.keyframe.call(_instance, element, name, direction);
    }
  };

  skrollr.addEvent = _addEvent;
  skrollr.removeEvent = _removeEvent;

  const _reflow = () => {
    const pos = _instance.getScrollTop();

    // Will be recalculated by _updateDependentKeyFrames.
    _maxKeyFrame = 0;

    if (_forceHeight) {
      // un-"force" the height to not mess with the calculations in _updateDependentKeyFrames (#216).
      body.style.height = "";
    }

    _updateDependentKeyFrames();

    if (_forceHeight) {
      // "force" the height.
      body.style.height = `${_maxKeyFrame + documentElement.clientHeight}px`;
    }

    // Remember and reset the scroll pos
    _instance.setScrollTop(pos, true);

    _forceRender = true;
  };

  /*
   * Returns a copy of the constants object where all functions and strings have been evaluated.
   */
  const _processConstants = () => {
    const viewportHeight = documentElement.clientHeight;
    const copy = {};
    let prop;
    let value;

    for (prop in _constants) {
      value = _constants[prop];

      if (typeof value === "function") {
        value = value.call(_instance);
      }
      // Percentage offset.
      else if (/p$/.test(value)) {
        value = (value.slice(0, -1) / 100) * viewportHeight;
      }

      copy[prop] = value;
    }

    return copy;
  };

  /*
   * Returns the height of the document.
   */
  const _getDocumentHeight = () => {
    const skrollrBodyHeight = (_skrollrBody && _skrollrBody.offsetHeight) || 0;
    const bodyHeight = Math.max(
      skrollrBodyHeight,
      body.scrollHeight,
      body.offsetHeight,
      documentElement.scrollHeight,
      documentElement.offsetHeight,
      documentElement.clientHeight
    );

    return bodyHeight - documentElement.clientHeight;
  };

  /**
   * Returns a string of space separated classnames for the current element.
   * Works with SVG as well.
   */
  const _getClass = (element) => {
    let prop = "className";

    // SVG support by using className.baseVal instead of just className.
    if (window.SVGElement && element instanceof window.SVGElement) {
      element = element[prop];
      prop = "baseVal";
    }

    return element[prop];
  };

  /**
   * Adds and removes a CSS classes.
   * Works with SVG as well.
   * add and remove are arrays of strings,
   * or if remove is ommited add is a string and overwrites all classes.
   */
  const _updateClass = (element, add, remove) => {
    let prop = "className";

    // SVG support by using className.baseVal instead of just className.
    if (window.SVGElement && element instanceof window.SVGElement) {
      element = element[prop];
      prop = "baseVal";
    }

    // When remove is ommited, we want to overwrite/set the classes.
    if (remove === undefined) {
      element[prop] = add;
      return;
    }

    // Cache current classes. We will work on a string before passing back to DOM.
    let val = element[prop];

    // All classes to be removed.
    let classRemoveIndex = 0;
    const removeLength = remove.length;

    for (; classRemoveIndex < removeLength; classRemoveIndex++) {
      val = _untrim(val).replace(_untrim(remove[classRemoveIndex]), " ");
    }

    val = _trim(val);

    // All classes to be added.
    let classAddIndex = 0;
    const addLength = add.length;

    for (; classAddIndex < addLength; classAddIndex++) {
      // Only add if el not already has class.
      if (!_untrim(val).includes(_untrim(add[classAddIndex]))) {
        val += ` ${add[classAddIndex]}`;
      }
    }

    element[prop] = _trim(val);
  };

  // Vendor prefix. Will be set once skrollr gets initialized.
  let theCSSPrefix = "";
  let theDashedCSSPrefix = "";

  // Will be called once (when skrollr gets initialized).
  const detectCSSPrefix = () => {
    // Only relevant prefixes. May be extended.
    // Could be dangerous if there will ever be a CSS property which actually starts with "ms". Don't hope so.
    const rxPrefixes = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;

    // Detect prefix for current browser by finding the first property using a prefix.
    if (!getStyle) {
      return;
    }

    const style = getStyle(body, null);

    for (const k in style) {
      // We check the key and if the key is a number, we check the value as well, because safari's getComputedStyle returns some weird array-like thingy.
      theCSSPrefix =
        k.match(rxPrefixes) || (+k == k && style[k].match(rxPrefixes));

      if (theCSSPrefix) {
        break;
      }
    }

    // Did we even detect a prefix?
    if (!theCSSPrefix) {
      theCSSPrefix = theDashedCSSPrefix = "";

      return;
    }

    theCSSPrefix = theCSSPrefix[0];

    // We could have detected either a dashed prefix or this camelCaseish-inconsistent stuff.
    if (theCSSPrefix.slice(0, 1) === "-") {
      theDashedCSSPrefix = theCSSPrefix;

      // There's no logic behind these. Need a look up.
      theCSSPrefix = {
        "-webkit-": "webkit",
        "-moz-": "Moz",
        "-ms-": "ms",
        "-o-": "O",
      }[theCSSPrefix];
    } else {
      theDashedCSSPrefix = `-${theCSSPrefix.toLowerCase()}-`;
    }
  };

  /**
   * Constructor.
   */
  class Skrollr {
    constructor(options = {}) {
      documentElement = document.documentElement;
      body = document.body;

      detectCSSPrefix();

      _instance = this;

      _constants = options.constants || {};

      // We allow defining custom easings or overwrite existing.
      if (options.easing) {
        for (const e in options.easing) {
          easings[e] = options.easing[e];
        }
      }

      _edgeStrategy = options.edgeStrategy || "set";

      _listeners = {
        // Function to be called right before rendering.
        beforerender: options.beforerender,

        // Function to be called right after finishing rendering.
        render: options.render,

        // Function to be called whenever an element with the `data-emit-events` attribute passes a keyframe.
        keyframe: options.keyframe,
      };

      // forceHeight is true by default
      _forceHeight = options.forceHeight !== false;

      if (_forceHeight) {
        _scale = options.scale || 1;
      }

      _mobileDeceleration =
        options.mobileDeceleration || DEFAULT_MOBILE_DECELERATION;

      _smoothScrollingEnabled = options.smoothScrolling !== false;
      _smoothScrollingDuration =
        options.smoothScrollingDuration || DEFAULT_SMOOTH_SCROLLING_DURATION;

      // Dummy object. Will be overwritten in the _render method when smooth scrolling is calculated.
      _smoothScrolling = {
        targetTop: this.getScrollTop(),
      };

      _updateClass(
        documentElement,
        [SKROLLR_CLASS, SKROLLR_DESKTOP_CLASS],
        [NO_SKROLLR_CLASS]
      );

      // Triggers parsing of elements and a first reflow.
      this.refresh();

      _addEvent(window, "resize orientationchange", () => {
        const width = documentElement.clientWidth;
        const height = documentElement.clientHeight;

        // Only reflow if the size actually changed (#271).
        if (height !== _lastViewportHeight || width !== _lastViewportWidth) {
          _lastViewportHeight = height;
          _lastViewportWidth = width;

          _requestReflow = true;
        }
      });

      _render();

      const some = document.querySelectorAll("[data-scene-placeholder]");

      const observer = new IntersectionObserver(_render, {
        rootMargin: "0px",
        threshold: createThreshold(_maxKeyFrame + documentElement.clientHeight),
      });
      some.forEach((image) => {
        observer.observe(image);
      });

      return this;
    }

    /**
     * (Re)parses some or all elements.
     */
    refresh(elements) {
      let elementIndex;
      let elementsLength;
      let ignoreID = false;

      // Completely reparse anything without argument.
      if (elements === undefined) {
        // Ignore that some elements may already have a skrollable ID.
        ignoreID = true;

        _skrollables = [];
        _skrollableIdCounter = 0;

        elements = document.getElementsByTagName("*");
      } else if (elements.length === undefined) {
        // We also accept a single element as parameter.
        elements = [elements];
      }

      elementIndex = 0;
      elementsLength = elements.length;

      for (; elementIndex < elementsLength; elementIndex++) {
        const el = elements[elementIndex];
        let anchorTarget = el;
        const keyFrames = [];

        // If this particular element should be smooth scrolled.
        let smoothScrollThis = _smoothScrollingEnabled;

        // The edge strategy for this particular element.
        let edgeStrategy = _edgeStrategy;

        // If this particular element should emit keyframe events.
        let emitEvents = false;

        // If we're reseting the counter, remove any old element ids that may be hanging around.
        if (ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) {
          delete el[SKROLLABLE_ID_DOM_PROPERTY];
        }

        if (!el.attributes) {
          continue;
        }

        // Iterate over all attributes and search for key frame attributes.
        let attributeIndex = 0;
        const attributesLength = el.attributes.length;

        for (; attributeIndex < attributesLength; attributeIndex++) {
          const attr = el.attributes[attributeIndex];

          if (attr.name === "data-anchor-target") {
            anchorTarget = document.querySelector(attr.value);

            if (anchorTarget === null) {
              throw `Unable to find anchor target "${attr.value}"`;
            }

            continue;
          }

          // Global smooth scrolling can be overridden by the element attribute.
          if (attr.name === "data-smooth-scrolling") {
            smoothScrollThis = attr.value !== "off";

            continue;
          }

          // Global edge strategy can be overridden by the element attribute.
          if (attr.name === "data-edge-strategy") {
            edgeStrategy = attr.value;

            continue;
          }

          // Is this element tagged with the `data-emit-events` attribute?
          if (attr.name === "data-emit-events") {
            emitEvents = true;

            continue;
          }

          const match = attr.name.match(rxKeyframeAttribute);
          // console.log("match", match);
          if (match === null) {
            continue;
          }

          const kf = {
            props: attr.value,
            // Point back to the element as well.
            element: el,
            // The name of the event which this keyframe will fire, if emitEvents is
            eventType: attr.name.replace(rxCamelCase, rxCamelCaseFn),
          };

          keyFrames.push(kf);

          const constant = match[1];

          if (constant) {
            // Strip the underscore prefix.
            kf.constant = constant.substr(1);
          }

          // Get the key frame offset.
          const offset = match[2];

          // Is it a percentage offset?
          if (/p$/.test(offset)) {
            kf.isPercentage = true;
            kf.offset = (offset.slice(0, -1) | 0) / 100;
          } else {
            kf.offset = offset | 0;
          }

          const anchor1 = match[3];

          // If second anchor is not set, the first will be taken for both.
          const anchor2 = match[4] || anchor1;

          // "absolute" (or "classic") mode, where numbers mean absolute scroll offset.
          if (!anchor1 || anchor1 === ANCHOR_START || anchor1 === ANCHOR_END) {
            kf.mode = "absolute";

            // data-end needs to be calculated after all key frames are known.
            if (anchor1 === ANCHOR_END) {
              kf.isEnd = true;
            } else if (!kf.isPercentage) {
              // For data-start we can already set the key frame w/o calculations.
              // #59: "scale" options should only affect absolute mode.
              kf.offset *= _scale;
            }
          }
          // "relative" mode, where numbers are relative to anchors.
          else {
            kf.mode = "relative";
            kf.anchors = [anchor1, anchor2];
          }
        }

        // Does this element have key frames?
        if (!keyFrames.length) {
          continue;
        }

        // Will hold the original style and class attributes before we controlled the element (see #80).
        let styleAttr;

        let classAttr;

        let id;

        if (!ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) {
          // We already have this element under control. Grab the corresponding skrollable id.
          id = el[SKROLLABLE_ID_DOM_PROPERTY];
          styleAttr = _skrollables[id].styleAttr;
          classAttr = _skrollables[id].classAttr;
        } else {
          // It's an unknown element. Asign it a new skrollable id.
          id = el[SKROLLABLE_ID_DOM_PROPERTY] = _skrollableIdCounter++;
          styleAttr = el.style.cssText;
          classAttr = _getClass(el);
        }

        _skrollables[id] = {
          element: el,
          styleAttr,
          classAttr,
          anchorTarget,
          keyFrames,
          smoothScrolling: smoothScrollThis,
          edgeStrategy,
          emitEvents,
          lastFrameIndex: -1,
        };

        _updateClass(el, [SKROLLABLE_CLASS], []);
      }

      // Reflow for the first time.
      _reflow();

      // Now that we got all key frame numbers right, actually parse the properties.
      elementIndex = 0;
      elementsLength = elements.length;

      for (; elementIndex < elementsLength; elementIndex++) {
        const sk =
          _skrollables[elements[elementIndex][SKROLLABLE_ID_DOM_PROPERTY]];

        if (sk === undefined) {
          continue;
        }

        // Parse the property string to objects
        _parseProps(sk);

        // Fill key frames with missing properties from left and right
        _fillProps(sk);
      }

      return this;
    }

    /**
     * Transform "relative" mode to "absolute" mode.
     * That is, calculate anchor position and offset of element.
     */
    relativeToAbsolute(element, viewportAnchor, elementAnchor) {
      const viewportHeight = documentElement.clientHeight;
      const box = element.getBoundingClientRect();
      let absolute = box.top;

      // #100: IE doesn't supply "height" with getBoundingClientRect.
      const boxHeight = box.bottom - box.top;

      if (viewportAnchor === ANCHOR_BOTTOM) {
        absolute -= viewportHeight;
      } else if (viewportAnchor === ANCHOR_CENTER) {
        absolute -= viewportHeight / 2;
      }

      if (elementAnchor === ANCHOR_BOTTOM) {
        absolute += boxHeight;
      } else if (elementAnchor === ANCHOR_CENTER) {
        absolute += boxHeight / 2;
      }

      // Compensate scrolling since getBoundingClientRect is relative to viewport.
      absolute += this.getScrollTop();

      return absolute + 0.5 || 0;
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
      _removeAllEvents();

      _updateClass(
        documentElement,
        [NO_SKROLLR_CLASS],
        [SKROLLR_CLASS, SKROLLR_DESKTOP_CLASS, SKROLLR_MOBILE_CLASS]
      );

      let skrollableIndex = 0;
      const skrollablesLength = _skrollables.length;

      for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
        _reset(_skrollables[skrollableIndex].element);
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
      _forceHeight = undefined;
      _maxKeyFrame = 0;
      _scale = 1;
      _constants = undefined;
      _mobileDeceleration = undefined;
      _direction = "down";
      _lastTop = -1;
      _lastViewportWidth = 0;
      _lastViewportHeight = 0;
      _requestReflow = false;
      _scrollAnimation = undefined;
      _smoothScrollingEnabled = undefined;
      _smoothScrollingDuration = undefined;
      _smoothScrolling = undefined;
      _forceRender = undefined;
      _skrollableIdCounter = 0;
      _edgeStrategy = undefined;
      _translateZ = undefined;
    }
  }

  /**
   * Updates key frames which depend on others / need to be updated on resize.
   * That is "end" in "absolute" mode and all key frames in "relative" mode.
   * Also handles constants, because they may change on resize.
   */
  const _updateDependentKeyFrames = () => {
    const viewportHeight = documentElement.clientHeight;
    const processedConstants = _processConstants();
    let skrollable;
    let element;
    let anchorTarget;
    let keyFrames;
    let keyFrameIndex;
    let keyFramesLength;
    let kf;
    let skrollableIndex;
    let skrollablesLength;
    let offset;
    let constantValue;

    // First process all relative-mode elements and find the max key frame.
    skrollableIndex = 0;
    skrollablesLength = _skrollables.length;

    for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
      skrollable = _skrollables[skrollableIndex];
      element = skrollable.element;
      anchorTarget = skrollable.anchorTarget;
      keyFrames = skrollable.keyFrames;

      keyFrameIndex = 0;
      keyFramesLength = keyFrames.length;

      for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
        kf = keyFrames[keyFrameIndex];

        offset = kf.offset;
        constantValue = processedConstants[kf.constant] || 0;

        kf.frame = offset;

        if (kf.isPercentage) {
          // Convert the offset to percentage of the viewport height.
          offset *= viewportHeight;

          // Absolute + percentage mode.
          kf.frame = offset;
        }

        if (kf.mode === "relative") {
          _reset(element);

          kf.frame =
            _instance.relativeToAbsolute(
              anchorTarget,
              kf.anchors[0],
              kf.anchors[1]
            ) - offset;

          _reset(element, true);
        }

        kf.frame += constantValue;

        // Only search for max key frame when forceHeight is enabled.
        if (_forceHeight) {
          // Find the max key frame, but don't use one of the data-end ones for comparison.
          if (!kf.isEnd && kf.frame > _maxKeyFrame) {
            _maxKeyFrame = kf.frame;
          }
        }
      }
    }

    // #133: The document can be larger than the maxKeyFrame we found.
    _maxKeyFrame = Math.max(_maxKeyFrame, _getDocumentHeight());

    // Now process all data-end keyframes.
    skrollableIndex = 0;
    skrollablesLength = _skrollables.length;

    for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
      skrollable = _skrollables[skrollableIndex];
      keyFrames = skrollable.keyFrames;

      keyFrameIndex = 0;
      keyFramesLength = keyFrames.length;

      for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
        kf = keyFrames[keyFrameIndex];

        constantValue = processedConstants[kf.constant] || 0;

        if (kf.isEnd) {
          kf.frame = _maxKeyFrame - kf.offset + constantValue;
        }
      }

      skrollable.keyFrames.sort(_keyFrameComparator);
    }
  };

  /**
   * Calculates and sets the style properties for the element at the given frame.
   * @param fakeFrame The frame to render at when smooth scrolling is enabled.
   * @param actualFrame The actual frame we are at.
   */
  const _calcSteps = (fakeFrame, actualFrame) => {
    // Iterate over all skrollables.
    let skrollableIndex = 0;
    const skrollablesLength = _skrollables.length;

    for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
      const skrollable = _skrollables[skrollableIndex];
      const { element } = skrollable;
      let frame = skrollable.smoothScrolling ? fakeFrame : actualFrame;
      const frames = skrollable.keyFrames;
      const framesLength = frames.length;
      const firstFrame = frames[0];
      const lastFrame = frames[frames.length - 1];
      const beforeFirst = frame < firstFrame.frame;
      const afterLast = frame > lastFrame.frame;
      const firstOrLastFrame = beforeFirst ? firstFrame : lastFrame;
      const { emitEvents } = skrollable;
      const { lastFrameIndex } = skrollable;
      let key;
      let value;

      // If we are before/after the first/last frame, set the styles according to the given edge strategy.
      if (beforeFirst || afterLast) {
        // Check if we already handled this edge case last time.
        // Note: using setScrollTop it's possible that we jumped from one edge to the other.
        if (
          (beforeFirst && skrollable.edge === -1) ||
          (afterLast && skrollable.edge === 1)
        ) {
          continue;
        }

        // Add the skrollr-before or -after class.
        if (beforeFirst) {
          _updateClass(
            element,
            [SKROLLABLE_BEFORE_CLASS],
            [SKROLLABLE_AFTER_CLASS, SKROLLABLE_BETWEEN_CLASS]
          );

          // This handles the special case where we exit the first keyframe.
          if (emitEvents && lastFrameIndex > -1) {
            _emitEvent(element, firstFrame.eventType, _direction);
            skrollable.lastFrameIndex = -1;
          }
        } else {
          _updateClass(
            element,
            [SKROLLABLE_AFTER_CLASS],
            [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_BETWEEN_CLASS]
          );

          // This handles the special case where we exit the last keyframe.
          if (emitEvents && lastFrameIndex < framesLength) {
            _emitEvent(element, lastFrame.eventType, _direction);
            skrollable.lastFrameIndex = framesLength;
          }
        }

        // Remember that we handled the edge case (before/after the first/last keyframe).
        skrollable.edge = beforeFirst ? -1 : 1;

        switch (skrollable.edgeStrategy) {
          case "reset":
            _reset(element);
            continue;
          case "ease":
            // Handle this case like it would be exactly at first/last keyframe and just pass it on.
            frame = firstOrLastFrame.frame;
            break;
          default:
          case "set":
            const { props } = firstOrLastFrame;

            for (key in props) {
              if (hasProp.call(props, key)) {
                value = _interpolateString(props[key].value);

                // Set style or attribute.
                if (key.indexOf("@") === 0) {
                  element.setAttribute(key.substr(1), value);
                } else {
                  skrollr.setStyle(element, key, value);
                }
              }
            }

            continue;
        }
      } else {
        // Did we handle an edge last time?
        if (skrollable.edge !== 0) {
          _updateClass(
            element,
            [SKROLLABLE_CLASS, SKROLLABLE_BETWEEN_CLASS],
            [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_AFTER_CLASS]
          );
          skrollable.edge = 0;
        }
      }

      // Find out between which two key frames we are right now.
      let keyFrameIndex = 0;

      for (; keyFrameIndex < framesLength - 1; keyFrameIndex++) {
        if (
          frame >= frames[keyFrameIndex].frame &&
          frame <= frames[keyFrameIndex + 1].frame
        ) {
          const left = frames[keyFrameIndex];
          const right = frames[keyFrameIndex + 1];

          for (key in left.props) {
            if (hasProp.call(left.props, key)) {
              let progress = (frame - left.frame) / (right.frame - left.frame);

              // Transform the current progress using the given easing function.
              progress = left.props[key].easing(progress);

              // Interpolate between the two values
              value = _calcInterpolation(
                left.props[key].value,
                right.props[key].value,
                progress
              );

              value = _interpolateString(value);

              // Set style or attribute.
              if (key.indexOf("@") === 0) {
                element.setAttribute(key.substr(1), value);
              } else {
                skrollr.setStyle(element, key, value);
              }
            }
          }

          // Are events enabled on this element?
          // This code handles the usual cases of scrolling through different keyframes.
          // The special cases of before first and after last keyframe are handled above.
          if (emitEvents) {
            // Did we pass a new keyframe?
            if (lastFrameIndex !== keyFrameIndex) {
              if (_direction === "down") {
                _emitEvent(element, left.eventType, _direction);
              } else {
                _emitEvent(element, right.eventType, _direction);
              }

              skrollable.lastFrameIndex = keyFrameIndex;
            }
          }

          break;
        }
      }
    }
  };

  /**
   * Renders all elements.
   */
  const _render = () => {
    if (_requestReflow) {
      _requestReflow = false;
      _reflow();
    }

    // We may render something else than the actual scrollbar position.
    let renderTop = _instance.getScrollTop();

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
        renderTop > _lastTop
          ? "down"
          : renderTop < _lastTop
          ? "up"
          : _direction;

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
        _calcSteps(renderTop, _instance.getScrollTop());

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

  /**
   * Parses the properties for each key frame of the given skrollable.
   */
  const _parseProps = ({ keyFrames }) => {
    // Iterate over all key frames
    let keyFrameIndex = 0;
    const keyFramesLength = keyFrames.length;

    for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
      const frame = keyFrames[keyFrameIndex];
      let easing;
      let value;
      let prop;
      const props = {};

      let match;

      while ((match = rxPropValue.exec(frame.props)) !== null) {
        prop = match[1];
        value = match[2];

        easing = prop.match(rxPropEasing);

        // Is there an easing specified for this prop?
        if (easing !== null) {
          prop = easing[1];
          easing = easing[2];
        } else {
          easing = DEFAULT_EASING;
        }

        // Exclamation point at first position forces the value to be taken literal.
        value = value.indexOf("!") ? _parseProp(value) : [value.slice(1)];

        // Save the prop for this key frame with his value and easing function
        props[prop] = {
          value,
          easing: easings[easing],
        };
      }

      frame.props = props;
    }
  };

  /**
   * Parses a value extracting numeric values and generating a format string
   * for later interpolation of the new values in old string.
   *
   * @param val The CSS value to be parsed.
   * @return Something like ["rgba(?%,?%, ?%,?)", 100, 50, 0, .7]
   * where the first element is the format string later used
   * and all following elements are the numeric value.
   */
  const _parseProp = (val) => {
    const numbers = [];

    // One special case, where floats don't work.
    // We replace all occurences of rgba colors
    // which don't use percentage notation with the percentage notation.
    rxRGBAIntegerColor.lastIndex = 0;
    val = val.replace(rxRGBAIntegerColor, (rgba) =>
      rgba.replace(rxNumericValue, (n) => `${(n / 255) * 100}%`)
    );

    // Handle prefixing of "gradient" values.
    // For now only the prefixed value will be set. Unprefixed isn't supported anyway.
    if (theDashedCSSPrefix) {
      rxGradient.lastIndex = 0;
      val = val.replace(rxGradient, (s) => theDashedCSSPrefix + s);
    }

    // Now parse ANY number inside this string and create a format string.
    val = val.replace(rxNumericValue, (n) => {
      numbers.push(+n);
      return "{?}";
    });

    // Add the formatstring as first value.
    numbers.unshift(val);

    return numbers;
  };

  const _fillPropForFrame = ({ props }, propList) => {
    let key;

    // For each key frame iterate over all right hand properties and assign them,
    // but only if the current key frame doesn't have the property by itself
    for (key in propList) {
      // The current frame misses this property, so assign it.
      if (!hasProp.call(props, key)) {
        props[key] = propList[key];
      }
    }

    // Iterate over all props of the current frame and collect them
    for (key in props) {
      propList[key] = props[key];
    }
  };

  /**
   * Fills the key frames with missing left and right hand properties.
   * If key frame 1 has property X and key frame 2 is missing X,
   * but key frame 3 has X again, then we need to assign X to key frame 2 too.
   *
   * @param sk A skrollable.
   */
  const _fillProps = ({ keyFrames }) => {
    // Will collect the properties key frame by key frame
    let propList = {};
    let keyFrameIndex;

    // Iterate over all key frames from left to right
    keyFrameIndex = 0;
    const keyFramesLength = keyFrames.length;

    for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
      _fillPropForFrame(keyFrames[keyFrameIndex], propList);
    }

    // Now do the same from right to fill the last gaps

    propList = {};

    // Iterate over all key frames from right to left
    keyFrameIndex = keyFrames.length - 1;

    for (; keyFrameIndex >= 0; keyFrameIndex--) {
      _fillPropForFrame(keyFrames[keyFrameIndex], propList);
    }
  };

  /**
   * Calculates the new values for two given values array.
   */
  const _calcInterpolation = (val1, val2, progress) => {
    let valueIndex;
    const val1Length = val1.length;

    // They both need to have the same length
    if (val1Length !== val2.length) {
      throw `Can't interpolate between "${val1[0]}" and "${val2[0]}"`;
    }

    // Add the format string as first element.
    const interpolated = [val1[0]];

    valueIndex = 1;

    for (; valueIndex < val1Length; valueIndex++) {
      // That's the line where the two numbers are actually interpolated.
      interpolated[valueIndex] =
        val1[valueIndex] + (val2[valueIndex] - val1[valueIndex]) * progress;
    }

    return interpolated;
  };

  /**
   * Interpolates the numeric values into the format string.
   */
  const _interpolateString = (val) => {
    let valueIndex = 1;

    rxInterpolateString.lastIndex = 0;

    return val[0].replace(rxInterpolateString, () => val[valueIndex++]);
  };

  /**
   * Resets the class and style attribute to what it was before skrollr manipulated the element.
   * Also remembers the values it had before reseting, in order to undo the reset.
   */
  const _reset = (elementsS, undo) => {
    // We accept a single element or an array of elements.
    const elements = [].concat(elementsS);

    let skrollable;
    let element;
    let elementsIndex = 0;
    const elementsLength = elements.length;

    for (; elementsIndex < elementsLength; elementsIndex++) {
      element = elements[elementsIndex];
      skrollable = _skrollables[element[SKROLLABLE_ID_DOM_PROPERTY]];

      // Couldn't find the skrollable for this DOM element.
      if (!skrollable) {
        continue;
      }

      if (undo) {
        // Reset class and style to the "dirty" (set by skrollr) values.
        element.style.cssText = skrollable.dirtyStyleAttr;
        _updateClass(element, skrollable.dirtyClassAttr);
      } else {
        // Remember the "dirty" (set by skrollr) class and style.
        skrollable.dirtyStyleAttr = element.style.cssText;
        skrollable.dirtyClassAttr = _getClass(element);

        // Reset class and style to what it originally was.
        element.style.cssText = skrollable.styleAttr;
        _updateClass(element, skrollable.classAttr);
      }
    }
  };

  /**
   * Set the CSS property on the given element. Sets prefixed properties as well.
   */
  skrollr.setStyle = (el, propS, val) => {
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
        // Set prefixed property if there's a prefix.
        if (theCSSPrefix) {
          style[
            theCSSPrefix + prop.slice(0, 1).toUpperCase() + prop.slice(1)
          ] = val;
        }

        // Set unprefixed.
        style[prop] = val;
      } catch (ignore) {
        console.log("ignore", ignore);
      }
    }
  };

  return skrollr;
};

export default skrollrFunc;
