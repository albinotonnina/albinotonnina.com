import styleToCss from "style-object-to-css-string";
import { interpolateObject } from "d3-interpolate";

const getFrame = (currentFrame, frames) => {
  const firstFrame = frames[0][0];
  const lastFrame = frames[frames.length - 1][0];
  const beforeFirst = currentFrame < firstFrame;
  const afterLast = currentFrame > lastFrame;
  const firstOrLastFrame = beforeFirst ? firstFrame : lastFrame;

  if (beforeFirst || afterLast) {
    return firstOrLastFrame;
  }

  return currentFrame;
};

const shouldUpdate = (currentFrame, keyframe, nextFrame) =>
  currentFrame >= keyframe && nextFrame && currentFrame <= nextFrame;

const calculateStyles = (_currentFrame, transitions) => {
  const output = [];
  transitions.forEach((transition, key) => {
    const transitionKeys = Object.keys(transition);
    const transitionEntries = Object.entries(transition)
      .map(([key_, entry]) => [parseInt(key_, 10), entry])
      .sort(([keya], [keyb]) => keya - keyb);

    const inRange =
      (_currentFrame - Math.min(...transitionKeys) + 250) *
        (_currentFrame - Math.max(...transitionKeys) - 250) <=
      0;

    if (!inRange) {
      return;
    }

    transitionEntries.forEach(([thisFrame, currentValue], index, arr) => {
      const correctedFrame = getFrame(_currentFrame, arr);
      const nextKeyframe = arr[index + 1] && parseInt(arr[index + 1][0], 10);

      if (shouldUpdate(correctedFrame, parseInt(thisFrame, 10), nextKeyframe)) {
        const progress =
          (correctedFrame - thisFrame) / (nextKeyframe - thisFrame);
        const nextValue = arr[index + 1][1];
        const interpolation = interpolateObject(currentValue, nextValue);
        const interpolatedProgress = interpolation(progress);

        if (interpolatedProgress.opacity === 0) {
          interpolatedProgress.display = "none";
        }

        output.push({
          selector: `#${key}`,
          style: styleToCss(interpolatedProgress).replace(/\n|\r/g, ""),
        });
      }
    });
  });

  return output;
};

export default calculateStyles;
