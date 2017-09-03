import * as utils from './utilities'
import menu from '../svg/menu/animation'
import scene1 from '../svg/scene1/animation'
import scene2 from '../svg/scene2/animation'
import scene3 from '../svg/scene3/animation'
import scene4 from '../svg/scene4/animation'
import scene5 from '../svg/scene5/animation'
import scene6 from '../svg/scene6/animation'
import skrollrscripts from '../libs/skrollr.scripts'
import { debounce } from 'throttle-debounce'
import timing from './timing'
import '../styles/main.scss'
import '../svg/animation.scss'

const skrollr = skrollrscripts()

export default class {
  constructor () {
    this.scenes = {
      scene1,
      scene2,
      scene3,
      scene5,
      scene4,
      scene6
    }

    this.defaults = {
      mobileDeceleration: 0.001,
      smoothScrollingDuration: 200,
      smoothScrolling: true
    }

    this.timing = timing.scenes

    this._initEvents()
    this._addEventToReopenBtn()
    this._buildDOMElements()
    this._initScenes()
    this._hideLoader()
  }

  _addEventToReopenBtn () {
    if (document.querySelector('#reopen')) {
      document.querySelector('#reopen').addEventListener('click', ev => {
        ev.preventDefault()
        this.show()
      })
    }
  }

  _initEvents () {
    window.onresize = debounce(100, false, this.initDivertissement.bind(this))
    utils.onBeforePrint(this.destroy.bind(this))
  }

  _hideLoader () {
    document.querySelector('#loader').setAttribute('uiState', 'hidden')
  }

  resizeScenes () {
    const innerWidth = window.innerWidth
    const clientHeight = utils.isMobile() ? document.documentElement.clientHeight : window.innerHeight;

    [].forEach.call(document.querySelectorAll('[data-scene] svg'), scene => {
      utils.setAttributes(scene, {
        width: innerWidth,
        height: clientHeight
      })
    })

    utils.setAttributes(document.querySelector('#menu svg'), {
      width: innerWidth,
      height: (clientHeight * 60) / 768
    })

    document.querySelector('#menu').style.width = `${innerWidth}px`
    document.querySelector('#menu').style.height = `${(clientHeight * 60) / 768}px`
  }

  _buildDOMElements () {
    this.siteRoot = utils.createElementWithAttrs('figure', {role: 'site'})
    const nav = utils.createElementWithAttrs('nav', {id: 'menu'})
    this.siteRoot.appendChild(nav)
    for (let key in this.timing) {
      this.siteRoot.appendChild(utils.createElementWithAttrs('div', {
        'data-scene': key,
        id: key
      }))
    }
    document.body.appendChild(this.siteRoot)
  }

  _initScenes () {
    for (let name in this.scenes) {
      this.scenes[name].init(this)
    }

    menu.init(this)
  }

  initDivertissement () {
    if (utils.shouldFallbackToBoringCV()) {
      this.destroy()
    } else {
      this.resizeScenes()
      this.show()
    }
  }

  getSkrollrConfiguration () {
    return {
      render: data => {
        for (let name in this.scenes) {
          if (typeof this.scenes[name].render === 'function') {
            this.scenes[name].render(data)
          }
        }
      },
      beforerender: data => {
        for (let name in this.scenes) {
          if (typeof this.scenes[name].beforerender === 'function') {
            this.scenes[name].beforerender(data)
          }
        }
      }
    }
  }

  initSkrollr () {
    if (!skrollr.get()) {
      this.skrollr = skrollr.init(Object.assign(this.defaults, this.getSkrollrConfiguration()))
      skrollr.stylesheets.init()

      skrollr.menu.init(this.skrollr, {
        animate: true,
        easing: 'swing',
        scenes: this.timing,
        scale: 1,
        duration (currentTop, targetTop) {
          return Math.abs(currentTop - targetTop) * 0.5
        }
      })
    }

    this.skrollr.refresh()
  }

  show () {
    document.body.setAttribute('data-display', 'divertissement')
    document.querySelector('#vignette').setAttribute('uiState', 'show')
    this.siteRoot.setAttribute('uiState', 'show')
    this.initSkrollr()
  }

  destroy () {
    document.body.removeAttribute('style')
    document.body.removeAttribute('data-display')
    document.querySelector('#vignette').setAttribute('uiState', 'hidden')
    this.siteRoot.setAttribute('uiState', 'hidden')
    if (skrollr.get()) {
      this.skrollr.destroy()
      window.scroll(0, 0)
    }
  }
};
