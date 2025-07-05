/** *
 * SCENE TRANSITIONS
 *
 * This file orchestrates the entire animated narrative of albinotonnina.com.
 * The animation is structured as a cinematic sequence with multiple scenes:
 *
 * 1. DESK SCENE - Drawing of workspace elements
 * 2. FREELANCE SCENE - Transition to freelance work environment
 * 3. COMPANY SCENE - Corporate work phase with exploding elements
 * 4. FOUNDER SCENE - Starting own company
 * 5. FRAME SCENE - Landscape and environmental animations
 * 6. LIGHTS OFF SCENE - Dramatic lighting effects and shadows
 * 7. CONTACTS SCENE - Terminal interfaces and error screens
 *
 * The file is organized into logical sections:
 * - Configuration constants (timing, transforms)
 * - Animation generators for specific element types
 * - Core scene transition functions
 * - Main factory function that combines everything
 *
 * Each animation is defined as [selector, keyframe_object] pairs that are
 * processed by the animation engine in tickFunction.js
 *
 * DEBUG: Animation debugger is conditionally loaded in development only.
 * Press Ctrl/Cmd + D to toggle real-time animation information.
 *
 * Portfolio by Albino Tonnina, licensed under CC BY-NC-ND 4.0. Ref: ATSignaturePortfolio2025 Do not use as your own portfolio.
 */

import {
  animateSourceCodes,
  appearAt,
  disappearAt,
  display,
  drawStrokes,
  drawStrokesAndHide,
  explodeIt,
  multiple,
  rotate,
  scale,
  smokeMachine,
  translate,
} from "./transition-utilities";

// Only import debugger in development
let animationDebugger = null;

// ============================
// ANIMATION CONFIGURATION
// ============================

const DURATION = 18200;

/**
 * Scene timing configuration - defines when each scene phase begins/ends
 * Times are in milliseconds from animation start
 */
const SCENE_TIMING = {
  desk: 10,
  freelance: [800, 1200],
  company: [1200, 1600],
  founder: [1600, 1800],
  frame: [1800, 2500],
  lightsOff: [4300, 6300],
  space: [6100, 13400],
  contacts: [13400, 15200],
};

// Initialize debugger after SCENE_TIMING is available
if (process.env.NODE_ENV === "development") {
  // Dynamic import to ensure it's not included in production bundles
  import("./animationDebugger")
    .then((module) => {
      animationDebugger = module.default;
      // Initialize debugger with scene timing once imported
      if (animationDebugger && animationDebugger.init) {
        animationDebugger.init(SCENE_TIMING);
        // Ensure it's available globally for tick function
        window.animationDebugger = animationDebugger;
        // eslint-disable-next-line no-console
        console.log(
          "🎬 Animation Debugger loaded! Press Ctrl/Cmd + D to toggle."
        );
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.warn("Failed to load animation debugger:", error);
    });
}

/**
 * Responsive transform configurations for different viewport orientations
 * Each transform includes positioning and scaling for various scene elements
 */
const getViewportTransforms = (isPortrait) => {
  // Pre-calculate common values to avoid repeated function calls
  const zeroTransform = multiple(translate(0, 0), scale(1));

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

    space: zeroTransform,

    bulbZoomed: isPortrait
      ? multiple(translate(-1000, 0), scale(2, 2))
      : multiple(translate(0, 0), scale(1, 1)),
  };
};

// ============================
// ANIMATION GENERATORS
// ============================

/**
 * Creates desk drawing animations in sequence
 * Each element appears with a stroke drawing effect
 *
 * DEBUG: Desk scene elements that draw themselves with stroke animation
 * TIME: 10ms - 810ms (desk scene phase)
 * ELEMENTS: table, monitors, laptop, keyboard, coffee, notes, pen
 */
const createDeskDrawingAnimations = () => {
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
 * Creates wireframe animations that appear and disappear quickly
 * Used during the freelance scene transition
 *
 * DEBUG: UI/UX wireframes showing during freelance work phase
 * TIME: 800ms - 1100ms (freelance scene start)
 * ELEMENTS: 4 wireframe mockups appearing in sequence
 */
const createWireframeAnimations = () => {
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
 * Creates company logo animations with sequential appearance
 * Each logo draws and then fades away
 *
 * DEBUG: Corporate client logos during company employment phase
 * TIME: 1200ms - 1650ms (company scene)
 * ELEMENTS: 10 company logos appearing every 50ms
 */
const createCompanyLogoAnimations = () => {
  const [startTime] = SCENE_TIMING.company;
  const logoAnimations = [];

  // Pre-calculate the drawStrokesAndHide animation to avoid repeated function calls
  const baseLogoAnimation = { delay: 0, duration: 60, opacity: 0.25 };

  for (let i = 1; i <= 10; i++) {
    const selector = i === 1 ? "logo1" : `logo${i} *`;
    const currentDelay = startTime + (i - 1) * 50;

    logoAnimations.push([
      selector,
      drawStrokesAndHide(
        currentDelay,
        baseLogoAnimation.duration,
        baseLogoAnimation.opacity
      ),
    ]);
  }

  return logoAnimations;
};

/**
 * Creates explosion animations for desk items during company transition
 * Items fly away with different trajectories and timing
 */
const createDeskExplosionAnimations = () => {
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
 * Creates shadow animations for lighting effects
 * Shadows appear and transform during the lights-off sequence
 */
const createShadowAnimations = () => {
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
const createLightingAnimations = () => {
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
 * Creates the flickering error screen animation
 * Simulates a glitchy terminal screen effect
 */
const createErrorScreenAnimation = () => {
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
 * Example: Space element appears, moves, and fades out
 */
const createSpaceAnimations = (transforms) => {
  const [spaceStart] = SCENE_TIMING.space;

  const animationStart = spaceStart;
  const linesStart = spaceStart + 1600;
  const bulbLinesStart = spaceStart + 400;

  // Pre-calculate common transforms to avoid repeated function calls
  const bulbTransform1 = multiple(translate(-14791, 135), scale(16, 16));
  const bulbTransform2 = multiple(translate(-14791, 138), scale(16, 16));
  const spaceTransform = multiple(translate(0, 0), scale(1, 1));
  const spaceTransform2 = multiple(translate(0, 0), scale(2, 2));
  const moonTransform1 = multiple(translate(0, 400), scale(1, 1));

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
    ["bulblines *", drawStrokes(bulbLinesStart, 2000, 10)],
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
        [animationStart + 3600]: {
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

// ============================
// CORE SCENE TRANSITIONS
// ============================

/**
 * Creates the main scene transitions and camera movements
 * This is the primary animation sequence that drives the narrative
 */
const createCoreSceneTransitions = (transforms) => {
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

/**
 * Creates source code and programming-related animations
 */
const createSourceCodeAnimations = () => {
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
 * Creates room and environment transition animations
 */
const createEnvironmentAnimations = () => {
  const {
    freelance: [freelanceStart, freelanceEnd],
    company: [companyStart, companyEnd],
    founder: [founderStart],
    frame: [, , frameEnd],
  } = SCENE_TIMING;

  return [
    // Desk environment
    ["desktable", disappearAt(companyStart - 50, 40)],
    ["desk", display(SCENE_TIMING.desk, 1, frameEnd - 100)],

    // Freelance environment
    ["freelance", display(freelanceStart, 1, freelanceEnd)],
    ["freelancewalls", disappearAt(freelanceEnd - 60, 5)],
    ["freelancewalls polygon", drawStrokes(freelanceStart)],
    ["freelanceinterior", disappearAt(freelanceEnd - 60, 5)],

    // Company environment
    ["company", display(companyStart - 50, 50, companyEnd)],
    ["companywalls", display(companyStart + 20, 30, companyEnd - 80, 30)],
    ["companyshadows", display(companyStart + 60, 30, companyEnd - 50, 20)],
    ["companydesk", appearAt(companyStart + 10, 10)],
    ["companyinterior", display(companyStart + 30, 40, companyEnd - 50, 20)],

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

/**
 * Creates frame and landscape animations
 */
const createFrameAnimations = (transforms) => {
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

/**
 * Creates detailed UI element animations (shadows, windows, etc.)
 */
const createDetailAnimations = () => {
  const {
    freelance: [freelanceStart, freelanceEnd],
    company: [companyStart],
  } = SCENE_TIMING;

  return [
    // Window shadows and reflections
    [
      "desktablewindowshadow",
      display(freelanceStart, 1, freelanceEnd - 40, 10),
    ],
    ["laptopwindowshadow", display(freelanceStart, 1, freelanceEnd - 50)],
    [
      "desktableshadow",
      {
        ...display(freelanceStart + 86, 30, freelanceEnd - 50),
        ...appearAt(companyStart + 20),
      },
    ],

    // Room detail elements
    ["desktablewindowshadow *", drawStrokes(freelanceStart, 300)],
    ["freelance path", drawStrokes(freelanceStart + 40)],
    ["freelance polygon", drawStrokes(freelanceStart + 50, 300)],
    ["chair1 *", drawStrokes(freelanceStart + 60, 300)],
  ];
};

/**
 * Creates terminal and technology interface animations
 */
// eslint-disable-next-line no-unused-vars
const createTerminalAnimations = (transforms) => {
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
        ...appearAt(spaceStart - 200),
        ...disappearAt(spaceStart + 200),
      },
    ],

    createErrorScreenAnimation(),
  ];
};

const createContactsAnimations = () => {
  const {
    contacts: [contactsStart],
  } = SCENE_TIMING;

  return [
    ["contacts", appearAt(contactsStart, 200)],
    ["door *", drawStrokes(contactsStart + 800, 800, 10)],
    ["doorlight", appearAt(contactsStart + 1600, 100)],
    ["doorlightwall", appearAt(contactsStart + 1600, 100)],
  ];
};

// ============================
// MAIN TRANSITIONS FACTORY
// ============================

/**
 * Main function that creates all scene transitions
 * Combines all animation types into a complete scene
 */
const createTransitions = (isPortrait) => {
  const transforms = getViewportTransforms(isPortrait);

  // Create all animation groups efficiently
  const animationGroups = [
    createCoreSceneTransitions(transforms),
    createSourceCodeAnimations(),
    createEnvironmentAnimations(),
    createFrameAnimations(transforms),
    createDetailAnimations(),
    createTerminalAnimations(transforms),
    createDeskDrawingAnimations(),
    createWireframeAnimations(),
    createCompanyLogoAnimations(),
    createDeskExplosionAnimations(),
    createShadowAnimations(),
    createLightingAnimations(),
    createSpaceAnimations(transforms),
    createContactsAnimations(),
  ];

  // Flatten all animations into a single Map more efficiently
  const allAnimations = new Map();
  for (let i = 0; i < animationGroups.length; i++) {
    const group = animationGroups[i];
    for (let j = 0; j < group.length; j++) {
      const [key, value] = group[j];
      allAnimations.set(key, value);
    }
  }

  return allAnimations;
};

// ============================
// EXPORTS
// ============================

const transitions = {
  duration: DURATION,
  transitions: createTransitions,

  // Export debugger for external access (development only)
  ...(process.env.NODE_ENV === "development" && {
    debugger: animationDebugger,
    sceneTiming: SCENE_TIMING,
  }),
};

export default transitions;
