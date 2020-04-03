import getClass from "./getClass";
import updateClass from "./updateClass";
import easings from "./easings";
import reflow from "./reflow";

const hasProp = Object.prototype.hasOwnProperty;

const DEFAULT_EASING = "linear";

// Numeric values with optional sign.
const rxNumericValue = /[\-+]?[\d]*\.?[\d]+/g;

// Easing function names follow the property in square brackets.
const rxPropEasing = /^(@?[a-z\-]+)\[(\w+)\]$/;

const rxPropValue = /\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi;

// Find all data-attributes. data-[_constant]-[offset]-[anchor]-[anchor].
const rxKeyframeAttribute = /^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/;

// Finds all gradients.
const rxGradient = /[a-z\-]+-gradient/g;

// Finds rgb(a) colors, which don't use the percentage notation.
const rxRGBAIntegerColor = /rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g;

// The property which will be added to the DOM element to hold the ID of the skrollable.
const SKROLLABLE_ID_DOM_PROPERTY = "___skrollable_id";
const SKROLLABLE_CLASS = "skrollable";
const rxCamelCase = /-([a-z0-9_])/g;
const rxCamelCaseFn = (str, letter) => letter.toUpperCase();

const ANCHOR_START = "start";
const ANCHOR_END = "end";

const scale = 1;

const skrollableIdCounter = 0;

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
const fillProps = ({ keyFrames }) => {
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
 * Parses the properties for each key frame of the given skrollable.
 */
const parseProps = ({ keyFrames }) => {
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
      value = value.indexOf("!") ? parseProp(value) : [value.slice(1)];

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
const parseProp = (val) => {
  const numbers = [];

  // One special case, where floats don't work.
  // We replace all occurences of rgba colors
  // which don't use percentage notation with the percentage notation.
  rxRGBAIntegerColor.lastIndex = 0;
  val = val.replace(rxRGBAIntegerColor, (rgba) =>
    rgba.replace(rxNumericValue, (n) => `${(n / 255) * 100}%`)
  );

  const theDashedCSSPrefix = "";

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

// const refresh = (
//   elements,
//   skrollables,
//   _instance,
//   documentElement,
//   _maxKeyFrame,
//   _forceRender
// ) => {
//   let elementIndex;
//   let elementsLength;
//   let ignoreID = false;

//   // Completely reparse anything without argument.
//   if (elements === undefined) {
//     // Ignore that some elements may already have a skrollable ID.
//     ignoreID = true;

//     skrollables = [];
//     skrollableIdCounter = 0;

//     elements = document.getElementsByTagName("*");
//   } else if (elements.length === undefined) {
//     // We also accept a single element as parameter.
//     elements = [elements];
//   }

//   elementIndex = 0;
//   elementsLength = elements.length;

//   for (; elementIndex < elementsLength; elementIndex++) {
//     const el = elements[elementIndex];
//     let anchorTarget = el;
//     const keyFrames = [];

//     // If this particular element should be smooth scrolled.
//     let smoothScrollThis = true;

//     // If this particular element should emit keyframe events.
//     let emitEvents = false;

//     // If we're reseting the counter, remove any old element ids that may be hanging around.
//     if (ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) {
//       delete el[SKROLLABLE_ID_DOM_PROPERTY];
//     }

//     if (!el.attributes) {
//       continue;
//     }

//     // Iterate over all attributes and search for key frame attributes.
//     let attributeIndex = 0;
//     const attributesLength = el.attributes.length;

//     for (; attributeIndex < attributesLength; attributeIndex++) {
//       const attr = el.attributes[attributeIndex];

//       if (attr.name === "data-anchor-target") {
//         anchorTarget = document.querySelector(attr.value);

//         if (anchorTarget === null) {
//           throw `Unable to find anchor target "${attr.value}"`;
//         }

//         continue;
//       }

//       // Global smooth scrolling can be overridden by the element attribute.
//       if (attr.name === "data-smooth-scrolling") {
//         smoothScrollThis = attr.value !== "off";

//         continue;
//       }

//       // Is this element tagged with the `data-emit-events` attribute?
//       if (attr.name === "data-emit-events") {
//         emitEvents = true;

//         continue;
//       }

//       const match = attr.name.match(rxKeyframeAttribute);
//       // console.log("match", match);
//       if (match === null) {
//         continue;
//       }

//       const kf = {
//         props: attr.value,
//         // Point back to the element as well.
//         element: el,
//         // The name of the event which this keyframe will fire, if emitEvents is
//         eventType: attr.name.replace(rxCamelCase, rxCamelCaseFn),
//       };

//       keyFrames.push(kf);

//       const constant = match[1];

//       if (constant) {
//         // Strip the underscore prefix.
//         kf.constant = constant.substr(1);
//       }

//       // Get the key frame offset.
//       const offset = match[2];

//       // Is it a percentage offset?
//       if (/p$/.test(offset)) {
//         kf.isPercentage = true;
//         kf.offset = (offset.slice(0, -1) || 0) / 100;
//       } else {
//         kf.offset = offset || 0;
//       }

//       const anchor1 = match[3];

//       // If second anchor is not set, the first will be taken for both.
//       const anchor2 = match[4] || anchor1;

//       // "absolute" (or "classic") mode, where numbers mean absolute scroll offset.
//       if (!anchor1 || anchor1 === ANCHOR_START || anchor1 === ANCHOR_END) {
//         kf.mode = "absolute";

//         // data-end needs to be calculated after all key frames are known.
//         if (anchor1 === ANCHOR_END) {
//           kf.isEnd = true;
//         } else if (!kf.isPercentage) {
//           // For data-start we can already set the key frame w/o calculations.
//           // #59: "scale" options should only affect absolute mode.
//           kf.offset *= scale;
//         }
//       }
//       // "relative" mode, where numbers are relative to anchors.
//       else {
//         kf.mode = "relative";
//         kf.anchors = [anchor1, anchor2];
//       }
//     }

//     // Does this element have key frames?
//     if (!keyFrames.length) {
//       continue;
//     }

//     // Will hold the original style and class attributes before we controlled the element (see #80).
//     let styleAttr;

//     let classAttr;

//     let id;

//     if (!ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) {
//       // We already have this element under control. Grab the corresponding skrollable id.
//       id = el[SKROLLABLE_ID_DOM_PROPERTY];
//       styleAttr = skrollables[id].styleAttr;
//       classAttr = skrollables[id].classAttr;
//     } else {
//       // It's an unknown element. Asign it a new skrollable id.

//       const count = skrollableIdCounter++;

//       id = count;
//       id = count;
//       styleAttr = el.style.cssText;
//       classAttr = getClass(el);
//     }

//     skrollables[id] = {
//       element: el,
//       styleAttr,
//       classAttr,
//       anchorTarget,
//       keyFrames,
//       smoothScrolling: smoothScrollThis,

//       emitEvents,
//       lastFrameIndex: -1,
//     };

//     updateClass(el, [SKROLLABLE_CLASS], []);
//   }

//   // Reflow for the first time.
//   reflow(_instance, skrollables, documentElement, _maxKeyFrame, _forceRender);

//   // Now that we got all key frame numbers right, actually parse the properties.
//   elementIndex = 0;
//   elementsLength = elements.length;

//   for (; elementIndex < elementsLength; elementIndex++) {
//     const sk = skrollables[elements[elementIndex][SKROLLABLE_ID_DOM_PROPERTY]];

//     if (sk === undefined) {
//       continue;
//     }

//     // Parse the property string to objects
//     parseProps(sk);

//     // Fill key frames with missing properties from left and right
//     _fillProps(sk);
//   }

//   return skrollables;
// };

const refresh = (
  elements,
  skrollables,
  _instance,
  documentElement,
  _maxKeyFrame,
  _forceRender
) => {
  let elementIndex;
  let elementsLength;
  let ignoreID = false;
  let _skrollableIdCounter = 0;

  // Completely reparse anything without argument.
  if (elements === undefined) {
    // Ignore that some elements may already have a skrollable ID.
    ignoreID = true;

    skrollables = [];

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
    let smoothScrollThis = true;

    // The edge strategy for this particular element.
    let edgeStrategy = "ease";

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
          kf.offset *= scale;
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
      styleAttr = skrollables[id].styleAttr;
      classAttr = skrollables[id].classAttr;
    } else {
      // It's an unknown element. Asign it a new skrollable id.
      id = el[SKROLLABLE_ID_DOM_PROPERTY] = _skrollableIdCounter++;
      styleAttr = el.style.cssText;
      classAttr = getClass(el);
    }

    skrollables[id] = {
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

    updateClass(el, [SKROLLABLE_CLASS], []);
  }

  // Reflow for the first time.
  reflow(_instance, skrollables, documentElement);
  _forceRender = true;
  // Now that we got all key frame numbers right, actually parse the properties.
  elementIndex = 0;
  elementsLength = elements.length;

  for (; elementIndex < elementsLength; elementIndex++) {
    const sk = skrollables[elements[elementIndex][SKROLLABLE_ID_DOM_PROPERTY]];

    if (sk === undefined) {
      continue;
    }

    // Parse the property string to objects
    parseProps(sk);

    // Fill key frames with missing properties from left and right
    fillProps(sk);
  }

  return skrollables;
};

export default refresh;
