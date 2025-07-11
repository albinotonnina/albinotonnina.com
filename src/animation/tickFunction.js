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

  const styles = calculateStyles(currentFrame, transitionsData);

  // Update debugger if available (development only)
  if (process.env.NODE_ENV === "development" && window.animationDebugger) {
    // Extract active element names from the styles
    const activeElements = styles.map(
      ({ selector }) => selector.replace("#", "") // Remove the # prefix to get just the element name
    );

    window.animationDebugger.update(currentFrame, activeElements);
  }

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

  styles.forEach(({ selector, style }) => {
    const elements = transitionElements.get(selector);
    if (!elements) return;

    elements.forEach((element) => {
      // Skip null/undefined elements
      if (!element) return;

      // Don't apply opacity/display styles to stop elements as they break gradients
      if (element.tagName === "stop") {
        return;
      }

      // Apply the style to the element
      element.setAttribute("style", style);

      // However, if this element has stop descendants, ensure they remain visible
      if (style.includes("opacity: 0") || style.includes("display: none")) {
        // Only call querySelectorAll if the method exists
        if (element.querySelectorAll) {
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
      }
    });
  });
};
