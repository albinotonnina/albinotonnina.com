import * as utils from "./utilities";
import timing from "./timing";

const getTicker = (callback) => {
  const some = document.querySelectorAll("[data-scene-placeholder]");

  // document.body.style.height = `${
  //   maxScroll + document.documentElement.clientHeight
  // }px`;

  const maxScroll = Object.values(timing.scenes).reduce(
    (acc, { duration }) => acc + parseInt(duration, 0),
    0
  );

  const threshold = utils.createThreshold(
    maxScroll + document.documentElement.clientHeight
  );

  const observer = new IntersectionObserver(callback, {
    rootMargin: "0px",
    threshold,
  });

  some.forEach((image) => {
    observer.observe(image);
  });
};

export default getTicker;
