import sceneSvg from './scene.svg'
import sceneHtml from './scene.html'

export default {
  init () {
    document.querySelector('[data-scene="scene4"]').innerHTML = sceneHtml
    document.querySelector('[data-scene="scene4"] .svg').innerHTML = sceneSvg

    document.querySelector('#lalineag').addEventListener('click', () => {
      window.open('http://en.wikipedia.org/wiki/La_Linea_(TV_series)')
    })
    document.querySelector('#book1').addEventListener('click', () => {
      window.open('https://youtu.be/9BdtGjoIN4E?t=10s')
    })
    document.querySelector('#book2').addEventListener('click', () => {
      window.open('https://www.youtube.com/watch?v=p0O1VVqRSK0')
    })
    document.querySelector('#book3').addEventListener('click', () => {
      window.open('https://addyosmani.com/resources/essentialjsdesignpatterns/book/')
    })
  }

}
