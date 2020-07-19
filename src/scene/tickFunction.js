import SvgFilter from "svg-filter";
import calculateStyles from "./calculateStyles";

import { browser } from "./transition-utilities";

const shakishaki = new SvgFilter();

shakishaki
  .append("turbulence")
  .attr("baseFrequency", "0.01 0.05")
  .attr("numOctaves", 2)
  .attr("seed", 4)
  .attr("stitchTiles", "noStitch")
  .attr("result", "turbulence");

shakishaki
  .append("displacement-map")
  .attr("id", "filter3disp")
  .attr("in", "SourceGraphic")
  .attr("in2", "turbulence")
  .attr("scale", 10)
  .attr("xChannelSelector", "G")
  .attr("yChannelSelector", "A")
  .attr("result", "displacement-map");

export default (transitionsData, transitionElements) => {
  const currentFrame = window.pageYOffset;

  if (browser.startsWith("chrom")) {
    if (currentFrame > 6000 && currentFrame < 6600) {
      document.querySelector("#leftroom").setAttribute("filter", shakishaki);
      document
        .querySelector("#filter3disp")
        .setAttribute("scale", parseInt(Math.random() * 40, 10));
    } else {
      document.querySelector("#leftroom").setAttribute("filter", "none");
    }
  }

  const styles = calculateStyles(currentFrame, transitionsData);

  styles.forEach(({ selector, style }) => {
    transitionElements.get(selector).forEach((element) => {
      element.setAttribute("style", style);
    });
  });
};
