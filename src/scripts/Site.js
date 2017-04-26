import * as utils from './utilities';
import scrollDepth from 'scroll-depth';
import $ from 'jquery';
import move from 'move-js';
import async from 'async';
import animation1 from '../svg/scene1/animation';
import animation4 from '../svg/scene4/animation';

export default {
    // queue: [],
    timing: {},
    scenes: {
        scene1: animation1,
        scene4: animation4
    },
    // options: {},
    skrollr: {},
    cache: {},
    isHidden: true,
    // subscriptions: {},
    // trackingAccount: 'UA-265680-29',
    defaults: {
        mobileDeceleration: 0.1,
        scale: 1,
        smoothScrollingDuration: 200,
        smoothScrolling: true
    },

    init: function () {

        if (!Modernizr.inlinesvg || !Modernizr.svg || !Modernizr.svgclippaths) {

            this.hide();

        } else {

            scrollDepth();

            if (utils.isIE()) {
                $('.vignette').passThrough('.box');
            }

            this.addLoader();

            utils.ajax('svg/timing.json', {}, 'json', (data) => {
                var begin = 0;

                for (var scene in data) {
                    begin += data[scene].offset;
                    data[scene].begin = begin;
                    data[scene].end = begin + data[scene].duration;
                    begin += data[scene].duration;
                }

                this.timing = data;

                this.buildScenes(this.timing);

                async.each($('[data-scene]'), this.loadScene.bind(this), () => {

                    $(document.head).append($('<script/>', {
                        src: 'scripts/skrollr.js'
                    }));

                    this.clickEvents();

                    this.resize();

                    this.initSkrollr();

                    $('body > div,figure[role=loader]').fadeOut('300');

                    if (utils.isMobile()) {

                        const mql = window.matchMedia('(orientation: portrait)');

                        if (mql.matches) {
                            this.hide();
                        } else {
                            this.show(() => {
                                this.activateCvLink();
                            });
                        }
                        mql.addListener((m) => {
                            if (m.matches) {
                                this.hide();
                            } else {
                                this.show();
                            }
                        });
                    } else {
                        this.show(() => {
                            this.movetheThing();
                            this.activateCvLink();
                        });
                    }
                });
            }, () => {
                this.hide();
            });
        }
    },

    initSkrollr: function () {
        let renderTimeout;
        const options = Object.assign(this.defaults, {
            render: function (obj) {
                if (renderTimeout) {
                    clearTimeout(renderTimeout);
                }
                renderTimeout = setTimeout(() => {
                    for (let name in this.scenes) {

                        if (typeof this.scenes[name].render === 'function') {

                            const pos = this.time(obj, this.timing[name] || {
                                    begin: 0,
                                    end: 1
                                });

                            this.scenes[name].render(pos, obj);
                        }
                    }
                }, 1);


            }
        });



        this.skrollr = skrollr.init(options);

        skrollr.menu.init(this.skrollr, {
            animate: true,
            easing: 'swing',
            scenes: this.timing,
            scale: 1,
            duration: function (currentTop, targetTop) {
                return Math.abs(currentTop - targetTop) * 0.5;
            }
        });
    },

    addLoader: function () {
        var site = document.createElement('figure');
        $(site).attr('role', 'site');
        $('body').append(site);
        var loader = document.createElement('figure');
        $(loader).attr('role', 'loader');
        $('body').append(loader);
        var spinner = document.createElement('div');
        $(spinner).attr('class', 'spinner');
        $(loader).append(spinner);
    },

    addVideoPlayer: function () {
        $('#videoPlayer').append('<iframe id="vimeoPlayer" src="//player.vimeo.com/video/88016428" width="100%" height="100%"  frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
    },

    resize: function () {

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
            this.hide(true);
        } else {

            if (skrollr.get()) {
                this.unhide();
            }

        }

        var maxAspectRatio = bBox.width / viewBox.height;
        var minAspectRatio = viewBox.width / bBox.height;
        var viewBoxRatio = viewBox.width / viewBox.height;

        $('[data-scene] svg').each(function () {
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

        $('nav svg').each(function () {
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

    },

    buildScenes: function (obj) {

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

        utils.ajax('svg/menu/scene.svg', {}, 'html', function (data) {
            $('nav').append(data);
        });

        $('figure[role=site]').append('<div id="videoPlayer" />');

        if (!utils.isMobile()) {
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
    },

    loadScene: function (element, callback) {
        const elObj = $(element);
        const name = elObj.data('scene');

        utils.ajax('svg/' + name + '/scene.svg', {}, 'html', (data) => {

            elObj.append(data);

            if (this.scenes[name] && this.scenes[name].easing) {
                $.extend(options, this.scenes[name]);
            }

            callback();

        }, function (request, status, error) {
            console.log(error);
        });
    },

    clickEvents: function () {

        $('#lalineag').bind('click', function () {
            window.open('http://en.wikipedia.org/wiki/La_Linea_(TV_series)');
        });

        $('#intro2,#numidia').bind('click', function () {
            window.open('http://www.numidia.it', '_blank');
        });

        $('#viewresume').bind('click', this.hide.bind(this));

        $('#email').bind('click', function () {
            window.open('mailto:albinotonnina@gmail.com');
        });

        $('#linkedin').bind('click', function () {
            window.open('http://www.linkedin.com/in/albinotonnina', '_blank');
        });

        $('#phone').bind('click', function () {
            window.open('tel:+393934318597');
        });

        $('#skype').bind('click', function () {
            window.open('skype:albino.tonnina');
        });

        $('#l500px').bind('click', function () {
            window.open('http://500px.com/albinotonnina', '_blank');
        });

        $('#contactresume').bind('click',  this.hide.bind(this));

        $('#githubsite').bind('click', function () {
            window.open('http://github.com/albinotonnina/albinotonnina.com', '_blank');
        });

        $('#worksharelogo,#junetext').bind('click', function () {
            window.open('http://www.workshare.com', '_blank');
        });

        $('#pegu').bind('click', function () {
            window.open('http://www.pegu.it', '_blank');
        });

        $('#reopen').bind('click',  (e) => {
            this.show();
            e.preventDefault();
        });
    },

    framecount: function () {
        $('.debug').html(window.scrollY / this.defaults.scale + '<br>' + (window.scrollY + window.innerHeight) / this.defaults.scale);
    },

    time: function (obj, timing) {
        if (obj.curTop <= timing.begin * this.defaults.scale) {
            return 0;
        }
        if (obj.curTop >= timing.end * this.defaults.scale) {
            return 1;
        }
        return (obj.curTop - timing.begin * this.defaults.scale) / timing.duration * this.defaults.scale;
    },

    removeMe: function () {
        move('figure[role=site]')
            .set('opacity', 0)
            .end(() => {
                $('figure[role=site]').html('');
                $('body').css('height', 'auto').removeClass('this').addClass('myresume');
                $('body > div').fadeIn('300', () => {
                    this.skrollr.destroy();
                    $('html,body').css('overflow-y', 'scroll');
                });
            });
    },

    activateCvLink: function () {
        move('#scrolldown')
            .delay('1s')
            .set('opacity', 1)
            .end(function () {
                move('#viewresume')
                    .set('opacity', 1)
                    .end();
            });
    },

    movetheThing: function () {
        var pos = $('#scrollthing').position();
        var group = document.getElementById('scrollthing').getBoundingClientRect();
        move('#scrollthing')
            .x($(window).innerWidth() - pos.left - group.width - 50 - 100)
            .y(Math.abs(pos.top) + 50)
            .delay('2s')
            .end(function () {
                move('#cursor')
                    .duration(800)
                    .translate(45, 0)
                    .end(function () {
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
    },

    beforePrint: function () {
        $('body').css('height', 'auto');
        $('figure').css('display', 'none');
        $('body div').css('display', 'block');
    },

    afterPrint: function () {
    },

    hide: function (soft) {

        this.isHidden = true;

        $('figure[role=site]').hide('400',  () => {

            $('html,body').css('overflow-y', 'scroll');

            $('body').css('height', 'auto').removeClass('this').addClass('myresume');

            $('body > div').fadeIn();

            if (!soft) {
                this.skrollr.destroy();
                $('html, body').animate({
                    scrollTop: 0
                }, 400);
            }

        });
    },

    show: function (callback) {
        $('html, body').css('overflow-y', 'scroll').animate({
            scrollTop: 0
        }, 400,  () => {
            if (this.isHidden) {

                $('figure[role=site]').show('400',  () => {

                    $('body').removeClass('myresume').removeClass('it').addClass('this');

                    this.isHidden = false;

                    if (skrollr.get()) {
                        this.skrollr.refresh();
                    } else {
                        this.initSkrollr();
                    }
                });

                if (callback) {
                    callback();
                }
            }
        });
    },

    unhide: function () {

        if (this.isHidden) {

            $('figure[role=site]').show('400',  () => {

                $('body').removeClass('myresume').removeClass('it').addClass('this');

                this.isHidden = false;

                if (skrollr.get()) {
                    this.skrollr.refresh();
                } else {
                    this.initSkrollr();
                }

            });

        }
    }
};
