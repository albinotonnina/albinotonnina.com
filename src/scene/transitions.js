/***
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

const DURATION = 12200;

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
  contacts: [6100, 7400],
  space: [7400, 12000],
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
        console.log(
          "🎬 Animation Debugger loaded! Press Ctrl/Cmd + D to toggle."
        );
      }
    })
    .catch((error) => {
      console.warn("Failed to load animation debugger:", error);
    });
}

/**
 * Responsive transform configurations for different viewport orientations
 * Each transform includes positioning and scaling for various scene elements
 */
const getViewportTransforms = (isPortrait) => ({
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
    : multiple(translate(0, 0), scale(1)),

  space: isPortrait
    ? multiple(translate(0, 0), scale(1))
    : multiple(translate(0, 0), scale(1)),
});

// ============================
// ANIMATION GENERATORS
// ============================

/**
 * Creates drawing animations for desk elements in sequence
 * Each element appears with a stroke drawing effect
 *
 * DEBUG: Desk scene elements that draw themselves with stroke animation
 * TIME: 10ms - 810ms (desk scene phase)
 * ELEMENTS: table, monitors, laptop, keyboard, coffee, notes, pen
 */
const createDeskDrawingAnimations = () => {
  const startTime = SCENE_TIMING.desk;

  return [
    ["desktable polygon", drawStrokes(startTime, 600)], // 10-610ms: Main desk surface
    ["deskmonitor1 *", drawStrokes(startTime + 100, 300)], // 110-410ms: Left monitor
    ["desklaptop *", drawStrokes(startTime + 150, 60)], // 160-220ms: Laptop
    ["deskkeyboard *", drawStrokes(startTime + 180, 300)], // 190-490ms: Keyboard
    ["deskcoffee *", drawStrokes(startTime + 240, 30)], // 250-280ms: Coffee cup
    ["desknotes *", drawStrokes(startTime + 280, 60)], // 290-350ms: Notebook
    ["deskpen *", drawStrokes(startTime + 300, 20)], // 310-330ms: Pen
    ["deskmonitor2 *", drawStrokes(startTime + 400, 300)], // 410-710ms: Right monitor
  ];
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

  return [
    ["wireframe1 *", drawStrokesAndHide(startTime, 30, 1, 100)], // 800-930ms: First wireframe
    ["wireframe2 *", drawStrokesAndHide(startTime + 100, 30, 1, 100)], // 900-1030ms: Second wireframe
    ["wireframe3 *", drawStrokesAndHide(startTime + 200, 30, 1, 100)], // 1000-1130ms: Third wireframe
    ["wireframe4 *", drawStrokesAndHide(startTime + 300, 30, 1, 100)], // 1100-1230ms: Fourth wireframe
  ];
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

  for (let i = 1; i <= 10; i++) {
    const selector = i === 1 ? "logo1" : `logo${i} *`;
    const delay = (i - 1) * 50;

    logoAnimations.push([
      selector,
      drawStrokesAndHide(startTime + delay, 60, 0.25), // Each logo: draw for 60ms, fade at 0.25 opacity
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

  const explosionConfig = [
    { element: "desklaptop", x: -100, y: -10, scale: 1, delay: 0 },
    { element: "deskmonitor1", x: -100, y: -200, scale: 1, delay: 10 },
    { element: "desklogos", x: -100, y: -200, scale: 1, delay: 10 },
    { element: "wireframe4", x: -100, y: -200, scale: 1, delay: 10 },
    { element: "desktopsource", x: 0, y: -300, scale: 1, delay: 15 },
    { element: "deskmonitor2", x: 0, y: -300, scale: 1, delay: 15 },
    { element: "deskpen", x: -50, y: -200, scale: 1, delay: 15 },
    { element: "desknotes", x: -30, y: -300, scale: 1, delay: 15 },
    { element: "deskkeyboard", x: -20, y: -300, scale: 1, delay: 15 },
    { element: "deskcoffee", x: -40, y: -100, scale: 1, delay: 5 },
  ];

  return explosionConfig.map(({ element, x, y, scale, delay }) => [
    element,
    explodeIt(x, y, scale, delay, startTime),
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
  const [startTime] = SCENE_TIMING.contacts;
  const flickerTimes = [0, 160, 200, 240, 280, 320, 360, 400];
  const animation = { 0: { opacity: 0 } };

  // Create flicker pattern
  flickerTimes.forEach((time) => {
    const flickerStart = startTime + time;
    animation[flickerStart - 1] = { opacity: 0 };
    animation[flickerStart] = { opacity: 1 };
    animation[flickerStart + 30] = { opacity: 1 };
    animation[flickerStart + 31] = { opacity: 0 };
  });

  return ["errorscr1", animation];
};

/**
 * Creates space scene animations
 * Example: Space element appears, moves, and fades out
 */
const createSpaceAnimations = (transforms) => {
  const [spaceStart, spaceEnd] = SCENE_TIMING.space; // Use frame scene timing as a base, adjust as needed

  const animationStart = spaceStart - 50; // Start animation slightly before space scene begins

  return [
    [
      "space",
      {
        0: { opacity: 0 },
        [spaceStart]: {
          opacity: 0,
          transform: transforms.space,
        },
        [spaceStart + 50]: {
          opacity: 1,
          transform: transforms.space,
        },
      },
    ],
    [
      "sl1 *",
      {
        [animationStart + 200]: { strokeDashoffset: 2800, opacity: 1 },
        [animationStart + 830]: { strokeDashoffset: 1, opacity: 1 },
      },
    ],
    [
      "sl2 *",
      {
        [animationStart + 200]: { strokeDashoffset: 800, opacity: 1 },
        [animationStart + 830]: { strokeDashoffset: 1, opacity: 1 },
      },
    ],
    [
      "sl3 *",
      {
        [animationStart + 200]: { strokeDashoffset: 400, opacity: 0 },
        [animationStart + 500]: { strokeDashoffset: 400, opacity: 0 },
        [animationStart + 501]: { strokeDashoffset: 400, opacity: 1 },
        [animationStart + 1030]: { strokeDashoffset: 1, opacity: 1 },
      },
    ],
    [
      "sl4 *",
      {
        [animationStart + 200]: { strokeDashoffset: 2800, opacity: 1 },
        [animationStart + 830]: { strokeDashoffset: 1, opacity: 1 },
      },
    ],
    [
      "sl5 *",
      {
        [animationStart + 200]: { strokeDashoffset: 1000, opacity: 0 },
        [animationStart + 400]: { strokeDashoffset: 1000, opacity: 0 },
        [animationStart + 401]: { strokeDashoffset: 1000, opacity: 1 },
        [animationStart + 830]: { strokeDashoffset: 1, opacity: 1 },
      },
    ],
    [
      "sl6 *",
      {
        [animationStart + 200]: { strokeDashoffset: 800, opacity: 0 },
        [animationStart + 400]: { strokeDashoffset: 800, opacity: 0 },
        [animationStart + 401]: { strokeDashoffset: 800, opacity: 1 },
        [animationStart + 830]: { strokeDashoffset: 1, opacity: 1 },
      },
    ],
    [
      "sl7 *",
      {
        [animationStart + 200]: { strokeDashoffset: 2000, opacity: 1 },
        [animationStart + 830]: { strokeDashoffset: 1, opacity: 1 },
      },
    ],
  ];
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
    freelance: [freelanceStart, freelanceEnd],
    company: [companyStart, companyEnd],
    founder: [founderStart, founderEnd],
    frame: [frameStart, frameEnd],
    lightsOff: [lightsOffStart, lightsOffEnd],
    contacts: [contactsStart, contactsEnd],
    space: [spaceStart, spaceEnd],
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
    frame: [frameStart, frameEnd],
    contacts: [, contactsEnd],
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
    contacts: [contactsStart, contactsEnd],
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
    ["interior", display(frameEnd, 1, contactsEnd - 300, 250)],
    ["daylights", display(frameEnd + 1100, 1, contactsEnd - 300, 250)],
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
const createTerminalAnimations = (transforms) => {
  const {
    lightsOff: [lightsOffStart],
    contacts: [contactsStart, contactsEnd],
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
        // [contactsStart - 300]: { opacity: 1, transform: scale(1) },
        // [contactsStart - 270]: { opacity: 0, transform: scale(0.7) },
      },
    ],
    [
      "terminal1",
      {
        0: { opacity: 0 },
        [lightsOffStart + 600]: { opacity: 0, transform: scale(0.7) },
        [lightsOffStart + 630]: { opacity: 1, transform: scale(1) },
        // [contactsStart - 300]: { opacity: 1, transform: scale(1) },
        // [contactsStart - 270]: { opacity: 0, transform: scale(0.7) },
      },
    ],
    [
      "terminal2",
      {
        0: { opacity: 0 },
        [contactsStart - 500]: { opacity: 0, transform: scale(0.7) },
        [contactsStart - 270]: { opacity: 1, transform: scale(1) },
      },
    ],

    // Terminal text animations with typing effect
    [
      "terminal2textclip",
      {
        [contactsStart - 300]: { transform: scale(1, 1) },
        [contactsStart - 200]: { transform: scale(2.6, 1) },
      },
    ],
    [
      "terminal2cursor",
      {
        [contactsStart - 300]: { transform: translate(0, 0) },
        [contactsStart - 201]: { transform: translate(52, 0) },
        [contactsStart - 200]: { transform: translate(28, 12) },
      },
    ],
    [
      "terminal2line2",
      {
        ...appearAt(contactsStart - 200),
        ...disappearAt(contactsStart + 200),
      },
    ],

    // Final error screens
    createErrorScreenAnimation(),
    [
      "errorscr2",
      {
        0: { opacity: 0 },
        [contactsStart + 519]: {
          opacity: 0,
          transform: transforms.scrollHint,
        },
        [contactsStart + 520]: {
          opacity: 1,
          transform: transforms.scrollHint,
        },
      },
    ],
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

  // Combine all animation groups
  return new Map([
    // Core narrative and camera movements
    ...createCoreSceneTransitions(transforms),

    // Source code and programming elements
    ...createSourceCodeAnimations(),

    // Environment and room transitions
    ...createEnvironmentAnimations(),

    // Frame and landscape animations
    ...createFrameAnimations(transforms),

    // Detail elements (shadows, windows, etc.)
    ...createDetailAnimations(),

    // Terminal and tech interface
    ...createTerminalAnimations(transforms),

    // Generated animation sequences
    ...createDeskDrawingAnimations(),
    ...createWireframeAnimations(),
    ...createCompanyLogoAnimations(),
    ...createDeskExplosionAnimations(),
    ...createShadowAnimations(),
    ...createLightingAnimations(),
    ...createSpaceAnimations(transforms), // <-- Added here
  ]);
};

// ============================
// EXPORTS
// ============================

export default {
  duration: DURATION,
  transitions: createTransitions,

  // Export debugger for external access (development only)
  ...(process.env.NODE_ENV === "development" && {
    debugger: animationDebugger,
    sceneTiming: SCENE_TIMING,
  }),
};
