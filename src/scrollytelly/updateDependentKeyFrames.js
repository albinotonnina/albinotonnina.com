/**
 * Updates key frames which depend on others / need to be updated on resize.
 * That is "end" in "absolute" mode and all key frames in "relative" mode.
 * Also handles constants, because they may change on resize.
 */
const updateDependentKeyFrames = (scrollables) => {
  let maxKeyFrame = 0;

  scrollables.forEach((scrollable) => {
    scrollable.keyFrames.forEach((kf) => {
      kf.frame = kf.offset;
      maxKeyFrame = kf.frame;
    });
  });

  return maxKeyFrame;
};

export default updateDependentKeyFrames;
