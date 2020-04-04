import * as utils from "./utilities";

const resizePlaceholders = ({ maxScroll, siteRoot }) => {
  const { clientHeight } = document.documentElement;

  const screens = Math.round(maxScroll / clientHeight);

  const arrayScreens = Array.from(Array(screens).keys());

  document
    .querySelectorAll("[data-scene-placeholder]")
    .forEach((placeholder) => {
      placeholder.parentNode.removeChild(placeholder);
    });

  arrayScreens.forEach(() => {
    const placeholder = utils.createElementWithAttrs("div", {
      "data-scene-placeholder": true,
    });

    document.body.insertBefore(placeholder, siteRoot);
  });

  document
    .querySelectorAll("[data-scene-placeholder]")
    .forEach((placeholder) => {
      placeholder.style.height = `${clientHeight}px`;
    });
};

export default resizePlaceholders;
