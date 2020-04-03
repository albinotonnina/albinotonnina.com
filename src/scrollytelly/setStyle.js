const rxCamelCase = /-([a-z0-9_])/g;
const rxCamelCaseFn = (str, letter) => letter.toUpperCase();

const setStyle = (el, propS, val) => {
  const { style } = el;

  // Camel case.
  const prop = propS.replace(rxCamelCase, rxCamelCaseFn).replace("-", "");

  // Make sure z-index gets a <integer>.
  // This is the only <integer> case we need to handle.
  if (prop === "zIndex") {
    if (Math.isNaN(val)) {
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
};

export default setStyle;
