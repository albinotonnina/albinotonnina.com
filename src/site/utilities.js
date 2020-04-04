import WebFont from "webfontloader";

export const waitForWebfonts = (fonts, callback) => {
  WebFont.load({
    google: {
      families: fonts,
    },
    active: callback,
  });
};

export const setAttributes = (el, attrs) => {
  Object.entries(attrs).forEach(([key, attr]) => el.setAttribute(key, attr));
};

export const createElementWithAttrs = (tagName, attrs) => {
  const el = document.createElement(tagName);
  setAttributes(el, attrs);
  return el;
};

export const shouldFallbackToBoringCV = () => {
  const maxHeight = (768 / 1024) * window.innerWidth;
  return window.innerHeight > maxHeight;
};

export const onBeforePrint = (callback) => {
  if ("matchMedia" in window) {
    // Chrome, Firefox, and IE 10 support mediaMatch listeners
    window.matchMedia("print").addListener((media) => {
      if (media.matches) {
        callback();
      }
    });
  } else {
    // IE and Firefox fire before/after events
    window.onbeforeprint = callback;
  }
};

export const createThreshold = (height) => {
  const count = window.Math.ceil(height / 1);
  const t = [];
  const ratio = 1 / count;
  for (let i = 0; i < count; i += 1) {
    t.push(i * ratio);
  }
  return t;
};
