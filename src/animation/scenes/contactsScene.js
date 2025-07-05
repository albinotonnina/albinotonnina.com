/**
 * CONTACTS SCENE ANIMATIONS
 *
 * Handles the final contact and open source sequence,
 * including door animations and text transitions.
 *
 * TIME: 13400ms - 15200ms (contacts scene phase)
 * ELEMENTS: contacts, door, lighting, text
 */

/**
 * Creates contacts scene animations
 */
const createContactsAnimations = (
  SCENE_TIMING,
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
    ["opensourcetext", appearAt(contactsStart + 1800, 100)],
    ["contactstext", disappearAt(contactsStart + 1000, 100)],
    ["doorhand *", drawStrokes(contactsStart + 2600, 100, 10)],
  ];
};

export default createContactsAnimations;
