/**
 * CORE SCENE TRANSITIONS
 *
 * Handles the main scene transitions and camera movements
 * that drive the primary animation sequence.
 *
 * TIME: Throughout animation (0ms - 18200ms)
 * ELEMENTS: core transitions, camera movements, scene flow
 */

/**
 * Creates the main scene transitions and camera movements
 * This is the primary animation sequence that drives the narrative
 */
const createCoreSceneTransitions = (SCENE_TIMING, transforms, disappearAt) => {
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
