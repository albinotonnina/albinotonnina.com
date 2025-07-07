/**
 * FREELANCE SCENE ANIMATIONS
 *
 * Handles the freelance work phase animations including wireframes,
 * source code, and workspace environment transitions.
 *
 * TIME: 800ms - 1200ms (freelance scene phase)
 * ELEMENTS: wireframes, source code, freelance environment
 */

/**
 * Creates wireframe animations that appear and disappear quickly
 * Used during the freelance scene transition
 */
export const createWireframeAnimations = (SCENE_TIMING, drawStrokesAndHide) => {
  const [startTime] = SCENE_TIMING.freelance;

  // Static config for wireframe animations
  const wireframeConfigs = [
    ["wireframe1 *", startTime, 30, 1, 100],
    ["wireframe2 *", startTime + 100, 30, 1, 100],
    ["wireframe3 *", startTime + 200, 30, 1, 100],
    ["wireframe4 *", startTime + 300, 30, 1, 100],
  ];

  return wireframeConfigs.map(
    ([selector, start, duration, strokeWidth, hideDelay]) => [
      selector,
      drawStrokesAndHide(start, duration, strokeWidth, hideDelay),
    ]
  );
};

/**
 * Creates source code and programming-related animations
 */
export const createSourceCodeAnimations = (
  SCENE_TIMING,
  animateSourceCodes
) => {
  const {
    freelance: [freelanceStart],
    founder: [, founderEnd],
  } = SCENE_TIMING;

  return [
    // Desktop source code appearance
    [
      "desktopsource path",
      {
        0: { opacity: 0 },
        [freelanceStart - 240]: {
          opacity: 0,
          fillOpacity: 0,
          strokeOpacity: 0,
        },
        [freelanceStart - 220]: {
          opacity: 1,
          fillOpacity: 1,
          strokeOpacity: 1,
        },
      },
    ],

    // Main source code animation
    ["source", animateSourceCodes(freelanceStart - 240, founderEnd)],

    // Code lines appearing in sequence
    [
      "lines :nth-child(1n)",
      {
        [freelanceStart - 260]: { opacity: 0 },
        [freelanceStart - 220]: { opacity: 1 },
      },
    ],
    [
      "lines :nth-child(2n)",
      {
        [freelanceStart - 240]: { opacity: 0 },
        [freelanceStart - 200]: { opacity: 1 },
      },
    ],
  ];
};

/**
 * Creates freelance environment animations
 */
export const createFreelanceEnvironmentAnimations = (
  SCENE_TIMING,
  display,
  disappearAt,
  drawStrokes
) => {
  const {
    freelance: [freelanceStart, freelanceEnd],
  } = SCENE_TIMING;

  return [
    // Freelance environment
    ["freelance", display(freelanceStart, 1, freelanceEnd)],
    ["freelancewalls", disappearAt(freelanceEnd - 60, 5)],
    ["freelancewalls polygon", drawStrokes(freelanceStart)],
    ["freelanceinterior", disappearAt(freelanceEnd - 60, 5)],
    ["freelance path", drawStrokes(freelanceStart + 40)],
    ["freelance polygon", drawStrokes(freelanceStart + 50, 300)],
    ["chair1 *", drawStrokes(freelanceStart + 60, 300)],
  ];
};
