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
            scene5: animation5,
            scene4: animation4,
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

    buildScenes() {

        this.siteRoot = utils.createElementWithAttrs('figure', {
            role: 'site'
        });

        this.loader = utils.createElementWithAttrs('figure', {
            id: 'loader'
        });

        const vignette = utils.createElementWithAttrs('div', {
            id: 'vignette'
        });

        const nav = utils.createElementWithAttrs('nav', {
            id: 'menu'
        });

        this.siteRoot.appendChild(vignette);
        this.siteRoot.appendChild(nav);

        utils.get('svg/menu/scene.svg', (data) => {
            nav.innerHTML = data;
        });

        for (let key in this.timing) {
            this.siteRoot.appendChild(utils.createElementWithAttrs('div', {
                'data-scene': key,
                id: key
            }));
        }

        document.body.setAttribute('data-display', 'divertissement');
        document.body.appendChild(this.siteRoot);
        document.body.appendChild(this.loader);

        async.each(document.querySelectorAll('[data-scene]'), this.loadScene.bind(this), this.onLoadedScenes.bind(this));
    }

    onLoadedScenes(){
        for (let name in this.scenes) {
            if (typeof this.scenes[name].init === 'function') {
                this.scenes[name].init(this);
            }
        }

        this.injectDependencies({
            onComplete: this.initDivertissement.bind(this)
        });
    }

    loadScene(element, callback) {
        this.loadHtml(element, () => {
            this.loadSvg(element, callback);
        });
    }

    loadHtml(element, callback) {
        utils.get('svg/' + element.getAttribute('data-scene') + '/scene.html', (data) => {
            element.innerHTML = data;
            callback();
        });
    }

    loadSvg(element, callback) {
        utils.get('svg/' + element.getAttribute('data-scene') + '/scene.svg', (data) => {
            element.querySelector('.svg').innerHTML = data;
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
