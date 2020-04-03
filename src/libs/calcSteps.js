import calcInterpolation from "./calcInterpolation";
import updateClass from "./updateClass";

const SKROLLABLE_CLASS = "skrollable";
const SKROLLABLE_BEFORE_CLASS = `${SKROLLABLE_CLASS}-before`;
const SKROLLABLE_BETWEEN_CLASS = `${SKROLLABLE_CLASS}-between`;
const SKROLLABLE_AFTER_CLASS = `${SKROLLABLE_CLASS}-after`;

// Used to replace occurences of {?} with a number.
const rxInterpolateString = /\{\?\}/g;

/**
 * Interpolates the numeric values into the format string.
 */
const interpolateString = (val) => {
  let valueIndex = 1;

  rxInterpolateString.lastIndex = 0;

  return val[0].replace(rxInterpolateString, () => val[valueIndex++]);
};

/**
 * Calculates and sets the style properties for the element at the given frame.
 * @param fakeFrame The frame to render at
 */
const calcSteps = (_instance, fakeFrame, _skrollables, _direction) => {
  _skrollables.forEach((skrollable) => {
    const { element } = skrollable;
    let frame = fakeFrame;
    const frames = skrollable.keyFrames;
    const firstFrame = frames[0];
    const lastFrame = frames[frames.length - 1];
    const beforeFirst = frame < firstFrame.frame;
    const afterLast = frame > lastFrame.frame;
    const firstOrLastFrame = beforeFirst ? firstFrame : lastFrame;

    // If we are before/after the first/last frame, set the styles according to the given edge strategy.
    if (beforeFirst || afterLast) {
      // Check if we already handled this edge case last time.
      // Note: using setScrollTop it's possible that we jumped from one edge to the other.
      if (
        (beforeFirst && skrollable.edge === -1) ||
        (afterLast && skrollable.edge === 1)
      ) {
        return;
      }

      // Add the skrollr-before or -after class.
      if (beforeFirst) {
        updateClass(
          element,
          [SKROLLABLE_BEFORE_CLASS],
          [SKROLLABLE_AFTER_CLASS, SKROLLABLE_BETWEEN_CLASS]
        );
      } else {
        updateClass(
          element,
          [SKROLLABLE_AFTER_CLASS],
          [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_BETWEEN_CLASS]
        );
      }

      // Remember that we handled the edge case (before/after the first/last keyframe).
      skrollable.edge = beforeFirst ? -1 : 1;

      frame = firstOrLastFrame.frame;
    } else {
      // Did we handle an edge last time?
      if (skrollable.edge !== 0) {
        updateClass(
          element,
          [SKROLLABLE_CLASS, SKROLLABLE_BETWEEN_CLASS],
          [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_AFTER_CLASS]
        );
        skrollable.edge = 0;
      }
    }

    // Find out between which two key frames we are right now.
    // let keyFrameIndex = 0;

    frames.forEach((item, keyFrameIndex) => {
      if (
        frame >= frames[keyFrameIndex].frame &&
        frames[keyFrameIndex + 1] &&
        frame <= frames[keyFrameIndex + 1].frame
      ) {
        // let key;
        let value;
        const left = frames[keyFrameIndex];
        const right = frames[keyFrameIndex + 1];

        Object.keys(left.props).forEach((key) => {
          let progress = (frame - left.frame) / (right.frame - left.frame);

          // Transform the current progress using the given easing function.
          progress = left.props[key].easing(progress);

          // Interpolate between the two values
          value = calcInterpolation(
            left.props[key].value,
            right.props[key].value,
            progress
          );

          value = interpolateString(value);
          _instance.setStyle(element, key, value);
        });
      }
    });
  });
};

export default calcSteps;
