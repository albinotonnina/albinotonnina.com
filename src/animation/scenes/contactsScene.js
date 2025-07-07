/**
 * CONTACTS SCENE ANIMATIONS
 *
 * Handles the final contact and open source sequence,
 * including door animations and text transitions.
 *
 * TIME: 13400ms - 15200ms (contacts scene phase)
 * ELEMENTS: contacts, door, lighting, text
 */

import { multiple, translate, scale, display } from "../transition-utilities";

/**
 * Creates viewport-responsive transform configurations for contacts scene
 */
const getContactsTransforms = (isPortrait) => {
  return {
    contacts: isPortrait
      ? multiple(translate(0, 0), scale(1.5))
      : multiple(translate(0, 0), scale(1)),
  };
};

/**
 * Creates contacts scene animations
 */
const createContactsAnimations = (
  SCENE_TIMING,
  isPortrait,
  appearAt,
  disappearAt,
  drawStrokes
) => {
  const {
    contacts: [contactsStart],
  } = SCENE_TIMING;

  return [
    ["contacts", appearAt(contactsStart, 200)],
    ["door *", drawStrokes(contactsStart + 1000, 800, 10)],
    ["doorlight", appearAt(contactsStart + 1700, 100)],
    ["doorlightwall", appearAt(contactsStart + 1700, 100)],
    ["doorhand *", drawStrokes(contactsStart + 2600, 100, 5)],
    [
      "contactMe",
      {
        [contactsStart]: { opacity: 0, display: "block" },
        [contactsStart + 200]: { opacity: 1, display: "block" },
        [contactsStart + 900]: { opacity: 1, display: "block" },
        [contactsStart + 1000]: { opacity: 0, display: "block" },
      },
    ],
    [
      "sourceCode",
      {
        [contactsStart + 1800]: { opacity: 0, display: "block" },
        [contactsStart + 1900]: { opacity: 1, display: "block" },
        [contactsStart + 2500]: { opacity: 1, display: "block" },
        [contactsStart + 2600]: { opacity: 0, display: "block" },
      },
    ],
  ];
};

export default createContactsAnimations;
