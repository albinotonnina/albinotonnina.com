import updateClass from "./updateClass";
import parseProps from "./parseProps";
import fillProps from "./fillProps";
// Find all data-attributes. data-[_constant]-[offset]-[anchor]-[anchor].
const rxKeyframeAttribute = /^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/;

// The property which will be added to the DOM element to hold the ID of the scrollable.
const SCROLLABLE_ID_DOM_PROPERTY = "___scrollable_id";
const SCROLLABLE_CLASS = "scrollable";

const processProps = () => {
  let scrollableIdCounter = 0;

  const scrollables = [];

  const elements = document.getElementsByTagName("*");

  [...elements].forEach((element) => {
    const keyFrames = [];

    // Iterate over all attributes and search for key frame attributes.
    [...element.attributes].forEach((attr) => {
      const [id, , offset] = attr.name.match(rxKeyframeAttribute) || [];
      if (id) {
        const kf = {
          props: attr.value,
          element,
        };
        keyFrames.push(kf);
        kf.offset = parseInt(offset, 0) || 0;
      }
    });

    // Does this element have key frames?
    if (keyFrames.length) {
      // Will hold the original style and class attributes before we controlled the element (see #80).
      // It's an unknown element. Asign it a new scrollable id.
      element[SCROLLABLE_ID_DOM_PROPERTY] = scrollableIdCounter++;
      const id = element[SCROLLABLE_ID_DOM_PROPERTY];

      scrollables[id] = {
        element,
        keyFrames,
      };

      updateClass(element, [SCROLLABLE_CLASS], []);
    }
  });

  // Now that we got all key frame numbers right, actually parse the properties.
  [...elements]
    .map((element) => scrollables[element[SCROLLABLE_ID_DOM_PROPERTY]])
    .filter((scrollable) => scrollable)
    .forEach((scrollable) => {
      // Parse the property string to objects
      parseProps(scrollable);
      // Fill key frames with missing properties from left and right
      fillProps(scrollable);
    });

  scrollables.forEach((scrollable) => {
    scrollable.keyFrames.forEach((kf) => {
      kf.frame = kf.offset;
    });
  });

  return scrollables;
};

export default processProps;
