export const rotate = (x) => `rotate(${x}deg)`;

export const scale = (x, y) => `scale(${x}, ${y || x})`;

export const translate = (x, y) => `translate(${x}px, ${y}px)`;

export const multiple = (...cssFunctions) => cssFunctions.join(" ");

export const smokeMachine = (start, repetitions) => {
  const transitions = {};
  const duration = 400;

  for (let r = 0; r < repetitions; r++) {
    transitions[start + duration * r] = {
      opacity: 0,
      transform: multiple(
        translate(0, parseInt(0 - Math.random() * 100 - 100, 10)),
        scale(1, 1)
      ),
    };

    transitions[start + duration * r + 1] = {
      opacity: 0.3,
      transform: multiple(translate(0, 0), scale(1, 1)),
    };
  }

  return transitions;
};

export const appearAt = (start, duration = 1) => ({
  0: {
    opacity: 0,
  },
  [start]: {
    opacity: 0,
  },
  [start + duration]: {
    opacity: 1,
  },
});

export const disappearAt = (start, duration = 1) => ({
  [start]: {
    opacity: 1,
  },
  [start + duration]: {
    opacity: 0,
  },
});

export const display = (start, durationStart, end, durationEnd) => ({
  ...appearAt(start, durationStart),
  ...disappearAt(end, durationEnd),
});

export const explodeIt = (
  offsetX = -500,
  offsetY = 200,
  scaleXY = 2,
  rotateDeg = 0,
  start
) => {
  const idle = {
    transform: multiple(translate(0, 0), scale(1), rotate(0)),
  };
  const idle2 = {
    transform: multiple(translate(0, 0), scale(0.8), rotate(0)),
  };

  return {
    0: idle,
    [start - 70]: idle,
    [start - 20]: {
      transform: multiple(
        translate(offsetX, offsetY),
        scale(scaleXY),
        rotate(rotateDeg)
      ),
    },
    [start]: idle2,
    [start + 20]: idle,
  };
};

export const drawStrokes = (start = 0, strokeDasharray = 1280, speed = 1) => {
  const keyframe = 100 * speed;

  return {
    0: {
      opacity: 0,
    },
    [0 + start - 1]: {
      opacity: 0,
    },
    [0 + start]: {
      opacity: 1,
      strokeDashoffset: strokeDasharray,
      strokeDasharray,
      strokeOpacity: 1,
      fillOpacity: 0,
    },
    [keyframe / 2 + start]: {
      opacity: 1,
      strokeDashoffset: 0,
      strokeDasharray,
      fillOpacity: 0,
      strokeOpacity: 1,
    },
    [keyframe + start]: {
      opacity: 1,
      strokeDashoffset: 0,
      strokeDasharray,
      fillOpacity: 1,
      strokeOpacity: 0,
    },
  };
};

export const drawStrokesAndHide = (start, strokeDasharray, speed, end = 80) => {
  const keyframe = 50 * speed;
  return {
    ...drawStrokes(start, strokeDasharray, speed),
    ...{
      [start + end - 20]: {
        opacity: 1,
        strokeDashoffset: 0,
        strokeDasharray,
        fillOpacity: 1,
        strokeOpacity: 0,
      },
      [start + keyframe + end]: {
        opacity: 0,
        strokeDashoffset: 0,
        strokeDasharray,
        fillOpacity: 0,
        strokeOpacity: 0,
      },
    },
  };
};

export const animateSourceCodes = (start, end) => {
  const timeActive = end - start;

  const times = parseInt(timeActive / 50, 10);
  const output = {};

  for (let index = 0; index < times; index++) {
    output[start + 50 * index] = {
      transform: translate(0, `${(Math.random() * 50).toFixed(2) - 40}`),
    };
  }

  return output;
};

export const getTransitionElements = (transitions) => {
  const map = new Map();

  transitions.forEach((_, key) => {
    const selector = `#${key}`;
    const elements = document.querySelectorAll(selector);
    map.set(selector, elements);
  });

  return map;
};

export const browser = ((agent) => {
  switch (true) {
    case agent.indexOf("edge") > -1:
      return "edge";
    case agent.indexOf("edg") > -1:
      return "chromium-edge";
    case agent.indexOf("opr") > -1 && !!window.opr:
      return "opera";
    case agent.indexOf("chrome") > -1 && !!window.chrome:
      return "chrome";
    case agent.indexOf("trident") > -1:
      return "ie";
    case agent.indexOf("firefox") > -1:
      return "firefox";
    case agent.indexOf("safari") > -1:
      return "safari";
    default:
      return "other";
  }
})(window.navigator.userAgent.toLowerCase());
