const ANCHOR_CENTER = "center";
const ANCHOR_BOTTOM = "bottom";

/**
 * Transform "relative" mode to "absolute" mode.
 * That is, calculate anchor position and offset of element.
 */
const relativeToAbsolute = (
  element,
  viewportAnchor,
  elementAnchor,
  viewportHeight
) => {
  const box = element.getBoundingClientRect();
  let absolute = box.top;

  // #100: IE doesn't supply "height" with getBoundingClientRect.
  const boxHeight = box.bottom - box.top;

  if (viewportAnchor === ANCHOR_BOTTOM) {
    absolute -= viewportHeight;
  } else if (viewportAnchor === ANCHOR_CENTER) {
    absolute -= viewportHeight / 2;
  }

  if (elementAnchor === ANCHOR_BOTTOM) {
    absolute += boxHeight;
  } else if (elementAnchor === ANCHOR_CENTER) {
    absolute += boxHeight / 2;
  }

  // Compensate scrolling since getBoundingClientRect is relative to viewport.
  absolute += this.getScrollTop();

  return absolute + 0.5 || 0;
};

export default relativeToAbsolute;
