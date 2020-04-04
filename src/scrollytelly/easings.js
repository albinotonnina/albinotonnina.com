// Built-in easing functions.
const easings = {
  begin() {
    return 0;
  },
  end() {
    return 1;
  },
  linear(p) {
    return p;
  },
  quadratic(p) {
    return p * p;
  },
  cubic(p) {
    return p * p * p;
  },
  swing(p) {
    return -Math.cos(p * Math.PI) / 2 + 0.5;
  },
  sqrt(p) {
    return Math.sqrt(p);
  },
  outCubic(p) {
    // eslint-disable-next-line no-restricted-properties
    return Math.pow(p - 1, 3) + 1;
  },
  // see https://www.desmos.com/calculator/tbr20s8vd2 for how I did this
  bounce(p) {
    let a;

    if (p <= 0.5083) {
      a = 3;
    } else if (p <= 0.8489) {
      a = 9;
    } else if (p <= 0.96208) {
      a = 27;
    } else if (p <= 0.99981) {
      a = 91;
    } else {
      return 1;
    }

    return 1 - Math.abs((3 * Math.cos(p * a * 1.028)) / a);
  },
};

export default easings;
