import parseProp from "./parseProp";
import easings from "./easings";

const DEFAULT_EASING = "linear";

// Easing function names follow the property in square brackets.
const rxPropEasing = /^(@?[a-z-]+)\[(\w+)\]$/;

const rxPropValue = /\s*(@?[\w\-[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi;
/**
 * Parses the properties for each key frame of the given scrollable.
 */
const parseProps = ({ keyFrames }) => {
  keyFrames.forEach((frame) => {
    let easing;
    // let value;
    // let prop;
    const props = {};

    let match;

    while ((match = rxPropValue.exec(frame.props)) !== null) {
      // prop = match[1];
      // value = match[2];

      let [, prop, value] = match;

      easing = prop.match(rxPropEasing);

      // Is there an easing specified for this prop?

      if (easing !== null) {
        [, prop, easing] = easing;
      } else {
        easing = DEFAULT_EASING;
      }

      // Exclamation point at first position forces the value to be taken literal.
      value = value.indexOf("!") ? parseProp(value) : [value.slice(1)];

      // Save the prop for this key frame with his value and easing function
      props[prop] = {
        value,
        easing: easings[DEFAULT_EASING],
      };
    }

    frame.props = props;
  });
};

export default parseProps;
