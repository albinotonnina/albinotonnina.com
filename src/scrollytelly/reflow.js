import updateDependentKeyFrames from "./updateDependentKeyFrames";

const setScrollTop = (top) => {
  window.scrollTo(0, top);
};

const getScrollTop = () =>
  window.pageYOffset ||
  document.documentElement.scrollTop ||
  document.body.scrollTop ||
  0;

const reflow = (scrollables) => {
  // un-"force" the height to not mess with the calculations in updateDependentKeyFrames (#216).
  document.body.style.height = "";

  const maxKeyFrame = updateDependentKeyFrames(scrollables);

  // "force" the height.
  document.body.style.height = `${
    maxKeyFrame + document.documentElement.clientHeight
  }px`;

  // Remember and reset the scroll pos
  setScrollTop(getScrollTop());

  return maxKeyFrame;
};

export default reflow;
