import updateClass from "./updateClass";
import getClass from "./getClass";
/**
 * Resets the class and style attribute to what it was before skrollr manipulated the element.
 * Also remembers the values it had before reseting, in order to undo the reset.
 */
const reset = (_skrollables, elementsS, undo) => {
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
      updateClass(element, skrollable.dirtyClassAttr);
    } else {
      // Remember the "dirty" (set by skrollr) class and style.
      skrollable.dirtyStyleAttr = element.style.cssText;
      skrollable.dirtyClassAttr = getClass(element);

      // Reset class and style to what it originally was.
      element.style.cssText = skrollable.styleAttr;
      updateClass(element, skrollable.classAttr);
    }
  }
};

export default reset;
