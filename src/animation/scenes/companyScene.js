/**
 * COMPANY SCENE ANIMATIONS
 *
 * Handles the corporate work phase with company logos,
 * environment transitions, and explosive elements.
 *
 * TIME: 1200ms - 1600ms (company scene phase)
 * ELEMENTS: company logos, corporate environment, desk explosions
 */

/**
 * Creates company logo animations with sequential appearance
 * Each logo draws and then fades away
 */
export const createCompanyLogoAnimations = (
  SCENE_TIMING,
  drawStrokesAndHide
) => {
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
 * Creates company environment animations
 */
export const createCompanyEnvironmentAnimations = (
  SCENE_TIMING,
  display,
  appearAt
) => {
  const {
    company: [companyStart, companyEnd],
  } = SCENE_TIMING;

  return [
    // Company environment
    ["company", display(companyStart - 50, 50, companyEnd)],
    ["companywalls", display(companyStart + 20, 30, companyEnd - 80, 30)],
    ["companyshadows", display(companyStart + 60, 30, companyEnd - 50, 20)],
    ["companydesk", appearAt(companyStart + 10, 10)],
    ["companyinterior", display(companyStart + 30, 40, companyEnd - 50, 20)],
  ];
};
