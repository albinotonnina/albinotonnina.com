import getClass from "./getClass";
import updateClass from "./updateClass";
import reflow from "./reflow";
import parseProps from "./parseProps";
import fillProps from "./fillProps";
// Find all data-attributes. data-[_constant]-[offset]-[anchor]-[anchor].
const rxKeyframeAttribute = /^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/;

// The property which will be added to the DOM element to hold the ID of the skrollable.
const SKROLLABLE_ID_DOM_PROPERTY = "___skrollable_id";
const SKROLLABLE_CLASS = "skrollable";
const rxCamelCase = /-([a-z0-9_])/g;
const rxCamelCaseFn = (str, letter) => letter.toUpperCase();

const scale = 1;

const refresh = () => {
  let skrollableIdCounter = 0;
  // Ignore that some elements may already have a skrollable ID.

  const skrollables = [];

  const elements = document.getElementsByTagName("*");

  [...elements].forEach((element) => {
    // const el = elements[elementIndex];

    const keyFrames = [];

    // Iterate over all attributes and search for key frame attributes.
    [...element.attributes].forEach((attr) => {
      const match = attr.name.match(rxKeyframeAttribute);
      // console.log("match", match);
      if (match === null) {
        return;
      }

      const kf = {
        props: attr.value,
        // Point back to the element as well.
        element,
        // The name of the event which this keyframe will fire, if emitEvents is
        eventType: attr.name.replace(rxCamelCase, rxCamelCaseFn),
      };

      keyFrames.push(kf);

      const offset = match[2];

      kf.offset = offset * scale || 0;
    });

    // Does this element have key frames?
    if (keyFrames.length) {
      // Will hold the original style and class attributes before we controlled the element (see #80).
      // It's an unknown element. Asign it a new skrollable id.
      element[SKROLLABLE_ID_DOM_PROPERTY] = skrollableIdCounter++;
      const id = element[SKROLLABLE_ID_DOM_PROPERTY];
      const styleAttr = element.style.cssText;
      const classAttr = getClass(element);

      skrollables[id] = {
        element,
        styleAttr,
        classAttr,

        keyFrames,
      };

      updateClass(element, [SKROLLABLE_CLASS], []);
    }
  });

  // Reflow for the first time.
  reflow(skrollables);

  // Now that we got all key frame numbers right, actually parse the properties.
  [...elements]
    .map((element) => skrollables[element[SKROLLABLE_ID_DOM_PROPERTY]])
    .filter((skrollable) => skrollable)
    .forEach((skrollable) => {
      // Parse the property string to objects
      parseProps(skrollable);
      // Fill key frames with missing properties from left and right
      fillProps(skrollable);
    });

  return skrollables;
};

export default refresh;
