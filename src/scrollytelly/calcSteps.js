import calcInterpolation from "./calcInterpolation";
import setStyle from "./setStyle";
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
const calcSteps = (fakeFrame, scrollables) =>
  scrollables.forEach((scrollable) => {
    const { element } = scrollable;
    let frame = fakeFrame;
    const frames = scrollable.keyFrames;
    const firstFrame = frames[0];
    const lastFrame = frames[frames.length - 1];
    const beforeFirst = frame < firstFrame.frame;
    const afterLast = frame > lastFrame.frame;
    const firstOrLastFrame = beforeFirst ? firstFrame : lastFrame;

    if (beforeFirst || afterLast) {
      frame = firstOrLastFrame.frame;
    }

    // Find out between which two key frames we are right now.
    // let keyFrameIndex = 0;

    frames.forEach((item, keyFrameIndex) => {
      if (
        frame >= item.frame &&
        frames[keyFrameIndex + 1] &&
        frame <= frames[keyFrameIndex + 1].frame
      ) {
        const left = frames[keyFrameIndex];
        const right = frames[keyFrameIndex + 1];

        Object.keys(left.props).forEach((key) => {
          const progress = (frame - left.frame) / (right.frame - left.frame);

          // Transform the current progress using the given easing function.
          // Interpolate between the two values

          const value = interpolateString(
            calcInterpolation(
              left.props[key].value,
              right.props[key].value,
              left.props[key].easing(progress)
            )
          );

          setStyle(element, key, value);
        });
      }
    });
  });

export default calcSteps;
