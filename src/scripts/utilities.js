import WebFont from 'webfontloader';
import fetch from 'node-fetch';

export const waitForWebfonts = function (fonts, callback) {
    WebFont.load({
        google: {
            families: fonts
        },
        active: callback
    });
};

export const ajax = function (url, onSuccess, onFailure) {
    const baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/`;

    fetch(baseUrl + url)
        .then(function (res) {
            return res.text();
        })
        .then(function (body) {
            if (typeof onSuccess === 'function') {
                onSuccess(body);
            }
        })
        .catch(function (err) {
            if (typeof onFailure === 'function') {
                onFailure(err)
            }
        });

};

export const isMobile = function () {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
};

export const isIE = function () {
    const myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
};

export const setAttributes = (el, attrs) => {
    for (let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
};

export const createElementWithAttrs = (tagName, attrs) => {
    const el = document.createElement(tagName);
    setAttributes(el, attrs);
    return el;
};

export const addScript = (filepath, callback) => {
    if (filepath) {

        const fileref = createElementWithAttrs('script', {
            type: 'text/javascript',
            src: filepath
        });

        const head = document.getElementsByTagName('head')[0];

        let done = false;

        fileref.onload = fileref.onreadystatechange = (ev) => {
            if (!done && (!ev.readyState || ev.readyState === 'loaded' || ev.readyState === 'complete')) {
                done = true;

                callback();

                // Handle memory leak in IE
                fileref.onload = fileref.onreadystatechange = null;
                if (head && fileref.parentNode) {
                    head.removeChild(fileref);
                }
            }
        };

        head.appendChild(fileref);
    }
};