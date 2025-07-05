/**
 * LIGHTS OFF SCENE ANIMATIONS
 *
 * Handles the dramatic lighting effects and shadows sequence,
 * including smoke effects and lighting transitions.
 *
 * TIME: 4300ms - 6300ms (lights off scene phase)
 * ELEMENTS: shadows, lighting effects, smoke, terminals
 */

/**
 * Creates shadow animations for lighting effects
 * Shadows appear and transform during the lights-off sequence
 */
export const createShadowAnimations = (
  SCENE_TIMING,
  multiple,
  translate,
  scale
) => {
  const [startTime] = SCENE_TIMING.lightsOff;

  const baseShadowConfig = {
    [startTime]: {
      transform: multiple(translate(0, 0), scale(0.8, 1)),
      opacity: 0.6,
    },
    [startTime + 300]: {
      transform: multiple(translate(0, 0), scale(1, 1)),
      opacity: 0,
    },
  };

  return [
    ["chairshadow", baseShadowConfig],
    ["tableshadow", { 0: { opacity: 0 }, ...baseShadowConfig }],
    ["table2shadow", { 0: { opacity: 0 }, ...baseShadowConfig }],
  ];
};

/**
 * Creates lighting effect animations
 * Manages the dramatic lighting sequence with dodging light and darkness
 */
export const createLightingAnimations = (
  SCENE_TIMING,
  multiple,
  translate,
  scale
) => {
  const [startTime] = SCENE_TIMING.lightsOff;

  return [
    // Moving dodge light effect
    [
      "dodge",
      {
        0: { opacity: 0 },
        [startTime]: {
          transform: multiple(translate(-100, 0), scale(1)),
          opacity: 1,
        },
        [startTime + 500]: {
          transform: multiple(translate(-200, 0), scale(1.6)),
          opacity: 0,
        },
      },
    ],

    // Main lights appearing
    [
      "light",
      {
        0: { opacity: 0 },
        [startTime + 349]: { opacity: 0 },
        [startTime + 350]: { opacity: 0.4 },
      },
    ],
    [
      "light2",
      {
        0: { opacity: 0 },
        [startTime + 349]: { opacity: 0 },
        [startTime + 350]: { opacity: 0.4 },
      },
    ],

    // Darkness overlays
    [
      "dark1",
      {
        0: { opacity: 0 },
        [startTime]: { opacity: 0 },
        [startTime + 300]: { opacity: 0 },
        [startTime + 400]: { opacity: 0.7 },
      },
    ],
    [
      "dark2",
      {
        0: { opacity: 0 },
        [startTime]: { opacity: 0 },
        [startTime + 349]: { opacity: 0.7 },
        [startTime + 350]: { opacity: 0 },
      },
    ],
  ];
};

/**
 * Creates terminal and technology interface animations
 */
export const createTerminalAnimations = (
  SCENE_TIMING,
  smokeMachine,
  scale,
  translate
) => {
  const {
    lightsOff: [lightsOffStart],
    space: [spaceStart],
  } = SCENE_TIMING;

  return [
    // Smoke effects for atmosphere
    ["smoke1", smokeMachine(lightsOffStart - 100, 7)],
    ["smoke2", smokeMachine(lightsOffStart, 7)],

    // Terminal windows appearing
    [
      "window1",
      {
        0: { opacity: 0 },
        [lightsOffStart + 800]: { opacity: 0, transform: scale(0.7) },
        [lightsOffStart + 830]: { opacity: 1, transform: scale(1) },
      },
    ],
    [
      "terminal1",
      {
        0: { opacity: 0 },
        [lightsOffStart + 600]: { opacity: 0, transform: scale(0.7) },
        [lightsOffStart + 630]: { opacity: 1, transform: scale(1) },
      },
    ],
    [
      "terminal2",
      {
        0: { opacity: 0 },
        [spaceStart - 500]: { opacity: 0, transform: scale(0.7) },
        [spaceStart - 270]: { opacity: 1, transform: scale(1) },
      },
    ],

    // Terminal text animations with typing effect
    [
      "terminal2textclip",
      {
        [spaceStart - 300]: { transform: scale(1, 1) },
        [spaceStart - 200]: { transform: scale(2.6, 1) },
      },
    ],
    [
      "terminal2cursor",
      {
        [spaceStart - 300]: { transform: translate(0, 0) },
        [spaceStart - 201]: { transform: translate(52, 0) },
        [spaceStart - 200]: { transform: translate(28, 12) },
      },
    ],
    [
      "terminal2line2",
      {
        [spaceStart - 200]: { opacity: 1 },
        [spaceStart + 200]: { opacity: 0 },
      },
    ],
  ];
};
