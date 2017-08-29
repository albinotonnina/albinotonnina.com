import WebFont from 'webfontloader';

export const waitForWebfonts = function (fonts, callback) {
    WebFont.load({
        google: {
            families: fonts
        },
        active: callback
    });
};

export const setAttributes = (el, attrs) => {
    for (let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
};

export const isMobile = function () {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
};

export const createElementWithAttrs = (tagName, attrs) => {
    const el = document.createElement(tagName);
    setAttributes(el, attrs);
    return el;
};

export const shouldFallbackToBoringCV = () => {
    const maxHeight = 768 / 1024 * window.innerWidth;
    return document.documentElement.clientHeight > maxHeight;
};