// Numeric values with optional sign.
const rxNumericValue = /[-+]?[\d]*\.?[\d]+/g;

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
  // rxRGBAIntegerColor.lastIndex = 0;
  // val = val.replace(rxRGBAIntegerColor, (rgba) =>
  //   rgba.replace(rxNumericValue, (n) => `${(n / 255) * 100}%`)
  // );

  // Now parse ANY number inside this string and create a format string.
  // val = val.replace(rxNumericValue, (n) => {
  //   numbers.push(+n);
  //   return "{?}";
  // });

  // Add the formatstring as first value.
  numbers.unshift(
    val.replace(rxNumericValue, (n) => {
      numbers.push(+n);
      return "{?}";
    })
  );

  return numbers;
};

export default parseProp;
