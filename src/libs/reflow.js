import relativeToAbsolute from "./relativeToAbsolute";
import reset from "./reset";
// /*
//  * Returns a copy of the constants object where all functions and strings have been evaluated.
//  */
// const processConstants = () => {
//   const viewportHeight = documentElement.clientHeight;
//   const copy = {};
//   let prop;
//   let value;

//   return copy;
// };

const keyFrameComparator = ({ frame }, { frame: frameB }) => frame - frameB;

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
  const viewportHeight = documentElement.clientHeight;

  let maxKeyFrame = 0;

  let skrollable;
  let element;
  let anchorTarget;
  let keyFrames;
  let keyFrameIndex;
  let keyFramesLength;
  let kf;
  let skrollableIndex;
  let skrollablesLength;
  let offset;
  let constantValue;

  // First process all relative-mode elements and find the max key frame.
  skrollableIndex = 0;

  skrollablesLength = _skrollables.length;

  for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
    skrollable = _skrollables[skrollableIndex];
    element = skrollable.element;
    anchorTarget = skrollable.anchorTarget;
    keyFrames = skrollable.keyFrames;

    keyFrameIndex = 0;
    keyFramesLength = keyFrames.length;

    for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
      kf = keyFrames[keyFrameIndex];

      offset = kf.offset;
      constantValue = 0;

      kf.frame = offset;

      if (kf.isPercentage) {
        // Convert the offset to percentage of the viewport height.
        offset *= viewportHeight;

        // Absolute + percentage mode.
        kf.frame = offset;
      }

      if (kf.mode === "relative") {
        reset(_skrollables, element);

        kf.frame =
          relativeToAbsolute(
            anchorTarget,
            kf.anchors[0],
            kf.anchors[1],
            documentElement.clientHeight
          ) - offset;

        _reset(element, true);
      }

      kf.frame += constantValue;

      // Find the max key frame, but don't use one of the data-end ones for comparison.
      if (!kf.isEnd && kf.frame > maxKeyFrame) {
        maxKeyFrame = kf.frame;
      }
    }
  }

  // #133: The document can be larger than the maxKeyFrame we found.
  const _maxKeyFrame = Math.max(
    maxKeyFrame,
    getDocumentHeight(documentElement)
  );

  // Now process all data-end keyframes.
  skrollableIndex = 0;
  skrollablesLength = _skrollables.length;

  for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
    skrollable = _skrollables[skrollableIndex];
    keyFrames = skrollable.keyFrames;

    keyFrameIndex = 0;
    keyFramesLength = keyFrames.length;

    for (; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
      kf = keyFrames[keyFrameIndex];

      constantValue = 0;

      if (kf.isEnd) {
        kf.frame = _maxKeyFrame - kf.offset + constantValue;
      }
    }

    skrollable.keyFrames.sort(keyFrameComparator);
  }

  return _maxKeyFrame;
};

const reflow = (_instance, skrollables, documentElement) => {
  const pos = _instance.getScrollTop();

  // un-"force" the height to not mess with the calculations in updateDependentKeyFrames (#216).
  document.body.style.height = "";

  const _maxKeyFrame = updateDependentKeyFrames(skrollables, documentElement);

  // "force" the height.
  document.body.style.height = `${
    _maxKeyFrame + documentElement.clientHeight
  }px`;

  // Remember and reset the scroll pos
  _instance.setScrollTop(pos, true);

  return _maxKeyFrame;
};

export default reflow;
