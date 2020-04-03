// Numeric values with optional sign.
const rxNumericValue = /[\-+]?[\d]*\.?[\d]+/g;
// Finds all gradients.
const rxGradient = /[a-z\-]+-gradient/g;

// Finds rgb(a) colors, which don't use the percentage notation.
const rxRGBAIntegerColor = /rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g;

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

export default parseProp;
