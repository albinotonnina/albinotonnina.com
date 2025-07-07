/**
 * FOUNDER SCENE ANIMATIONS
 *
 * Handles the startup/founder phase with environment transitions
 * and workspace setup animations.
 *
 * TIME: 1600ms - 1800ms (founder scene phase)
 * ELEMENTS: founder environment, workspace setup
 */

/**
 * Creates founder environment animations
 */
const createFounderEnvironmentAnimations = (
  SCENE_TIMING,
  appearAt,
  translate
) => {
  const {
    founder: [founderStart],
  } = SCENE_TIMING;

  return [
    // Founder environment
    ["founder", appearAt(founderStart, 50)],
    [
      "founderwalls",
      {
        [founderStart]: { transform: translate(0, 100), opacity: 0 },
        [founderStart + 20]: { opacity: 1, transform: translate(0, 0) },
      },
    ],
    [
      "founderinterior",
      {
        [founderStart]: { transform: translate(0, 100), opacity: 0 },
        [founderStart + 20]: { opacity: 1, transform: translate(0, 0) },
      },
    ],
  ];
};

export default createFounderEnvironmentAnimations;
