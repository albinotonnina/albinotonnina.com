import sceneSvg from './scene.svg'
import sceneHtml from './scene.html'

export default {

  init () {
    document.querySelector('[data-scene="scene2"]').innerHTML = sceneHtml
    document.querySelector('[data-scene="scene2"] .svg').innerHTML = sceneSvg
  }
}
