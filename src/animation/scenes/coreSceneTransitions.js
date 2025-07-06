/**
 * CORE SCENE TRANSITIONS
 *
 * Handles the main scene transitions and camera movements
 * that drive the primary animation sequence.
 *
 * TIME: Throughout animation (0ms - 18200ms)
 * ELEMENTS: core transitions, camera movements, scene flow
 */

import { multiple, translate, scale } from "../transition-utilities";

/**
 * Creates viewport-responsive transform configurations for core scene transitions
 */
const getCoreTransforms = (isPortrait) => {
  const zeroTransform = multiple(translate(0, 0), scale(1));

  return {
    // Scene-specific positions
    start: isPortrait
      ? multiple(translate(-4300, -400), scale(5))
      : multiple(translate(-4200, -400), scale(5)),

    freelance: isPortrait
      ? multiple(translate(-980, -200), scale(2))
      : multiple(translate(-500, -200), scale(1.5)),

    company: isPortrait
      ? multiple(translate(-800, 450), scale(1.7))
      : multiple(translate(0, 50), scale(1)),

    founder: isPortrait
      ? multiple(translate(-1100, 0), scale(2))
      : multiple(translate(-300, 0), scale(1.3)),

    scrollHint: isPortrait
      ? multiple(translate(0, 0), scale(4))
      : zeroTransform,
  };
};

/**
 * Creates the main scene transitions and camera movements
 * This is the primary animation sequence that drives the narrative
 */
const createCoreSceneTransitions = (SCENE_TIMING, isPortrait, disappearAt) => {
  const transforms = getCoreTransforms(isPortrait);
  const {
    desk: deskTime,
    freelance: [freelanceStart],
    company: [companyStart, companyEnd],
    founder: [founderStart, founderEnd],
  } = SCENE_TIMING;

  return [
    // Initial scroll hint
    [
      "scrollhint",
      {
        0: { transform: transforms.scrollHint },
        2: { opacity: 1, transform: transforms.scrollHint },
        30: { opacity: 0, transform: transforms.scrollHint },
      },
    ],

    // Main container camera movements
    [
      "container",
      {
        0: { transform: transforms.start },
        [freelanceStart - 50]: { transform: transforms.start },
        [freelanceStart]: { transform: transforms.freelance },
        [companyStart]: { transform: transforms.freelance },
        [companyStart + 20]: { transform: transforms.company },
        [companyEnd - 30]: { transform: transforms.company },
        [founderStart]: { transform: transforms.founder },
        [founderEnd - 30]: { opacity: 1, transform: transforms.founder },
        [founderEnd]: { transform: transforms.founder, opacity: 0 },
      },
    ],

    // Hello line drawing animation
    [
      "helloline",
      {
        [deskTime + 200]: { strokeDashoffset: 300 },
        [deskTime + 430]: { strokeDashoffset: 0 },
        ...disappearAt(freelanceStart),
      },
    ],
  ];
};

export default createCoreSceneTransitions;
