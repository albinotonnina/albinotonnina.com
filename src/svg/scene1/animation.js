import anime from 'animejs'
import sceneSvg from './scene.svg'
import sceneHtml from './scene.html'

export default {
  lightlast: 'none',
  lastKeyPercentage: 0,
  minY: 400,
  maxY: 700,
  isOnscreen: false,

  init (site) {
    document.querySelector('[data-scene="scene1"]').innerHTML = sceneHtml

    document.querySelector('[data-scene="scene1"] .svg').innerHTML = sceneSvg

    document.querySelector('#intro2').addEventListener('click', () => {
      window.open('http://www.workshare.com', '_blank')
    })

    document.querySelector('#viewresume').addEventListener('click', () => {
      site.destroy()
    })

    this.activateCvLink()

    this.sceneTiming = site.timing.scene1
  },

  beforerender: function (data) {
    const scrolledPercentage = this.getScrolledPercentage(data, this.sceneTiming)

    this.isOnscreen = scrolledPercentage > 0 && scrolledPercentage <= 100
  },

  getScrolledPercentage (data, timing) {
    if (data.curTop <= timing.begin || data.curTop >= timing.end) {
      return 0
    }

    return Math.abs(((data.curTop - timing.begin) / timing.duration) * 100).toFixed(3)
  },

  render: function (data) {
    if (!this.isOnscreen) {
      return
    }

    this.renderMbpLight(data)
  },

  renderMbpLight (data) {
    const scrolledPercentage = this.getScrolledPercentage(data, this.sceneTiming)
    const keyFreqPercentage = Math.floor(Math.random() * 6) + 5

    if (scrolledPercentage > 0 && scrolledPercentage < 100) {
      const shouldExecute = Math.abs(scrolledPercentage - this.lastKeyPercentage) > keyFreqPercentage

      if (shouldExecute) {
        this.lightlast = this.lightlast === 'none' ? 'inline' : 'none'
        document.querySelector('#mbplight').style.display = this.lightlast

        this.lastKeyPercentage = scrolledPercentage
      }
    }
  },

  activateCvLink () {
    anime({targets: '#scrolldown', opacity: 1, delay: 1500})
    anime({targets: '#viewresume', opacity: 1, delay: 2500})
  }
}
