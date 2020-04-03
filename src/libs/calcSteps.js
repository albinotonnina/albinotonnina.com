import { emitEvent } from "./eventHandling";
import calcInterpolation from "./calcInterpolation";
import updateClass from "./updateClass";

const SKROLLABLE_CLASS = "skrollable";
const SKROLLABLE_BEFORE_CLASS = `${SKROLLABLE_CLASS}-before`;
const SKROLLABLE_BETWEEN_CLASS = `${SKROLLABLE_CLASS}-between`;
const SKROLLABLE_AFTER_CLASS = `${SKROLLABLE_CLASS}-after`;

const hasProp = Object.prototype.hasOwnProperty;

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
 * @param fakeFrame The frame to render at when smooth scrolling is enabled.
 * @param actualFrame The actual frame we are at.
 */
const calcSteps = (
  _instance,
  fakeFrame,
  actualFrame,
  _skrollables,
  _direction
) => {
  // Iterate over all skrollables.
  let skrollableIndex = 0;
  const skrollablesLength = _skrollables.length;

  for (; skrollableIndex < skrollablesLength; skrollableIndex++) {
    const skrollable = _skrollables[skrollableIndex];
    const { element } = skrollable;
    let frame = skrollable.smoothScrolling ? fakeFrame : actualFrame;
    const frames = skrollable.keyFrames;
    const framesLength = frames.length;
    const firstFrame = frames[0];
    const lastFrame = frames[frames.length - 1];
    const beforeFirst = frame < firstFrame.frame;
    const afterLast = frame > lastFrame.frame;
    const firstOrLastFrame = beforeFirst ? firstFrame : lastFrame;
    const { emitEvents } = skrollable;
    const { lastFrameIndex } = skrollable;
    let key;
    let value;

    // If we are before/after the first/last frame, set the styles according to the given edge strategy.
    if (beforeFirst || afterLast) {
      // Check if we already handled this edge case last time.
      // Note: using setScrollTop it's possible that we jumped from one edge to the other.
      if (
        (beforeFirst && skrollable.edge === -1) ||
        (afterLast && skrollable.edge === 1)
      ) {
        continue;
      }

      // Add the skrollr-before or -after class.
      if (beforeFirst) {
        updateClass(
          element,
          [SKROLLABLE_BEFORE_CLASS],
          [SKROLLABLE_AFTER_CLASS, SKROLLABLE_BETWEEN_CLASS]
        );

        // This handles the special case where we exit the first keyframe.
        if (emitEvents && lastFrameIndex > -1) {
          emitEvent(element, firstFrame.eventType, _direction);
          skrollable.lastFrameIndex = -1;
        }
      } else {
        updateClass(
          element,
          [SKROLLABLE_AFTER_CLASS],
          [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_BETWEEN_CLASS]
        );

        // This handles the special case where we exit the last keyframe.
        if (emitEvents && lastFrameIndex < framesLength) {
          emitEvent(element, lastFrame.eventType, _direction);
          skrollable.lastFrameIndex = framesLength;
        }
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
    let keyFrameIndex = 0;

    for (; keyFrameIndex < framesLength - 1; keyFrameIndex++) {
      if (
        frame >= frames[keyFrameIndex].frame &&
        frame <= frames[keyFrameIndex + 1].frame
      ) {
        const left = frames[keyFrameIndex];
        const right = frames[keyFrameIndex + 1];

        for (key in left.props) {
          if (hasProp.call(left.props, key)) {
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
          }
        }

        // Are events enabled on this element?
        // This code handles the usual cases of scrolling through different keyframes.
        // The special cases of before first and after last keyframe are handled above.
        if (emitEvents) {
          // Did we pass a new keyframe?
          if (lastFrameIndex !== keyFrameIndex) {
            if (_direction === "down") {
              emitEvent(element, left.eventType, _direction);
            } else {
              emitEvent(element, right.eventType, _direction);
            }

            skrollable.lastFrameIndex = keyFrameIndex;
          }
        }

        break;
      }
    }
  }
};

export default calcSteps;
