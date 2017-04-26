import $ from "jquery";
import Site from './Site';


/*
 Events
 */

$(function () {
    waitForWebfonts(['roboto'], function () {
        Site.init();
    });
});

$(window).on('unload', () => {
    Site.removeMe();
});

$(window).resize(function () {
    Site.resize();
});

//$(window).scroll(function() {
//Site.framecount();
//});

window.onbeforeprint = Site.beforePrint;

window.onafterprint = Site.afterPrint;

window.onload = function () {
    setTimeout(function () {
        window.scrollTo(0, -1);
    }, 0);
};

if (window.matchMedia) {
    const mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function (mql) {
        if (mql.matches) {
            Site.beforePrint();
        } else {
            Site.afterPrint();
        }
    });
}

$.fn.passThrough = function (target) {
    var $target = $(target);
    return this.each(function () {
        var style = this.style;
        if ('pointerEvents' in style) {
            style.pointerEvents = style.userSelect = style.touchCallout = 'none';
        } else {
            $(this).on('click tap mousedown mouseup mouseenter mouseleave', function (e) {
                $target.each(function () {
                    var rect = this.getBoundingClientRect();
                    if (e.pageX > rect.left && e.pageX < rect.right &&
                        e.pageY > rect.top && e.pageY < rect.bottom) {
                        $(this).trigger(e.type);
                    }

                });
            });
        }
    });

};



//http://stackoverflow.com/questions/5680013/how-to-be-notified-once-a-web-font-has-loaded
function waitForWebfonts(fonts, callback) {
    var loadedFonts = 0;

    function doNode(font) {
        let node = document.createElement('span');
        // Characters that vary significantly among different fonts
        node.innerHTML = 'giItT1WQy@!-/#';
        // Visible - so we can measure it - but not on the screen
        node.style.position = 'absolute';
        node.style.left = '-10000px';
        node.style.top = '-10000px';
        // Large font size makes even subtle changes obvious
        node.style.fontSize = '300px';
        // Reset any font properties
        node.style.fontFamily = 'sans-serif';
        node.style.fontVariant = 'normal';
        node.style.fontStyle = 'normal';
        node.style.fontWeight = 'normal';
        node.style.letterSpacing = '0';
        document.body.appendChild(node);
        // Remember width with no applied web font
        var width = node.offsetWidth;
        node.style.fontFamily = font;
        var interval;

        function checkFont() {
            // Compare current width with original width
            if (node && node.offsetWidth !== width) {
                ++loadedFonts;
                node.parentNode.removeChild(node);
                node = null;
            }
            // If all fonts have been loaded
            if (loadedFonts >= fonts.length) {
                if (interval) {
                    clearInterval(interval);
                }
                if (loadedFonts === fonts.length) {
                    callback();
                    return true;
                }
            }
        }

        if (!checkFont()) {
            interval = setInterval(checkFont, 50);
        }
    }

    for (let i = 0, l = fonts.length; i < l; ++i) {
        doNode(fonts[i]);
    }
};
