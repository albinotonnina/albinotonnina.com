/*!
 * Plugin for skrollr.
 * This plugin makes hashlinks scroll nicely to their target position.
 *
 * Alexander Prinzhorn - https://github.com/Prinzhorn/skrollr
 *
 * Free to use under terms of MIT license
 *
 *
 * Attention, I modified this file. Albino.
 *
 */
(function (document, window) {
  module.exports = function (skrollr) {
    const DEFAULT_DURATION = 500;
    const DEFAULT_EASING = "sqrt";
    const DEFAULT_SCALE = 1;

    const MENU_OFFSET_ATTR = "data-menu-offset";

    // var skrollr = window.skrollr;
    const { history } = window;
    const supportsHistory = !!history.pushState;

    /*
           Since we are using event bubbling, the element that has been clicked
           might not acutally be the link but a child.
       */
    var findParentLink = function (element) {
      // Yay, it's a link!

      if (element.tagName === "A" || element.tagName === "text") {
        return element;
      }

      // We reached the top, no link found.
      if (element === document) {
        return false;
      }

      // Maybe the parent is a link.
      return findParentLink(element.parentNode);
    };

    /*
           Handle the click event on the document.
       */
    const handleClick = function (e) {
      // Only handle left click.

      if (e.which !== 1 && e.button !== 0) {
        return;
      }

      const link = findParentLink(e.target);

      // The click did not happen inside a link.
      if (!link) {
        return;
      }

      if (handleLink(link)) {
        e.preventDefault();
      }
    };

    /*
           Handles the click on a link. May be called without an actual click event.
           When the fake flag is set, the link won't change the url and the position won't be animated.
       */
    var handleLink = function (link, fake) {
      const patt = new RegExp("sc-menu[0-9]");
      const isMenu = patt.test(link.id);

      if (!isMenu) {
        return false;
      }
      // Now get the targetTop to scroll to.
      let targetTop;

      let menuTop;

      const scenetoLoad = link.id.replace("sc-menu", "scene");
      const href = `#${scenetoLoad}`;
      // If there's a handleLink function, it overrides the actual anchor offset.
      if (_handleLink) {
        menuTop = _handleLink(link);
      } else {
        menuTop = _scenes[scenetoLoad].begin + _scenes[scenetoLoad].menuoffset;
      }

      if (menuTop !== null) {
        // Is it a percentage offset?
        if (/p$/.test(menuTop)) {
          targetTop =
            (menuTop.slice(0, -1) / 100) *
            document.documentElement.clientHeight;
        } else {
          targetTop = +menuTop * _scale;
        }
      } else {
        const scrollTarget = document.getElementById(href.substr(1));

        // Ignore the click if no target is found.
        if (!scrollTarget) {
          return false;
        }

        targetTop = _skrollrInstance.relativeToAbsolute(
          scrollTarget,
          "top",
          "top"
        );

        const menuOffset = scrollTarget.getAttribute(MENU_OFFSET_ATTR);

        if (menuOffset !== null) {
          targetTop += +menuOffset;
        }
      }
      /*
                     if (supportsHistory && !fake) {
                         history.pushState({
                             top: targetTop
                         }, '', href);
                     }
            */
      // Now finally scroll there.
      if (_animate && !fake) {
        alert("scroll");
      } else {
        defer(function () {
          _skrollrInstance.setScrollTop(targetTop);
        });
      }

      return true;
    };

    const jumpStraightToHash = function () {
      if (window.location.hash && document.querySelector) {
        const link = document.querySelector(
          `a[href="${window.location.hash}"]`
        );

        if (link) {
          handleLink(link, true);
        }
      }
    };

    var defer = function (fn) {
      window.setTimeout(fn, 1);
    };

    let _skrollrInstance;

    let _easing;
    let _duration;
    let _animate;
    let _handleLink;
    let _scale;
    let _scenes;

    const init = function (skrollr) {
      /*
           Global menu function accessible through window.skrollr.menu.init.
       */
      skrollr.menu = {};
      skrollr.menu.init = function (skrollrInstance, options) {
        _skrollrInstance = skrollrInstance;

        options = options || {};
        _scenes = options.scenes || {};
        _easing = options.easing || DEFAULT_EASING;
        _animate = options.animate !== false;
        _duration = options.duration || DEFAULT_DURATION;
        _handleLink = options.handleLink;
        _scale = options.scale || DEFAULT_SCALE;

        if (typeof _duration === "number") {
          _duration = (function (duration) {
            return function () {
              return duration;
            };
          })(_duration);
        }

        // Use event bubbling and attach a single listener to the document.
        skrollr.addEvent(document, "click", handleClick);

        if (supportsHistory) {
          skrollr.addEvent(
            window,
            "popstate",
            function (e) {
              const state = e.state || {};
              const top = state.top || 0;

              defer(function () {
                _skrollrInstance.setScrollTop(top);
              });
            },
            false
          );
        }

        jumpStraightToHash();
      };

      // Private reference to the initialized skrollr.

      // In case the page was opened with a hash, prevent jumping to it.
      // http://stackoverflow.com/questions/3659072/jquery-disable-anchor-jump-when-loading-a-page
      defer(function () {
        if (window.location.hash) {
          window.scrollTo(0, 0);
        }
      });
    };

    init(skrollr);
  };
})(document, window);
