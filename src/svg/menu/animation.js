import sceneSvg from './scene.svg'
import sceneHtml from './scene.html'

export default {

  init () {
    document.querySelector('#menu').innerHTML = sceneHtml
    document.querySelector('#menu .svg').innerHTML = sceneSvg
  }
}
