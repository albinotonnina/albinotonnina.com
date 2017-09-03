import sceneSvg from './scene.svg'
import sceneHtml from './scene.html'

export default {

  init () {
    document.querySelector('[data-scene="scene3"]').innerHTML = sceneHtml
    document.querySelector('[data-scene="scene3"] .svg').innerHTML = sceneSvg
  }
}
