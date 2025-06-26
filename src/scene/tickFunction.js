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
      // Don't apply opacity/display styles to stop elements as they break gradients
      if (element.tagName === "stop") {
        return;
      }

      // Apply the style to the element
      element.setAttribute("style", style);

      // However, if this element has stop descendants, ensure they remain visible
      if (style.includes("opacity: 0") || style.includes("display: none")) {
        const stopElements = element.querySelectorAll("stop");
        stopElements.forEach((stop) => {
          const currentStyle = stop.getAttribute("style") || "";
          // Remove opacity and display properties that might have been inherited
          const cleanedStyle = currentStyle
            .replace(/opacity:\s*[^;]*;?/g, "")
            .replace(/display:\s*[^;]*;?/g, "")
            .trim();
          stop.setAttribute("style", cleanedStyle);
        });
      }
    });
  });
};
