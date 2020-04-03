(function (document, window) {
  module.exports = function (scrollyTelly) {
    const DEFAULT_DURATION = 500;
    const DEFAULT_EASING = "sqrt";
    const DEFAULT_SCALE = 1;

    const MENU_OFFSET_ATTR = "data-menu-offset";

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
    var handleLink = function (link, fake) {};

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

    const defer = function (fn) {
      window.setTimeout(fn, 1);
    };

    let _scrollyTellyInstance;

    let _easing;
    let _duration;
    let _animate;
    let _handleLink;
    let _scale;
    let _scenes;

    const init = function (scrollyTelly) {
      /*
           Global menu function accessible through window.scrollyTelly.menu.init.
       */
      scrollyTelly.menu = {};
      scrollyTelly.menu.init = function (scrollyTellyInstance, options) {
        _scrollyTellyInstance = scrollyTellyInstance;

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
        // scrollyTelly.addEvent(document, "click", handleClick);

        if (supportsHistory) {
          // scrollyTelly.addEvent(
          //   window,
          //   "popstate",
          //   function (e) {
          //     const state = e.state || {};
          //     const top = state.top || 0;
          //     defer(function () {
          //       window.scrollTo(0, top);
          //     });
          //   },
          //   false
          // );
        }

        jumpStraightToHash();
      };

      // Private reference to the initialized scrollyTelly.

      // In case the page was opened with a hash, prevent jumping to it.
      // http://stackoverflow.com/questions/3659072/jquery-disable-anchor-jump-when-loading-a-page
      defer(function () {
        if (window.location.hash) {
          window.scrollTo(0, 0);
        }
      });
    };

    init(scrollyTelly);
  };
})(document, window);
