// polyfill for missing safari 5 svg transform via css
(function(document, skrollr) {
  'use strict';

  var _setStyle = skrollr.setStyle;

  skrollr.setStyle = function(el, prop, val) {
    _setStyle.apply(this, arguments);

    var style = el.style;

    if (prop === 'transform') {
      el.setAttribute('transform', val.replace(/(deg|px)/ig, ''));
    }
    if (prop === 'd') {
      el.setAttribute('d', val);
    }
  };

}(document, window.skrollr));
// polyfill for missing safari 5 svg transform via css