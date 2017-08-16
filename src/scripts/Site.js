import anime from 'animejs';
import * as utils from './utilities';
import async from 'async';
import animation1 from '../svg/scene1/animation';
import animation4 from '../svg/scene4/animation';
import animation5 from '../svg/scene5/animation';
import animation6 from '../svg/scene6/animation';
import timing from './timing';

export default class {

    constructor() {

        this.scenes = {
            scene1: animation1,
            scene4: animation4,
            scene5: animation5,
            scene6: animation6
        };

        this.defaults = {
            mobileDeceleration: 0.001,
            scale: 1,
            smoothScrollingDuration: 200,
            smoothScrolling: true
        };

        this.timing = timing.scenes;

        this.buildScenes();
    }

    buildScenes() {
        const vignette = utils.createElementWithAttrs('div', {id: 'vignette'});
        const nav = utils.createElementWithAttrs('nav', {
            id: 'menu'
        });

        this.siteRoot = utils.createElementWithAttrs('figure', {role: 'site'});
        this.siteRoot.appendChild(vignette);
        this.siteRoot.appendChild(nav);

        utils.get('svg/menu/scene.svg', data => {
            nav.innerHTML = data;
        });

        this.loader = utils.createElementWithAttrs('figure', {id: 'loader'});

        document.body.setAttribute('data-display', 'divertissement');
        document.body.appendChild(this.siteRoot);
        document.body.appendChild(this.loader);

        async.each(this.timing, this.loadScene.bind(this), this.onLoadedScenes.bind(this));
    }

    onLoadedScenes() {
        this.injectDependencies({
            onComplete: this.initDivertissement.bind(this)
        });
    }

    loadScene(scene, callback) {
        const sceneEl = utils.createElementWithAttrs('div', {
            'data-scene': scene.name,
            id: scene.name
        });

        this.siteRoot.appendChild(sceneEl);

        this.loadHtml(sceneEl, scene.name, () => {
            this.loadSvg(sceneEl, scene.name, () => {

                const sceneScripts = this.scenes[scene.name];

                if (sceneScripts && typeof sceneScripts.init === 'function') {
                    sceneScripts.init(this);
                }

                callback();
            });
        });
    }

    loadHtml(sceneEl, sceneName, callback) {
        utils.get('svg/' + sceneName + '/scene.html', (data) => {
            sceneEl.innerHTML = data;
            callback();
        });
    }

    loadSvg(sceneEl, sceneName, callback) {
        utils.get('svg/' + sceneName + '/scene.svg', (data) => {
            sceneEl.querySelector('.svg').innerHTML = data;
            callback();
        });
    }

    injectDependencies({onComplete}) {
        document.head.appendChild(utils.createElementWithAttrs('link', {
            'data-skrollr-stylesheet': true,
            rel: 'stylesheet',
            type: 'text/css',
            href: 'styles/animation.css'
        }));

        utils.addScript('scripts/skrollr.js', onComplete);
    }

    initDivertissement() {
        this.removeLoader();
        this.resize();
        this.activateCvLink();
    }

    removeLoader() {
        document.body.removeChild(this.loader);
    }

    resizeScenes() {

        let svgWidth, svgHeight;
        svgWidth = window.innerWidth;
        svgHeight = document.documentElement.clientHeight;

        const scenes = document.querySelectorAll('[data-scene] svg');

        [].forEach.call(scenes, function (scene) {
            utils.setAttributes(scene, {
                width: svgWidth,
                height: svgHeight
            })
        });
    }

    resizeMenu() {

        utils.setAttributes(document.querySelector('#menu svg'), {
            width: window.innerWidth,
            height: (document.documentElement.clientHeight * 60) / 768
        });

        document.querySelector('#menu').style.width = `${window.innerWidth}px`;
        document.querySelector('#menu').style.height = `${(document.documentElement.clientHeight * 60) / 768}px`;

    }

    resize() {
        const maxHeight = 768 / 1024 * window.innerWidth;
        const shouldShowResume = document.documentElement.clientHeight > maxHeight;

        if (shouldShowResume) {
            this.destroy();
        } else {
            this.resizeMenu();
            this.resizeScenes();

            setTimeout(() => {
                this.show();
            }, 500)
        }
    }

    time(obj, timing) {
        if (obj.curTop <= timing.begin * this.defaults.scale) {
            return 0;
        }
        if (obj.curTop >= timing.end * this.defaults.scale) {
            return 1;
        }

        return (obj.curTop - timing.begin * this.defaults.scale) / timing.duration * this.defaults.scale;
    }

    activateCvLink() {
        anime({targets: '#scrolldown', opacity: 1, delay: 1000});
        anime({targets: '#viewresume', opacity: 1, delay: 2000});
    }

    initSkrollr() {

        if (!skrollr.get()) {
            this.skrollr = skrollr.init(Object.assign(this.defaults, {
                render: this.skrollrOnRender.bind(this)
            }));

            this.skrollrInitMenu();

        } else {
            this.skrollr.refresh();
        }
    }

    skrollrOnRender(obj) {
        for (let name in this.scenes) {

            if (typeof this.scenes[name].render === 'function') {
                const pos = this.time(obj, this.timing[name] || {
                    begin: 0,
                    end: 1
                });
                this.scenes[name].render(pos, obj);
            }
        }
    }

    skrollrInitMenu() {
        skrollr.menu.init(this.skrollr, {
            animate: true,
            easing: 'swing',
            scenes: this.timing,
            scale: 1,
            duration(currentTop, targetTop) {
                return Math.abs(currentTop - targetTop) * 0.5;
            }
        });
    }

    show() {
        this.siteRoot.setAttribute('uiState', 'show');
        this.initSkrollr();
    }

    destroy() {
        document.body.removeAttribute('style');
        document.body.removeAttribute('data-display');
        this.siteRoot.setAttribute('uiState', 'hidden');
        if (skrollr.get()) {
            this.skrollr.destroy();
            window.scroll(0, 0);
        }
    }

};
