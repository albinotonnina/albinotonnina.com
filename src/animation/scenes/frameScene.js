/**
 * FRAME SCENE ANIMATIONS
 *
 * Handles the landscape and environmental animations including
 * frame appearance, skyline movement, and room transitions.
 *
 * TIME: 1800ms - 2500ms (frame scene phase)
 * ELEMENTS: frame, skyline, hot air balloon, room transitions
 */

/**
 * Creates frame and landscape animations
 */
const createFrameAnimations = (
  SCENE_TIMING,
  transforms,
  appearAt,
  disappearAt,
  display,
  translate,
  multiple,
  rotate
) => {
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
        [frameStart]: { transform: translate(-300, 0) },
        [frameEnd]: { transform: translate(520, 0) },
      },
    ],

    // Rome city
    ["rome", disappearAt(frameEnd)],

    // Hot air balloon movement
    [
      "hotballoon",
      {
        [frameStart]: { transform: multiple(translate(-160, 140), rotate(0)) },
        [frameEnd - 200]: {
          transform: multiple(translate(-130, -20), rotate(0)),
        },
        [frameEnd]: { transform: multiple(translate(-180, 10), rotate(20)) },
        [frameEnd + 200]: {
          transform: multiple(translate(-200, 20), rotate(20)),
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
