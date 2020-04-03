import updateClass from "./updateClass";
import getClass from "./getClass";

const SCROLLABLE_ID_DOM_PROPERTY = "___scrollable_id";

/**
 * Resets the class and style attribute to what it was before we manipulated the element.
 * Also remembers the values it had before reseting, in order to undo the reset.
 */
const reset = (scrollables, elementsS) => {
  // We accept a single element or an array of elements.
  const elements = [].concat(elementsS);

  let scrollable;
  let element;
  let elementsIndex = 0;
  const elementsLength = elements.length;

  for (; elementsIndex < elementsLength; elementsIndex++) {
    element = elements[elementsIndex];
    scrollable = scrollables[element[SCROLLABLE_ID_DOM_PROPERTY]];

    // Couldn't find the scrollable for this DOM element.
    if (!scrollable) {
      continue;
    }

    scrollable.dirtyStyleAttr = element.style.cssText;
    scrollable.dirtyClassAttr = getClass(element);

    // Reset class and style to what it originally was.
    element.style.cssText = scrollable.styleAttr;
    updateClass(element, scrollable.classAttr);
  }
};

export default reset;
