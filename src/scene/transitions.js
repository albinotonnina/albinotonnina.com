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

const duration = 8200;

export default {
  duration,
  transitions: (isPortrait) => {
    const deskView = 10;
    const freelanceView = [800, 1200];
    const companyView = [1200, 1600];
    const founderView = [1600, 1800];
    const frameView = [1800, 2500];
    const lightsOffView = [4300, 6300];
    const contactsView = [6100, 8400];
    const frameZoomed = isPortrait
      ? multiple(translate(6400, 16800), scale(7.2))
      : multiple(translate(4800, 11360), scale(5));

    const frame = isPortrait
      ? multiple(translate(4000, 7000), scale(3.5))
      : multiple(translate(2200, 2700), scale(1.4));

    const lanyard = isPortrait
      ? multiple(translate(4600, 5400), scale(4))
      : multiple(translate(2200, 1600), scale(1.4));

    const total = isPortrait
      ? multiple(translate(800, -100), scale(0.5))
      : multiple(translate(700, -300), scale(0.3));

    const table = isPortrait
      ? multiple(translate(1030, 200), scale(1.6))
      : multiple(translate(1100, 200), scale(1.8));

    const start = isPortrait
      ? multiple(translate(-4300, -400), scale(5))
      : multiple(translate(-4200, -400), scale(5));

    const freelance = isPortrait
      ? multiple(translate(-980, -200), scale(2))
      : multiple(translate(-500, -200), scale(1.5));

    const company = isPortrait
      ? multiple(translate(-800, 450), scale(1.7))
      : multiple(translate(0, 50), scale(1));

    const founder = isPortrait
      ? multiple(translate(-1100, 0), scale(2))
      : multiple(translate(-300, 0), scale(1.3));

    return new Map([
      [
        "scrollhint",
        {
          0: {
            transform: isPortrait
              ? multiple(translate(-0, -0), scale(4))
              : multiple(translate(0, 0), scale(1)),
          },
          2: {
            opacity: 1,
            transform: isPortrait
              ? multiple(translate(-0, -0), scale(4))
              : multiple(translate(0, 0), scale(1)),
          },
          30: {
            opacity: 0,
            transform: isPortrait
              ? multiple(translate(-0, -0), scale(4))
              : multiple(translate(0, 0), scale(1)),
          },
        },
      ],
      [
        "container",
        {
          0: {
            transform: start,
          },
          [freelanceView[0] - 50]: {
            transform: start,
          },
          [freelanceView[0]]: {
            transform: freelance,
          },
          [companyView[0]]: {
            transform: freelance,
          },
          [companyView[0] + 20]: {
            transform: company,
          },
          [companyView[1] - 30]: {
            transform: company,
          },
          [founderView[0]]: {
            transform: founder,
          },
          [founderView[1] - 30]: {
            opacity: 1,
            transform: founder,
          },
          [founderView[1]]: {
            transform: founder,
            opacity: 0,
          },
        },
      ],
      [
        "helloline",
        {
          [deskView + 200]: {
            strokeDashoffset: 300,
          },
          [deskView + 430]: {
            strokeDashoffset: 0,
          },
          ...disappearAt(freelanceView[0]),
        },
      ],
      [
        "desktopsource path",
        {
          0: {
            opacity: 0,
          },
          [freelanceView[0] - 240]: {
            opacity: 0,
            fillOpacity: 0,
            strokeOpacity: 0,
          },
          [freelanceView[0] - 220]: {
            opacity: 1,
            fillOpacity: 1,
            strokeOpacity: 1,
          },
        },
      ],
      ["source", animateSourceCodes(freelanceView[0] - 240, founderView[1])],
      [
        "lines :nth-child(1n)",
        {
          [freelanceView[0] - 260]: { opacity: 0 },
          [freelanceView[0] - 220]: { opacity: 1 },
        },
      ],
      [
        "lines :nth-child(2n)",
        {
          [freelanceView[0] - 240]: { opacity: 0 },
          [freelanceView[0] - 200]: { opacity: 1 },
        },
      ],
      ["desktable", disappearAt(companyView[0] - 50, 40)],
      [
        "desktablewindowshadow",
        display(freelanceView[0], 1, freelanceView[1] - 40, 10),
      ],
      [
        "laptopwindowshadow",
        display(freelanceView[0], 1, freelanceView[1] - 50),
      ],
      [
        "desktableshadow",
        {
          ...display(freelanceView[0] + 86, 30, freelanceView[1] - 50),
          ...appearAt(companyView[0] + 20),
        },
      ],
      ["desktable polygon", drawStrokes(deskView, 600)],
      ["deskmonitor1 *", drawStrokes(deskView + 100, 300)],
      ["desklaptop *", drawStrokes(deskView + 150, 60)],
      ["deskkeyboard *", drawStrokes(deskView + 180, 300)],
      ["deskcoffee *", drawStrokes(deskView + 240, 30)],
      ["desknotes *", drawStrokes(deskView + 280, 60)],
      ["deskpen *", drawStrokes(deskView + 300, 20)],
      ["deskmonitor2 *", drawStrokes(deskView + 400, 300)],
      ["desktablewindowshadow *", drawStrokes(freelanceView[0], 300)],
      ["wireframe1 *", drawStrokesAndHide(freelanceView[0], 30, 1, 100)],
      ["wireframe2 *", drawStrokesAndHide(freelanceView[0] + 100, 30, 1, 100)],
      ["wireframe3 *", drawStrokesAndHide(freelanceView[0] + 200, 30, 1, 100)],
      ["wireframe4 *", drawStrokesAndHide(freelanceView[0] + 300, 30, 1, 100)],
      ["logo1", drawStrokesAndHide(companyView[0], 60, 0.25)],
      ["logo2 *", drawStrokesAndHide(companyView[0] + 50, 60, 0.25)],
      ["logo3 *", drawStrokesAndHide(companyView[0] + 100, 60, 0.25)],
      ["logo4 *", drawStrokesAndHide(companyView[0] + 150, 60, 0.25)],
      ["logo5 *", drawStrokesAndHide(companyView[0] + 200, 60, 0.25)],
      ["logo6 *", drawStrokesAndHide(companyView[0] + 250, 60, 0.25)],
      ["logo7 *", drawStrokesAndHide(companyView[0] + 300, 60, 0.25)],
      ["logo8 *", drawStrokesAndHide(companyView[0] + 350, 60, 0.25)],
      ["logo9 *", drawStrokesAndHide(companyView[0] + 400, 60, 0.25)],
      ["logo10 *", drawStrokesAndHide(companyView[0] + 450, 60, 0.25)],
      ["freelance path", drawStrokes(freelanceView[0] + 40)],
      ["freelance polygon", drawStrokes(freelanceView[0] + 50, 300)],
      ["chair1 *", drawStrokes(freelanceView[0] + 60, 300)],
      ["desk", display(deskView, 1, frameView[1] - 100)],

      ["desklaptop", explodeIt(-100, -10, 1, 0, companyView[0])],
      ["deskmonitor1", explodeIt(-100, -200, 1, 10, companyView[0])],
      ["desklogos", explodeIt(-100, -200, 1, 10, companyView[0])],
      ["wireframe4", explodeIt(-100, -200, 1, 10, companyView[0])],
      ["desktopsource", explodeIt(0, -300, 1, 15, companyView[0])],
      ["deskmonitor2", explodeIt(0, -300, 1, 15, companyView[0])],
      ["deskpen", explodeIt(-50, -200, 1, 15, companyView[0])],
      ["desknotes", explodeIt(-30, -300, 1, 15, companyView[0])],
      ["deskkeyboard", explodeIt(-20, -300, 1, 15, companyView[0])],
      ["deskcoffee", explodeIt(-40, -100, 1, 5, companyView[0])],

      ["freelance", display(freelanceView[0], 1, freelanceView[1])],
      ["freelancewalls", disappearAt(freelanceView[1] - 60, 5)],
      ["freelancewalls polygon", drawStrokes(freelanceView[0])],
      ["freelanceinterior", disappearAt(freelanceView[1] - 60, 5)],
      ["company", display(companyView[0] - 50, 50, companyView[1])],
      [
        "companywalls",
        display(companyView[0] + 20, 30, companyView[1] - 80, 30),
      ],
      [
        "companyshadows",
        display(companyView[0] + 60, 30, companyView[1] - 50, 20),
      ],
      ["companydesk", appearAt(companyView[0] + 10, 10)],
      [
        "companyinterior",
        display(companyView[0] + 30, 40, companyView[1] - 50, 20),
      ],
      ["founder", appearAt(founderView[0], 50)],
      [
        "founderwalls",
        {
          [founderView[0]]: {
            transform: translate(0, 100),
            opacity: 0,
          },
          [founderView[0] + 20]: {
            opacity: 1,
            transform: translate(0, 0),
          },
        },
      ],
      [
        "founderinterior",
        {
          [founderView[0]]: {
            transform: translate(0, 100),
            opacity: 0,
          },
          [founderView[0] + 20]: {
            opacity: 1,
            transform: translate(0, 0),
          },
        },
      ],

      ["frame", appearAt(frameView[0], 100)],
      // ["sky", appearAt(frameView[0])],
      [
        "skyline",
        {
          ...appearAt(frameView[0] - 1),
          [frameView[0]]: {
            transform: translate(-300, 0),
          },
          [frameView[1]]: {
            transform: translate(520, 0),
          },
        },
      ],
      ["rome", disappearAt(frameView[1])],
      [
        "hotballoon",
        {
          [frameView[0]]: {
            // opacity: 0,
            transform: multiple(translate(-160, 140), rotate(0)),
          },
          [frameView[1] - 200]: {
            // opacity: 1,
            transform: multiple(translate(-130, -20), rotate(0)),
          },
          [frameView[1]]: {
            transform: multiple(translate(-180, 10), rotate(20)),
          },
          [frameView[1] + 200]: {
            transform: multiple(translate(-200, 20), rotate(20)),
          },
        },
      ],
      [
        "framemasked",
        {
          0: {
            clipPath: "none",
          },
          [frameView[1]]: {
            clipPath: "none",
          },
          [frameView[1] + 1]: {
            clipPath: "url(#framemask_1_)",
          },
        },
      ],
      ["leftroom", appearAt(frameView[1], 1)],
      ["interior", display(frameView[1], 1, contactsView[1] - 300, 250)],
      [
        "daylights",
        display(frameView[1] + 1100, 1, contactsView[1] - 300, 250),
      ],
      [
        "room",
        {
          ...appearAt(frameView[0] - 2),
          [frameView[0] - 1]: {
            transform: frameZoomed,
          },
          [frameView[0] + 1]: {
            transform: frameZoomed,
          },
          [frameView[1]]: {
            transform: frameZoomed,
          },
          [frameView[1] + 400]: {
            transform: frame,
          },
          [frameView[1] + 1000]: {
            transform: lanyard,
          },
          [frameView[1] + 1600]: {
            transform: total,
          },
          [lightsOffView[0] + 400]: {
            transform: total,
          },
          [lightsOffView[0] + 600]: {
            transform: table,
          },
        },
      ],

      [
        "chairshadow",
        {
          [lightsOffView[0]]: {
            transform: multiple(translate(0, 0), scale(0.8, 1)),
            opacity: 0.6,
          },
          [lightsOffView[0] + 300]: {
            transform: multiple(translate(0, 0), scale(1, 1)),
            opacity: 0,
          },
        },
      ],
      [
        "tableshadow",
        {
          0: {
            opacity: 0,
          },
          [lightsOffView[0]]: {
            transform: multiple(translate(0, 0), scale(0.8, 1)),
            opacity: 0.6,
          },
          [lightsOffView[0] + 300]: {
            transform: multiple(translate(0, 0), scale(1, 1)),
            opacity: 0,
          },
        },
      ],
      [
        "table2shadow",
        {
          0: {
            opacity: 0,
          },
          [lightsOffView[0]]: {
            transform: multiple(translate(0, 0), scale(0.8, 1)),
            opacity: 0.6,
          },
          [lightsOffView[0] + 300]: {
            transform: multiple(translate(0, 0), scale(1, 1)),
            opacity: 0,
          },
        },
      ],

      [
        "dodge",
        {
          0: {
            opacity: 0,
          },
          [lightsOffView[0]]: {
            transform: multiple(translate(-100, 0), scale(1)),
            opacity: 1,
          },
          [lightsOffView[0] + 500]: {
            transform: multiple(translate(-200, 0), scale(1.6)),
            opacity: 0,
          },
        },
      ],
      [
        "light",
        {
          0: {
            opacity: 0,
          },
          [lightsOffView[0] + 349]: {
            opacity: 0,
          },
          [lightsOffView[0] + 350]: {
            opacity: 0.4,
          },
        },
      ],
      [
        "light2",
        {
          0: {
            opacity: 0,
          },
          [lightsOffView[0] + 349]: {
            opacity: 0,
          },
          [lightsOffView[0] + 350]: {
            opacity: 0.4,
          },
        },
      ],

      [
        "dark1",
        {
          0: {
            opacity: 0,
          },
          [lightsOffView[0]]: {
            opacity: 0,
          },
          [lightsOffView[0] + 300]: {
            opacity: 0,
          },
          [lightsOffView[0] + 400]: {
            opacity: 0.7,
          },
        },
      ],
      [
        "dark2",
        {
          0: {
            opacity: 0,
          },
          [lightsOffView[0]]: {
            opacity: 0,
          },
          [lightsOffView[0] + 349]: {
            opacity: 0.7,
          },
          [lightsOffView[0] + 350]: {
            opacity: 0,
          },
        },
      ],
      ["smoke1", smokeMachine(lightsOffView[0] - 100, 7)],
      ["smoke2", smokeMachine(lightsOffView[0], 7)],
      [
        "window1",
        {
          0: {
            opacity: 0,
          },
          [lightsOffView[0] + 800]: {
            opacity: 0,
            transform: scale(0.7),
          },
          [lightsOffView[0] + 830]: {
            opacity: 1,
            transform: scale(1),
          },
          [contactsView[0] - 300]: {
            opacity: 1,
            transform: scale(1),
          },
          [contactsView[0] - 270]: {
            opacity: 0,
            transform: scale(0.7),
          },
        },
      ],
      [
        "terminal1",
        {
          0: {
            opacity: 0,
          },
          [lightsOffView[0] + 600]: {
            opacity: 0,
            transform: scale(0.7),
          },
          [lightsOffView[0] + 630]: {
            opacity: 1,
            transform: scale(1),
          },
          [contactsView[0] - 300]: {
            opacity: 1,
            transform: scale(1),
          },
          [contactsView[0] - 270]: {
            opacity: 0,
            transform: scale(0.7),
          },
        },
      ],
      [
        "terminal2",
        {
          0: {
            opacity: 0,
          },
          [contactsView[0] - 400]: {
            opacity: 0,
            transform: scale(0.7),
          },
          [contactsView[0] - 370]: {
            opacity: 1,
            transform: scale(1),
          },
        },
      ],

      [
        "terminal2textclip",
        {
          [contactsView[0] - 300]: {
            transform: scale(1, 1),
          },
          [contactsView[0] - 200]: {
            transform: scale(2.6, 1),
          },
        },
      ],
      [
        "terminal2cursor",
        {
          [contactsView[0] - 300]: {
            transform: translate(0, 0),
          },
          [contactsView[0] - 201]: {
            transform: translate(52, 0),
          },
          [contactsView[0] - 200]: {
            transform: translate(28, 12),
          },
        },
      ],
      [
        "terminal2line2",
        {
          ...appearAt(contactsView[0] - 200),
          ...disappearAt(contactsView[0] + 200),
        },
      ],
      [
        "errorscr1",
        {
          0: {
            opacity: 0,
          },
          [contactsView[0] - 1]: {
            opacity: 0,
          },
          [contactsView[0]]: {
            opacity: 1,
          },
          [contactsView[0] + 30]: {
            opacity: 1,
          },
          [contactsView[0] + 31]: {
            opacity: 0,
          },
          [contactsView[0] + 160]: {
            opacity: 0,
          },
          [contactsView[0] + 161]: {
            opacity: 1,
          },
          [contactsView[0] + 200]: {
            opacity: 1,
          },
          [contactsView[0] + 201]: {
            opacity: 0,
          },
          [contactsView[0] + 240]: {
            opacity: 1,
          },
          [contactsView[0] + 241]: {
            opacity: 0,
          },
          [contactsView[0] + 280]: {
            opacity: 1,
          },
          [contactsView[0] + 281]: {
            opacity: 0,
          },
          [contactsView[0] + 320]: {
            opacity: 1,
          },
          [contactsView[0] + 321]: {
            opacity: 0,
          },
          [contactsView[0] + 360]: {
            opacity: 1,
          },
          [contactsView[0] + 361]: {
            opacity: 0,
          },
          [contactsView[0] + 400]: {
            opacity: 1,
          },
          [contactsView[0] + 401]: {
            opacity: 0,
          },
        },
      ],
      [
        "errorscr2",
        {
          0: {
            opacity: 0,
          },
          [contactsView[0] + 519]: {
            opacity: 0,
            transform: isPortrait
              ? multiple(translate(-160, -100), scale(2))
              : multiple(translate(0, 0), scale(1)),
          },
          [contactsView[0] + 520]: {
            opacity: 1,
            transform: isPortrait
              ? multiple(translate(-160, -100), scale(2))
              : multiple(translate(0, 0), scale(1)),
          },
        },
      ],
    ]);
  },
};
