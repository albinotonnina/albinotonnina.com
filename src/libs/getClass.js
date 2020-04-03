/**
 * Returns a string of space separated classnames for the current element.
 * Works with SVG as well.
 */
const getClass = (element) => {
  let prop = "className";

  // SVG support by using className.baseVal instead of just className.
  if (window.SVGElement && element instanceof window.SVGElement) {
    element = element[prop];
    prop = "baseVal";
  }

  return element[prop];
};

export default getClass;
