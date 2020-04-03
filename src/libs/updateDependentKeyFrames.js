/**
 * Updates key frames which depend on others / need to be updated on resize.
 * That is "end" in "absolute" mode and all key frames in "relative" mode.
 * Also handles constants, because they may change on resize.
 */
const updateDependentKeyFrames = (_skrollables) => {
  let maxKeyFrame = 0;

  _skrollables.forEach((skrollable) => {
    skrollable.keyFrames.forEach((kf) => {
      kf.frame = kf.offset;
      maxKeyFrame = kf.frame;
    });
  });

  return maxKeyFrame;
};

export default updateDependentKeyFrames;
