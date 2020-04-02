import skrollr from "./skrollr";
import skrollrmenu from "./skrollr.menu";
import skrollrstylesheets from "./skrollr.stylesheets";

export default function () {
  const thisSkrollr = skrollr(window, document);

  skrollrstylesheets(thisSkrollr);

  skrollrmenu(thisSkrollr);

  return thisSkrollr;
}
