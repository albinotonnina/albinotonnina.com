import scene_svg from './scene.svg';
import scene_html from './scene.html';

export default {

    init() {
        document.querySelector('[data-scene="scene2"]').innerHTML = scene_html;
        document.querySelector('[data-scene="scene2"] .svg').innerHTML = scene_svg;
    }
};
