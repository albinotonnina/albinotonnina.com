/**
 * SPACE SCENE ANIMATIONS
 *
 * Handles the space/cosmic sequence with error screens,
 * space lines, bulb animations, and moon phases.
 *
 * TIME: 6100ms - 13400ms (space scene phase)
 * ELEMENTS: space, bulb, moon, collaboration, error screens
 */

import { multiple, translate, scale } from "../transition-utilities";

/**
 * Creates viewport-responsive transform configurations for space scene
 */
const getSpaceTransforms = (isPortrait) => {
  const zeroTransform = multiple(translate(0, 0), scale(1));

  return {
    space: zeroTransform,
    bulbZoomed: isPortrait
      ? multiple(translate(-1000, 0), scale(2, 2))
      : multiple(translate(0, 0), scale(1, 1)),
  };
};

/**
 * Creates the flickering error screen animation
 * Simulates a glitchy terminal screen effect
 */
export const createErrorScreenAnimation = (SCENE_TIMING) => {
  const [startTime] = SCENE_TIMING.space;
  const flickerTimes = [0, 160, 200, 240, 280, 320, 360, 400];
  const animation = { 0: { opacity: 0 } };

  // Create flicker pattern - optimized to avoid repeated object creation
  for (let i = 0; i < flickerTimes.length; i++) {
    const time = flickerTimes[i];
    const flickerStart = startTime + time;
    animation[flickerStart - 1] = { opacity: 0 };
    animation[flickerStart] = { opacity: 1 };
    animation[flickerStart + 30] = { opacity: 1 };
    animation[flickerStart + 31] = { opacity: 0 };
  }

  return ["errorscr1", animation];
};

/**
 * Creates space scene animations
 */
export const createSpaceAnimations = (
  SCENE_TIMING,
  isPortrait,
  drawStrokes,
  multipleUtil,
  translateUtil,
  scaleUtil
) => {
  const transforms = getSpaceTransforms(isPortrait);
  const [spaceStart] = SCENE_TIMING.space;

  const animationStart = spaceStart + 100;
  const linesStart = spaceStart + 1600;
  const bulbLinesStart = spaceStart + 400;

  // Pre-calculate common transforms to avoid repeated function calls
  const bulbTransform1 = multipleUtil(
    translateUtil(-14791, 135),
    scaleUtil(16, 16)
  );
  const bulbTransform2 = multipleUtil(
    translateUtil(-14791, 138),
    scaleUtil(16, 16)
  );
  const spaceTransform = multipleUtil(translateUtil(0, 0), scaleUtil(1, 1));
  const spaceTransform2 = multipleUtil(translateUtil(0, 0), scaleUtil(2, 2));
  const moonTransform1 = multipleUtil(translateUtil(0, 400), scaleUtil(1, 1));

  const baseAnimations = [
    [
      "space",
      {
        0: { opacity: 0 },
        [animationStart + 200]: {
          opacity: 0,
          transform: transforms.space,
        },
        [animationStart + 250]: {
          opacity: 1,
          transform: transforms.space,
        },
      },
    ],
    ["bulblines *", drawStrokes(bulbLinesStart, 3000, 15)],
    ["bulbEllipses1 *", drawStrokes(bulbLinesStart + 550, 800, 1)],
    ["bulbEllipses2 *", drawStrokes(bulbLinesStart + 500, 800, 1)],
    [
      "bulb",
      {
        0: { opacity: 0 },
        [animationStart + 550]: {
          opacity: 1,
          transform: transforms.bulbZoomed,
        },
        [animationStart + 1301]: {
          opacity: 1,
          transform: transforms.bulbZoomed,
        },
        [animationStart + 1600]: {
          opacity: 1,
          transform: bulbTransform1,
        },
        [animationStart + 1650]: {
          opacity: 0,
          transform: bulbTransform2,
        },
      },
    ],
    ["bulbbase *", drawStrokes(bulbLinesStart + 550, 800, 1)],
    [
      "spacelines",
      {
        [animationStart + 1499]: {
          opacity: 0,
        },
        [animationStart + 2400]: {
          opacity: 1,
          transform: spaceTransform,
        },
        [animationStart + 3200]: {
          opacity: 1,
          transform: spaceTransform2,
        },
      },
    ],
    [
      "sl1 *",
      {
        [linesStart + 200]: { strokeDashoffset: 2800, opacity: 1 },
        [linesStart + 830]: { strokeDashoffset: 1, opacity: 1 },
        [animationStart + 3600]: { strokeDashoffset: 1, opacity: 1 },
        [animationStart + 4000]: { strokeDashoffset: 2800, opacity: 0 },
      },
    ],
    [
      "sl2 *",
      {
        [linesStart + 200]: { strokeDashoffset: 800, opacity: 1 },
        [linesStart + 830]: { strokeDashoffset: 1, opacity: 1 },
        [animationStart + 3600]: { strokeDashoffset: 1, opacity: 1 },
        [animationStart + 4000]: { strokeDashoffset: 800, opacity: 0 },
      },
    ],
    [
      "sl3 *",
      {
        [linesStart + 200]: { strokeDashoffset: 400, opacity: 0 },
        [linesStart + 500]: { strokeDashoffset: 400, opacity: 0 },
        [linesStart + 501]: { strokeDashoffset: 400, opacity: 1 },
        [linesStart + 1030]: { strokeDashoffset: 1, opacity: 1 },
        [animationStart + 3600]: { strokeDashoffset: 1, opacity: 1 },
        [animationStart + 4000]: { strokeDashoffset: 400, opacity: 0 },
      },
    ],
    [
      "sl4 *",
      {
        [linesStart + 200]: { strokeDashoffset: 2800, opacity: 1 },
        [linesStart + 830]: { strokeDashoffset: 1, opacity: 1 },
        [animationStart + 3600]: { strokeDashoffset: 1, opacity: 1 },
        [animationStart + 4000]: { strokeDashoffset: 2800, opacity: 0 },
      },
    ],
    [
      "sl5 *",
      {
        [linesStart + 200]: { strokeDashoffset: 1000, opacity: 0 },
        [linesStart + 400]: { strokeDashoffset: 1000, opacity: 0 },
        [linesStart + 401]: { strokeDashoffset: 1000, opacity: 1 },
        [linesStart + 830]: { strokeDashoffset: 1, opacity: 1 },
      },
    ],
    [
      "sl6 *",
      {
        [linesStart + 200]: { strokeDashoffset: 800, opacity: 0 },
        [linesStart + 400]: { strokeDashoffset: 800, opacity: 0 },
        [linesStart + 401]: { strokeDashoffset: 800, opacity: 1 },
        [linesStart + 830]: { strokeDashoffset: 1, opacity: 1 },
        [animationStart + 3600]: { strokeDashoffset: 1, opacity: 1 },
        [animationStart + 4000]: { strokeDashoffset: 800, opacity: 0 },
      },
    ],
    [
      "sl7 *",
      {
        [linesStart + 200]: { strokeDashoffset: 2000, opacity: 1 },
        [linesStart + 830]: { strokeDashoffset: 1, opacity: 1 },
      },
    ],
    [
      "moon",
      {
        [animationStart + 1600]: { opacity: 0 },
        [animationStart + 1601]: { opacity: 1 },
        [animationStart + 4200]: { opacity: 1 },
        [animationStart + 4600]: { opacity: 0.7 },
        [animationStart + 4600]: {
          opacity: 0.7,
          transform: spaceTransform,
        },
        [animationStart + 5600]: {
          opacity: 0.7,
          transform: moonTransform1,
        },
        [animationStart + 6800]: {
          transform: moonTransform1,
          opacity: 0.7,
        },
        [animationStart + 7100]: {
          transform: moonTransform1,
          opacity: 0,
        },
      },
    ],
    [
      "moon2",
      {
        [animationStart + 4700]: { opacity: 0 },
        [animationStart + 4900]: { opacity: 1 },
        [animationStart + 6800]: { opacity: 1 },
        [animationStart + 7100]: { opacity: 0 },
      },
    ],
    [
      "collab",
      {
        [animationStart + 4600]: {
          transform: spaceTransform,
        },
        [animationStart + 5600]: {
          transform: moonTransform1,
        },
        [animationStart + 6800]: {
          transform: moonTransform1,
          opacity: 1,
        },
        [animationStart + 7100]: {
          transform: moonTransform1,
          opacity: 0,
        },
      },
    ],
    ["people *", drawStrokes(animationStart + 5600, 400, 10)],
  ];

  // Generate ladder animations more efficiently
  const ladderAnimations = [];
  for (let i = 0; i < 23; i++) {
    ladderAnimations.push([
      `ladder :nth-child(${i + 1}n)`,
      drawStrokes(animationStart + 5200 + i * 16, 100, 10),
    ]);
  }

  return [...baseAnimations, ...ladderAnimations];
};
