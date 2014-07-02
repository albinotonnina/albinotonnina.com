/* 
	www.albinotonnina.com
 */
'use strict';


var Site;
Site = {};
Site.queue = [];
Site.timing = {};
Site.scenes = {};
Site.options = {};
Site.skrollr = {};
Site.cache = {};
Site.isHidden = true;
Site.subscriptions = {};
Site.trackingAccount = 'UA-265680-29';
Site.defaults = {
	mobileDeceleration: 0.1,
	scale: 1,
	smoothScrollingDuration: 200,
	smoothScrolling: true
};
Site.addVideoPlayer = function() {
	$('#videoPlayer').append('<iframe id="vimeoPlayer" src="//player.vimeo.com/video/88016428" width="100%" height="100%"  frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
};
Site.ajax = function(url, data, datatype, success, failure) {
	$.ajax({
		type: 'get',
		url: url,
		data: data,
		dataType: datatype,
		success: function(data) {

			success(data);
		},
		error: function(request, status, error) {

			failure(request, status, error);
		}
	});
};
Site.resize = function() {

	var windowWidth = $(window).innerWidth();
	var windowHeight = $(window).innerHeight();
	var windowAspectRatio = windowWidth / windowHeight;
	var viewBox = {
		width: 1024,
		height: 768
	};
	var bBox = {
		width: 3 * viewBox.width,
		height: 3 * viewBox.height
	};

	var maxHeight = viewBox.height / viewBox.width * windowWidth;
	if (windowHeight > maxHeight) {
		Site.hide(true);
	} else {


		if (skrollr.get()) {
			Site.unhide();
		}


	}

	var maxAspectRatio = bBox.width / viewBox.height;
	var minAspectRatio = viewBox.width / bBox.height;
	var viewBoxRatio = viewBox.width / viewBox.height;

	$('[data-scene] svg').each(function() {
		var $svg = $(this);
		if (windowAspectRatio > maxAspectRatio) {
			$svg.attr({
				width: windowWidth,
				height: windowWidth / maxAspectRatio
			});
		} else if (windowAspectRatio < minAspectRatio) {
			$svg.attr({
				width: minAspectRatio * windowHeight,
				height: windowHeight
			});
		} else {
			$svg.attr({
				width: windowWidth,
				height: windowHeight
			});
		}
	});

	viewBox = {
		width: 1024,
		height: 60
	};
	bBox = {
		width: 3 * viewBox.width,
		height: 3 * viewBox.height
	};

	maxAspectRatio = (bBox.width / (viewBox.height));
	minAspectRatio = viewBox.width / (bBox.height - 768);
	viewBoxRatio = viewBox.width / viewBox.height;


	$('nav svg').each(function() {
		var $svg = $(this);


		var attrs;
		if (windowAspectRatio > maxAspectRatio) {
			attrs = {
				width: windowWidth,
				height: windowWidth / maxAspectRatio
			};
			$svg.attr(attrs);
			$('nav').css(attrs);
		} else if (windowAspectRatio < minAspectRatio) {
			attrs = {
				width: minAspectRatio * windowHeight,
				height: (windowHeight * 60) / 768
			};
			$svg.attr(attrs);
			$('nav').css(attrs);
		} else {
			attrs = {
				width: windowWidth,
				height: (windowHeight * 60) / 768
			};
			$svg.attr(attrs);
			$('nav').css(attrs);
		}
	});


};

Site.addLoader = function() {
	var site = document.createElement('figure');
	$(site).attr('role', 'site');
	$('body').append(site);
	var loader = document.createElement('figure');
	$(loader).attr('role', 'loader');
	$('body').append(loader);
	var spinner = document.createElement('div');
	$(spinner).attr('class', 'spinner');
	$(loader).append(spinner);
};
Site.buildScenes = function(obj) {
	$(document.head).append(
		$('<link/>')
		.attr({
			'data-skrollr-stylesheet': true,
			rel: 'stylesheet',
			type: 'text/css',
			href: 'styles/animation.css'
		})
	);
	$('figure[role=site]').append('<nav/>');
	Site.ajax('svg/menu/scene.svg', {}, 'html', function(data) {
		$('nav').append(data);
	});
	$('figure[role=site]').append('<div id="videoPlayer" />');
	if (!Site.isMobile()) {
		$('aside').append('<h3><a id="reopen" href="#">Re-open full version</a></h3>');
	}
	//var debug = document.createElement('div');
	//$(debug).attr('class', 'debug');
	//$('figure[role=site]').append(debug);
	var vignette = document.createElement('div');
	$(vignette).attr('class', 'vignette');
	$('figure[role=site]').append(vignette);
	var sc = 1;
	for (var key in obj) {
		var scene = document.createElement('div');
		$(scene).attr('data-scene', key);
		$(scene).attr('id', 'scene' + sc);
		$('figure[role=site]').append(scene);
		sc++;
	}
};

Site.loadScene = function(element, callback) {
	var $element = $(element);
	var name = $element.data('scene');
	Site.ajax('svg/' + name + '/scene.svg', {}, 'html', function(data) {
		$element.append(data);
		if (Site.scenes[name] && Site.scenes[name].easing) {
			$.extend(options, Site.scenes[name]);
		}
		callback();
	}, function(request, status, error) {
		console.log(error);
	});
};
Site.clickEvents = function() {
	$('#lalineag').bind('click', function() {
		window.open('http://en.wikipedia.org/wiki/La_Linea_(TV_series)');
	});
	$('#intro2,#numidia').bind('click', function() {
		window.open('http://www.numidia.it', '_blank');
	});
	$('#viewresume').bind('click', function() {
		Site.hide();
	});
	$('#email').bind('click', function() {
		window.open('mailto:albinotonnina@gmail.com');
	});
	$('#linkedin').bind('click', function() {
		window.open('http://www.linkedin.com/in/albinotonnina', '_blank');
	});
	$('#phone').bind('click', function() {
		window.open('tel:+393934318597');
	});
	$('#skype').bind('click', function() {
		window.open('skype:albino.tonnina');
	});
	$('#l500px').bind('click', function() {
		window.open('http://500px.com/albinotonnina', '_blank');
	});
	$('#contactresume').bind('click', function() {
		Site.hide();
	});
	$('#githubsite').bind('click', function() {
		window.open('http://github.com/albinotonnina/albinotonnina.com', '_blank');
	});
	$('#worksharelogo,#junetext').bind('click', function() {
		window.open('http://www.workshare.com', '_blank');
	});
	$('#pegu').bind('click', function() {
		window.open('http://www.pegu.it', '_blank');
	});


	$('#reopen').bind('click', function(e) {
		Site.show();
		e.preventDefault();
	});
};



//http://stackoverflow.com/questions/5680013/how-to-be-notified-once-a-web-font-has-loaded
Site.waitForWebfonts = function(fonts, callback) {
	var loadedFonts = 0;

	function doNode(font) {
		var node = document.createElement('span');
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



	for (var i = 0, l = fonts.length; i < l; ++i) {
		doNode(fonts[i]);
	}
};
Site.framecount = function() {
	$('.debug').html(window.scrollY / this.defaults.scale + '<br>' + (window.scrollY + window.innerHeight) / this.defaults.scale);
};
Site.time = function(obj, timing) {
	if (obj.curTop <= timing.begin * Site.defaults.scale) {
		return 0;
	}
	if (obj.curTop >= timing.end * Site.defaults.scale) {
		return 1;
	}
	return (obj.curTop - timing.begin * Site.defaults.scale) / timing.duration * Site.defaults.scale;
};
Site.removeMe = function() {
	move('figure[role=site]')
		.set('opacity', 0)
		.end(function() {
			$('figure[role=site]').html('');
			$('body').css('height', 'auto').removeClass('this').addClass('myresume');
			$('body > div').fadeIn('300', function() {
				Site.skrollr.destroy();
				$('html,body').css('overflow-y', 'scroll');
			});
		});
};

Site.activateCvLink = function() {
	move('#scrolldown')
		.delay('1s')
		.set('opacity', 1)
		.end(function() {
			move('#viewresume')
				.set('opacity', 1)
				.end();
		});
};
Site.movetheThing = function() {
	var pos = $('#scrollthing').position();
	var group = document.getElementById('scrollthing').getBoundingClientRect();
	move('#scrollthing')
		.x($(window).innerWidth() - pos.left - group.width - 50)
		.y(Math.abs(pos.top) + 50)
		.delay('2s')
		.end(function() {
			move('#cursor')
				.duration(800)
				.translate(45, 0)
				.end(function() {
					move('#moving')
						.duration(800)
						.translate(0, 50)
						.then()
						.duration(800)
						.translate(0, 25)
						.then()
						.translate(0, -50)
						.duration(800)
						.pop()
						.pop()
						.end();
				});
		});
};
Site.beforePrint = function() {
	$('body').css('height', 'auto');
	$('figure').css('display', 'none');
	$('body div').css('display', 'block');
};
Site.afterPrint = function() {};
Site.hide = function(soft) {
	Site.isHidden = true;
	$('figure[role=site]').hide('400', function() {
		$('html,body').css('overflow-y', 'scroll');
		$('body').css('height', 'auto').removeClass('this').addClass('myresume');
		$('body > div').fadeIn();

		if (!soft) {
			Site.skrollr.destroy();
			$('html, body').animate({
				scrollTop: 0
			}, 400);

		}



	});
};
Site.show = function(callback) {
	$('html, body').css('overflow-y', 'scroll').animate({

		scrollTop: 0

	}, 400, function() {
		if (Site.isHidden) {
			$('figure[role=site]').show('400', function() {
				$('body').removeClass('myresume').removeClass('it').addClass('this');
				Site.isHidden = false;
				if (skrollr.get()) {
					Site.skrollr.refresh();
				} else {
					Site.initSkrollr();
				}
			});
			if (callback) {
				callback();
			}
		}
	});
};


Site.unhide = function() {
	if (Site.isHidden) {
		$('figure[role=site]').show('400', function() {

			$('body').removeClass('myresume').removeClass('it').addClass('this');
			Site.isHidden = false;
			if (skrollr.get()) {
				Site.skrollr.refresh();
			} else {
				Site.initSkrollr();
			}



		});

	}
};


Site.isIE = function() {
	var myNav = navigator.userAgent.toLowerCase();
	return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
};
Site.isMobile = function() {
	return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
};
Site.initSkrollr = function() {
	var renderTimeout;
	$.extend(Site.options, Site.defaults, {
		render: function(obj) {
			if (renderTimeout) {
				clearTimeout(renderTimeout);
			}
			renderTimeout = setTimeout(function() {
				for (var name in Site.scenes) {
					if (typeof Site.scenes[name].render === 'function') {

						var pos = Site.time(obj, Site.timing[name] || {
							begin: 0,
							end: 1
						});
						Site.scenes[name].render(pos, obj);
					}
				}
			}, 1);
		}
	});
	Site.skrollr = skrollr.init(Site.options);
	skrollr.menu.init(Site.skrollr, {
		animate: true,
		easing: 'swing',
		scenes: Site.timing,
		scale: 1,
		duration: function(currentTop, targetTop) {
			return Math.abs(currentTop - targetTop) * 0.5;
		}
	});
};
Site.init = function() {
	if (!Modernizr.inlinesvg || !Modernizr.svg || !Modernizr.svgclippaths) {
		Site.hide();
	} else {
		$.scrollDepth();
		if (Site.isIE()) {
			$('.vignette').passThrough('.box');
		}

		Site.addLoader();
		Site.ajax('svg/timing.json', {}, 'json', function(data) {
			var begin = 0;
			for (var scene in data) {
				begin += data[scene].offset;
				data[scene].begin = begin;
				data[scene].end = begin + data[scene].duration;
				begin += data[scene].duration;
			}
			Site.timing = data;
			Site.buildScenes(Site.timing);
			async.each($('[data-scene]'), Site.loadScene, function() {



				$(document.head).append($('<script/>', {
					src: 'scripts/skrollr.js'
				}));



				Site.clickEvents();
				Site.resize();
				Site.initSkrollr();
				$('body > div,figure[role=loader]').fadeOut('300', function() {});
				if (Site.isMobile()) {
					var mql = window.matchMedia('(orientation: portrait)');
					if (mql.matches) {
						Site.hide();
					} else {
						Site.show(function() {
							Site.activateCvLink();
						});
					}
					mql.addListener(function(m) {
						if (m.matches) {
							Site.hide();
						} else {
							Site.show();
						}
					});
				} else {
					Site.show(function() {
						Site.movetheThing();
						Site.activateCvLink();
					});
				}
			});
		}, function() {
			Site.hide();
		});
	}
};

/*
Events
*/
jQuery(function() {
	Site.waitForWebfonts(['roboto'], function() {
		Site.init();
	});
});
jQuery(window).unload(function() {
	Site.removeMe();
});
jQuery(window).resize(function() {
	Site.resize();
});
//jQuery(window).scroll(function() {
//Site.framecount();
//});
window.onbeforeprint = Site.beforePrint;
window.onafterprint = Site.afterPrint;
window.onload = function() {
	setTimeout(function() {
		window.scrollTo(0, -1);
	}, 0);
};
if (window.matchMedia) {
	var mediaQueryList = window.matchMedia('print');
	mediaQueryList.addListener(function(mql) {
		if (mql.matches) {
			Site.beforePrint();
		} else {
			Site.afterPrint();
		}
	});
}

$.fn.passThrough = function(target) {
	var $target = $(target);
	return this.each(function() {
		var style = this.style;
		if ('pointerEvents' in style) {
			style.pointerEvents = style.userSelect = style.touchCallout = 'none';
		} else {
			$(this).on('click tap mousedown mouseup mouseenter mouseleave', function(e) {
				$target.each(function() {
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