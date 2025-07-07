/**
 * FRAME SCENE ANIMATIONS
 *
 * Handles the landscape and environmental animations including
 * frame appearance, skyline movement, and room transitions.
 *
 * TIME: 1800ms - 2500ms (frame scene phase)
 * ELEMENTS: frame, skyline, hot air balloon, room transitions
 */

import { multiple, translate, scale } from "../transition-utilities";

/**
 * Creates viewport-responsive transform configurations for frame scene
 */
const getFrameTransforms = (isPortrait) => {
  return {
    // Camera positions and zoom levels
    frameZoomed: isPortrait
      ? multiple(translate(6400, 16800), scale(7.2))
      : multiple(translate(4800, 11360), scale(5)),

    frame: isPortrait
      ? multiple(translate(4000, 7000), scale(3.5))
      : multiple(translate(2200, 2700), scale(1.4)),

    lanyard: isPortrait
      ? multiple(translate(4600, 5400), scale(4))
      : multiple(translate(2200, 1600), scale(1.4)),

    total: isPortrait
      ? multiple(translate(800, -100), scale(0.5))
      : multiple(translate(700, -300), scale(0.3)),

    table: isPortrait
      ? multiple(translate(1030, 200), scale(1.6))
      : multiple(translate(1100, 200), scale(1.8)),
  };
};

/**
 * Creates frame and landscape animations
 */
const createFrameAnimations = (
  SCENE_TIMING,
  isPortrait,
  appearAt,
  disappearAt,
  display,
  translateUtil,
  multipleUtil,
  rotate
) => {
  const transforms = getFrameTransforms(isPortrait);
  const {
    frame: [frameStart, frameEnd],
    space: [spaceStart],
    lightsOff: [lightsOffStart],
  } = SCENE_TIMING;

  return [
    // Frame appearance
    ["frame", appearAt(frameStart, 100)],

    // Skyline movement
    [
      "skyline",
      {
        ...appearAt(frameStart - 1),
        [frameStart]: { transform: translateUtil(-300, 0) },
        [frameEnd]: { transform: translateUtil(520, 0) },
      },
    ],

    // Rome city
    ["rome", disappearAt(frameEnd)],

    // Hot air balloon movement
    [
      "hotballoon",
      {
        [frameStart]: {
          transform: multipleUtil(translateUtil(-160, 140), rotate(0)),
        },
        [frameEnd - 200]: {
          transform: multipleUtil(translateUtil(-130, -20), rotate(0)),
        },
        [frameEnd]: {
          transform: multipleUtil(translateUtil(-180, 10), rotate(20)),
        },
        [frameEnd + 200]: {
          transform: multipleUtil(translateUtil(-200, 20), rotate(20)),
        },
      },
    ],

    // Frame masking
    [
      "framemasked",
      {
        0: { clipPath: "none" },
        [frameEnd]: { clipPath: "none" },
        [frameEnd + 1]: { clipPath: "url(#framemask_1_)" },
      },
    ],

    // Room transitions and camera movements
    ["leftroom", appearAt(frameEnd, 1)],
    ["interior", display(frameEnd, 1, spaceStart, 250)],
    ["daylights", display(frameEnd + 1100, 1, spaceStart, 250)],
    [
      "room",
      {
        ...appearAt(frameStart - 2),
        [frameStart - 1]: { transform: transforms.frameZoomed },
        [frameStart + 1]: { transform: transforms.frameZoomed },
        [frameEnd]: { transform: transforms.frameZoomed },
        [frameEnd + 400]: { transform: transforms.frame },
        [frameEnd + 1000]: { transform: transforms.lanyard },
        [frameEnd + 1600]: { transform: transforms.total },
        [lightsOffStart + 400]: { transform: transforms.total },
        [lightsOffStart + 600]: { transform: transforms.table },
      },
    ],
  ];
};

export default createFrameAnimations;
