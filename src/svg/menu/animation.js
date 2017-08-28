import scene_svg from './scene.svg';
import scene_html from './scene.html';

export default {

    init() {
        document.querySelector('#menu').innerHTML = scene_html;
        document.querySelector('#menu .svg').innerHTML = scene_svg;
    }
};
