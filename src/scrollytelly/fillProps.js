const fillPropForFrame = ({ props }, propList) => {
  // For each key frame iterate over all right hand properties and assign them,
  // but only if the current key frame doesn't have the property by itself
  Object.keys(propList).forEach((key) => {
    // The current frame misses this property, so assign it.
    props[key] = props[key] || propList[key];
  });

  // Iterate over all props of the current frame and collect them
  Object.keys(props).forEach((key) => {
    propList[key] = props[key];
  });
};

/**
 * Fills the key frames with missing left and right hand properties.
 * If key frame 1 has property X and key frame 2 is missing X,
 * but key frame 3 has X again, then we need to assign X to key frame 2 too.
 *
 * @param sk A scrollable.
 */
const fillProps = ({ keyFrames }) => {
  // Will collect the properties key frame by key frame
  let propList = {};
  // Iterate over all key frames from left to right
  keyFrames.reduce((_, item) => fillPropForFrame(item, propList), null);
  // Now do the same from right to fill the last gaps
  propList = {};
  // Iterate over all key frames from right to left
  keyFrames.reduceRight((_, item) => fillPropForFrame(item, propList), null);
};

export default fillProps;
