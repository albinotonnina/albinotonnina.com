import updateDependentKeyFrames from "./updateDependentKeyFrames";

const reflow = (_instance, skrollables, documentElement) => {
  const pos = _instance.getScrollTop();

  // un-"force" the height to not mess with the calculations in updateDependentKeyFrames (#216).
  document.body.style.height = "";

  const maxKeyFrame = updateDependentKeyFrames(skrollables, documentElement);

  // "force" the height.
  document.body.style.height = `${
    maxKeyFrame + documentElement.clientHeight
  }px`;

  // Remember and reset the scroll pos
  _instance.setScrollTop(pos);

  return maxKeyFrame;
};

export default reflow;
