/**
 * DESK SCENE ANIMATIONS
 *
 * Handles the initial desk drawing sequence where workspace elements appear
 * with stroke drawing effects. This is the opening scene of the portfolio.
 *
 * TIME: 10ms - 810ms (desk scene phase)
 * ELEMENTS: table, monitors, laptop, keyboard, coffee, notes, pen
 */

/**
 * Creates desk drawing animations in sequence
 * Each element appears with a stroke drawing effect
 */
export const createDeskDrawingAnimations = (SCENE_TIMING, drawStrokes) => {
  const startTime = SCENE_TIMING.desk;

  // Static animation config reduces function calls
  const deskAnimations = [
    ["desktable polygon", startTime, 600],
    ["deskmonitor1 *", startTime + 100, 300],
    ["desklaptop *", startTime + 150, 60],
    ["deskkeyboard *", startTime + 180, 300],
    ["deskcoffee *", startTime + 240, 30],
    ["desknotes *", startTime + 280, 60],
    ["deskpen *", startTime + 300, 20],
    ["deskmonitor2 *", startTime + 400, 300],
  ];

  return deskAnimations.map(([selector, start, duration]) => [
    selector,
    drawStrokes(start, duration),
  ]);
};

/**
 * Creates desk environment and related element animations
 */
export const createDeskEnvironmentAnimations = (
  SCENE_TIMING,
  disappearAt,
  display
) => {
  const {
    company: [companyStart],
    frame: [, , frameEnd],
  } = SCENE_TIMING;

  return [
    // Desk environment
    ["desktable", disappearAt(companyStart - 50, 40)],
    ["desk", display(SCENE_TIMING.desk, 1, frameEnd - 100)],

    // Hello line drawing animation
    [
      "helloline",
      {
        [SCENE_TIMING.desk + 200]: { strokeDashoffset: 300 },
        [SCENE_TIMING.desk + 430]: { strokeDashoffset: 0 },
        ...disappearAt(SCENE_TIMING.freelance[0]),
      },
    ],
  ];
};

/**
 * Creates explosion animations for desk items during company transition
 * Items fly away with different trajectories and timing
 */
export const createDeskExplosionAnimations = (SCENE_TIMING, explodeIt) => {
  const [startTime] = SCENE_TIMING.company;

  // Static config array reduces memory allocation
  const explosionConfigs = [
    ["desklaptop", -100, -10, 1, 0],
    ["deskmonitor1", -100, -200, 1, 10],
    ["desklogos", -100, -200, 1, 10],
    ["wireframe4", -100, -200, 1, 10],
    ["desktopsource", 0, -300, 1, 15],
    ["deskmonitor2", 0, -300, 1, 15],
    ["deskpen", -50, -200, 1, 15],
    ["desknotes", -30, -300, 1, 15],
    ["deskkeyboard", -20, -300, 1, 15],
    ["deskcoffee", -40, -100, 1, 5],
  ];

  return explosionConfigs.map(([element, x, y, itemScale, delay]) => [
    element,
    explodeIt(startTime + delay, x, y, itemScale),
  ]);
};

/**
 * Creates detailed desk-related UI element animations
 */
export const createDeskDetailAnimations = (
  SCENE_TIMING,
  drawStrokesHelper,
  displayHelper,
  appearAt
) => {
  const {
    freelance: [freelanceStart, freelanceEnd],
    company: [companyStart],
  } = SCENE_TIMING;

  return [
    [
      "desktablewindowshadow",
      displayHelper(freelanceStart, 1, freelanceEnd - 40, 10),
    ],
    ["laptopwindowshadow", displayHelper(freelanceStart, 1, freelanceEnd - 50)],
    [
      "desktableshadow",
      {
        ...displayHelper(freelanceStart + 86, 30, freelanceEnd - 50),
        ...appearAt(companyStart + 20),
      },
    ],
    ["desktablewindowshadow *", drawStrokesHelper(freelanceStart, 300)],
  ];
};
