const rxTrim = /^\s+|\s+$/g;

const untrim = (a) => ` ${a} `;

const trim = (a) => a.replace(rxTrim, "");

/**
 * Adds and removes a CSS classes.
 * Works with SVG as well.
 * add and remove are arrays of strings,
 * or if remove is ommited add is a string and overwrites all classes.
 */
const updateClass = (element, add, remove) => {
  let prop = "className";
  let el = element;
  // SVG support by using className.baseVal instead of just className.
  if (window.SVGElement && element instanceof window.SVGElement) {
    el = element[prop];
    prop = "baseVal";
  }

  // When remove is ommited, we want to overwrite/set the classes.
  if (remove === undefined) {
    el[prop] = add;
    return;
  }

  // Cache current classes. We will work on a string before passing back to DOM.
  let val = el[prop];

  // All classes to be removed.
  let classRemoveIndex = 0;
  const removeLength = remove.length;

  for (; classRemoveIndex < removeLength; classRemoveIndex++) {
    val = untrim(val).replace(untrim(remove[classRemoveIndex]), " ");
  }

  val = trim(val);

  // All classes to be added.
  let classAddIndex = 0;
  const addLength = add.length;

  for (; classAddIndex < addLength; classAddIndex++) {
    // Only add if el not already has class.
    if (!untrim(val).includes(untrim(add[classAddIndex]))) {
      val += ` ${add[classAddIndex]}`;
    }
  }

  el[prop] = trim(val);
};

export default updateClass;
