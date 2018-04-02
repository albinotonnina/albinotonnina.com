import sceneSvg from './scene.svg'
import sceneHtml from './scene.html'
import anime from 'animejs'
import keywordArray from './keywords'
import {knuthShuffle} from 'knuth-shuffle'
// import * as utils from '../../scripts/utilities';
import {debounce, throttle} from 'throttle-debounce'
import {createElementWithAttrs} from '../../scripts/utilities'

export default {
  skillShape: {
    pos: [6000, 6200, 6400, 6600, 6800, 7000, 7200, 7400],
    points: [
      '729.6,-147.8 748.5,-69.4 709.5,-69.4',
      '729.6,-147.8 765.8,-53.3 709.5,-69.4',
      '729.6,-164.2 765.8,-53.3 693.4,-53.3',
      '729.6,-167 783.6,-36.7 693.4,-53.3',
      '729.6,-203 783.6,-36.7 664,-25.9',
      '729.6,-203 819.4,-3.3 625.9,9.6',
      '729.6,-230.5 833.3,9.6 625.9,9.6'
    ],
    repeat: 0
  },

  me: {
    pos: [7300, 7340],
    repeat: 0
  },

  lastKeyPercentage: 0,

  repeat: 0,

  get newskills () {
    return knuthShuffle(keywordArray.slice(0))
  },

  init (site) {
    document.querySelector('[data-scene="scene6"]').innerHTML = sceneHtml
    document.querySelector('[data-scene="scene6"] .svg').innerHTML = sceneSvg

    this.initClickEvents(site)
    this.skills = this.newskills
    this.sceneTiming = site.timing.scene6

    this.animateMe = debounce(10000, true, this.animateMe)
    this.resizeSkills = throttle(250, true, this.resizeSkills)
  },

  beforerender: function (data) {
    return this.getScrolledPercentage(data, this.sceneTiming) > 0
  },

  render: function (data) {
    this.renderSkillWords(data)
    this.resizeSkills()
    this.renderSkills(data)
    this.renderMe(data)
  },

  getScrolledPercentage (data, timing) {
    return data.curTop >= timing.begin ? Math.abs(((data.curTop - timing.begin) / timing.duration) * 100).toFixed(3) : 0
  },

  initClickEvents (site) {
    document.querySelector('#email').addEventListener('click', () => {
      window.open('mailto:albinotonnina@gmail.com')
    })

    document.querySelector('#medium').addEventListener('click', () => {
      window.open('https://medium.com/@albinotonnina')
    })

    document.querySelector('#linkedin').addEventListener('click', () => {
      window.open('http://www.linkedin.com/in/albinotonnina', '_blank')
    })

    document.querySelector('#githubsite').addEventListener('click', () => {
      window.open('http://github.com/albinotonnina/albinotonnina.com', '_blank')
    })

    document.querySelector('#instagram').addEventListener('click', () => {
      window.open('http://www.instagram.com/albino_tonnina', '_blank')
    })

    document.querySelector('#twitter').addEventListener('click', () => {
      window.open('https://twitter.com/albinotonnina', '_blank')
    })

    document.querySelector('#contactresume').addEventListener('click', () => {
      site.destroy()
    })
  },

  animateSkills (points, animationNum) {
    anime({
      targets: '#skillpath',
      points: points,
      easing: 'easeOutQuad',
      duration: 1000,
      begin: () => {
        this.skillShape.repeat = animationNum
      }
    })
  },

  animateMe () {
    anime({
      targets: '#invincible #me',
      translateY: '-30px',
      easing: 'easeInOutQuad',
      duration: 1000,
      loop: 12,
      direction: 'alternate'
    })
  },

  gen (minX, maxX, minY, maxY) {
    return {
      top: Math.floor(Math.random() * (maxX - minX + 1) + minX),
      left: Math.floor(Math.random() * (maxY - minY + 1) + minY)
    }
  },

  renderSkills (data) {
    for (let i = 0; i < this.skillShape.points.length; i++) {
      if (data.curTop > this.skillShape.pos[i] && data.curTop < this.skillShape.pos[i + 1] && this.skillShape.repeat !== i + 1) {
        this.animateSkills(this.skillShape.points[i], i + 1)
      }
    }
  },

  renderMe (data) {
    if (data.curTop > this.me.pos[0] && data.curTop < this.me.pos[1]) {
      this.animateMe()
    }
  },

  renderSkillWords (data) {
    const keyFreqPercentage = 2
    const scrolledPercentage = this.getScrolledPercentage(data, this.sceneTiming)

    if (scrolledPercentage > 2 && scrolledPercentage < 45) {
      const shouldExecute = Math.abs(scrolledPercentage - this.lastKeyPercentage) > keyFreqPercentage

      if (shouldExecute) {
        const word = this.skills.pop()
        const fontSize = Math.abs((Math.random() * 32)) + 16
        const minX = (window.innerWidth / 2)
        const maxX = window.innerWidth - (word.length * fontSize)
        const top = Math.floor((Math.random() * (window.innerHeight)) + 1)
        const left = Math.floor(Math.random() * (maxX - minX + 1) + minX)

        const wordTag = createElementWithAttrs('div', {
          class: 'word',
          style: `font-size: ${fontSize}px; top: ${top}px; left: ${left}px`
        })

        wordTag.innerHTML = word
        document.querySelector('#skills_container').appendChild(wordTag)

        anime({
          targets: wordTag,
          opacity: 0.6,
          scale: 1.4,
          direction: 'alternate',
          easing: 'easeInOutQuart'
        })

        if (this.skills.length < 1) {
          this.skills = this.newskills
        }

        this.lastKeyPercentage = scrolledPercentage
      }
    } else if (scrolledPercentage) {
      document.querySelector('#skills_container').innerHTML = ''
    }
  },

  resizeSkills () {
        // console.log('document.querySelector(\'#skills\')', document.querySelector('#skills'));
  }
}
