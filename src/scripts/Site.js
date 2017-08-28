import * as utils from './utilities';
import menu from '../svg/menu/animation';
import scene1 from '../svg/scene1/animation';
import scene2 from '../svg/scene2/animation';
import scene3 from '../svg/scene3/animation';
import scene4 from '../svg/scene4/animation';
import scene5 from '../svg/scene5/animation';
import scene6 from '../svg/scene6/animation';
import skrollrscripts from '../libs/skrollr.scripts';

import timing from './timing';
import '../styles/main.scss';
import '../svg/animation.scss';

const skrollr = skrollrscripts();

export default class {

    constructor() {

        this.scenes = {
            scene1,
            scene2,
            scene3,
            scene5,
            scene4,
            scene6
        };

        this.defaults = {
            mobileDeceleration: 0.001,
            smoothScrollingDuration: 200,
            smoothScrolling: true
        };

        this.timing = timing.scenes;

        this._buildDOMElements();
        this._initScenes();
        this._initDivertissement();
    }

    removeLoader() {
        document.body.removeChild(document.querySelector('#loader'));
    }

    resizeScenes() {
        const innerWidth = window.innerWidth;
        const clientHeight = document.documentElement.clientHeight;

        [].forEach.call(document.querySelectorAll('[data-scene] svg'), scene => {
            utils.setAttributes(scene, {
                width: innerWidth,
                height: clientHeight
            })
        });

        utils.setAttributes(document.querySelector('#menu svg'), {
            width: innerWidth,
            height: (clientHeight * 60) / 768
        });

        document.querySelector('#menu').style.width = `${innerWidth}px`;
        document.querySelector('#menu').style.height = `${(clientHeight * 60) / 768}px`;
    }

    resize() {
        if (utils.shouldFallbackToBoringCV()) {
            this.destroy();
        } else {
            this.resizeScenes();

            setTimeout(this.show.bind(this), 500)
        }

    }

    _buildDOMElements() {
        this.siteRoot = utils.createElementWithAttrs('figure', {role: 'site'});

        const vignette = utils.createElementWithAttrs('div', {id: 'vignette'});
        const nav = utils.createElementWithAttrs('nav', {id: 'menu'});
        this.siteRoot.appendChild(vignette);
        this.siteRoot.appendChild(nav);

        for (let key in this.timing) {
            this.siteRoot.appendChild(utils.createElementWithAttrs('div', {
                'data-scene': key,
                id: key
            }));
        }

        document.body.appendChild(this.siteRoot);
    }

    _initScenes() {
        for (let name in this.scenes) {
            this.scenes[name].init(this);
        }

        menu.init(this);
    }

    _initDivertissement() {

        this.removeLoader();

        if (!utils.shouldFallbackToBoringCV()) {
            this.initSkrollr();
            this.resizeScenes();
            this.show();
        }
    }

    getSkrollrConfiguration() {
        return {
            render: data => {
                for (let name in this.scenes) {
                    if (typeof this.scenes[name].render === 'function') {
                        this.scenes[name].render(data);
                    }
                }

            },
            beforerender: data => {
                for (let name in this.scenes) {
                    if (typeof this.scenes[name].beforerender === 'function') {
                        this.scenes[name].beforerender(data);
                    }
                }
            }
        }
    }

    initSkrollr() {

        if (!skrollr.get()) {

            this.skrollr = skrollr.init(Object.assign(this.defaults, this.getSkrollrConfiguration()));
            skrollr.stylesheets.init();

            skrollr.menu.init(this.skrollr, {
                animate: true,
                easing: 'swing',
                scenes: this.timing,
                scale: 1,
                duration(currentTop, targetTop) {
                    return Math.abs(currentTop - targetTop) * 0.5;
                }
            });
        } else {
            this.skrollr.refresh();
        }
    }

    show() {
        document.body.setAttribute('data-display', 'divertissement');
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
