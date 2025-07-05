/**
 * SCENE TRANSITIONS - MODULAR ARCHITECTURE
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
 * 7. SPACE SCENE - Cosmic sequences and error screens
 * 8. CONTACTS SCENE - Terminal interfaces and contact information
 *
 * MODULAR STRUCTURE:
 * Each scene is now organized into its own module in the scenes/ directory:
 * - scenes/deskScene.js - Desk workspace animations
 * - scenes/freelanceScene.js - Freelance work and wireframes
 * - scenes/companyScene.js - Corporate logos and environment
 * - scenes/founderScene.js - Startup environment setup
 * - scenes/frameScene.js - Landscape and room transitions
 * - scenes/lightsOffScene.js - Dramatic lighting and shadows
 * - scenes/spaceScene.js - Space sequences and error screens
 * - scenes/contactsScene.js - Final contact sequence
 * - scenes/coreSceneTransitions.js - Main camera movements
 *
 * ARCHITECTURE:
 * - Configuration constants (timing, transforms)
 * - Modular scene imports from separate files
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

// Import scene modules
import {
  createDeskDrawingAnimations,
  createDeskEnvironmentAnimations,
  createDeskExplosionAnimations,
  createDeskDetailAnimations,
} from "./scenes/deskScene";
import {
  createWireframeAnimations,
  createSourceCodeAnimations,
  createFreelanceEnvironmentAnimations,
} from "./scenes/freelanceScene";
import {
  createCompanyLogoAnimations,
  createCompanyEnvironmentAnimations,
} from "./scenes/companyScene";
import createFounderEnvironmentAnimations from "./scenes/founderScene";
import createFrameAnimations from "./scenes/frameScene";
import {
  createShadowAnimations,
  createLightingAnimations,
  createTerminalAnimations,
} from "./scenes/lightsOffScene";
import {
  createErrorScreenAnimation,
  createSpaceAnimations,
} from "./scenes/spaceScene";
import createContactsAnimations from "./scenes/contactsScene";
import createCoreSceneTransitions from "./scenes/coreSceneTransitions";

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
// MAIN TRANSITIONS FACTORY
// ============================

/**
 * Main function that creates all scene transitions
 * Combines all animation types into a complete scene
 */
const createTransitions = (isPortrait) => {
  const transforms = getViewportTransforms(isPortrait);

  // Create all animation groups efficiently using imported scene modules
  const animationGroups = [
    // Core scene transitions and camera movements
    createCoreSceneTransitions(SCENE_TIMING, transforms, disappearAt),

    // Desk scene animations
    createDeskDrawingAnimations(SCENE_TIMING, drawStrokes),
    createDeskEnvironmentAnimations(SCENE_TIMING, disappearAt, display),
    createDeskExplosionAnimations(SCENE_TIMING, explodeIt),
    createDeskDetailAnimations(SCENE_TIMING, drawStrokes, display, appearAt),

    // Freelance scene animations
    createWireframeAnimations(SCENE_TIMING, drawStrokesAndHide),
    createSourceCodeAnimations(SCENE_TIMING, animateSourceCodes),
    createFreelanceEnvironmentAnimations(
      SCENE_TIMING,
      display,
      disappearAt,
      drawStrokes
    ),

    // Company scene animations
    createCompanyLogoAnimations(SCENE_TIMING, drawStrokesAndHide),
    createCompanyEnvironmentAnimations(SCENE_TIMING, display, appearAt),

    // Founder scene animations
    createFounderEnvironmentAnimations(SCENE_TIMING, appearAt, translate),

    // Frame scene animations
    createFrameAnimations(
      SCENE_TIMING,
      transforms,
      appearAt,
      disappearAt,
      display,
      translate,
      multiple,
      rotate
    ),

    // Lights off scene animations
    createShadowAnimations(SCENE_TIMING, multiple, translate, scale),
    createLightingAnimations(SCENE_TIMING, multiple, translate, scale),
    createTerminalAnimations(SCENE_TIMING, smokeMachine, scale, translate),

    // Space scene animations
    createSpaceAnimations(
      SCENE_TIMING,
      transforms,
      drawStrokes,
      multiple,
      translate,
      scale
    ),
    [createErrorScreenAnimation(SCENE_TIMING)],

    // Contacts scene animations
    createContactsAnimations(SCENE_TIMING, appearAt, disappearAt, drawStrokes),
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
