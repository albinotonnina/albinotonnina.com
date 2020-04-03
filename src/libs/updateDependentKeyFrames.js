/*
 * Returns the height of the document.
 */
const getDocumentHeight = (documentElement) => {
  const skrollrBodyHeight = 0;
  const bodyHeight = Math.max(
    skrollrBodyHeight,
    document.body.scrollHeight,
    document.body.offsetHeight,
    documentElement.scrollHeight,
    documentElement.offsetHeight,
    documentElement.clientHeight
  );

  return bodyHeight - documentElement.clientHeight;
};

/**
 * Updates key frames which depend on others / need to be updated on resize.
 * That is "end" in "absolute" mode and all key frames in "relative" mode.
 * Also handles constants, because they may change on resize.
 */
const updateDependentKeyFrames = (_skrollables, documentElement) => {
  let maxKeyFrame = 0;

  _skrollables.forEach((skrollable) => {
    skrollable.keyFrames.forEach((kf) => {
      kf.frame = kf.offset;
      maxKeyFrame = kf.frame;
    });
  });

  maxKeyFrame = Math.max(maxKeyFrame, getDocumentHeight(documentElement));

  return maxKeyFrame;
};

export default updateDependentKeyFrames;
