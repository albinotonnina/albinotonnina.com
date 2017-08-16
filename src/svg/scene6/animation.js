import anime from 'animejs';
import keyword_ordered from './keywords';
import {knuthShuffle} from 'knuth-shuffle';
import {createElementWithAttrs} from '../../scripts/utilities';

export default {
    skillShape: {
        pos: [6000, 6400, 6500, 6700, 6900, 7100, 7400],
        points: [
            '1011.3,-124.6 1048.4,78.7 957.3,96.1',
            '1011.3,-124.6 1121,146.4 911.7,137',
            '1011.3,-150.7 1143.5,167.3 897.2,150.6',
            '1011.3,-176.7 1112,138 846.5,197.8',
            '1011.3,-222.7 1196.5,216.7 831.7,211.6',
            '1011.3,-241.8 1218,236.8 804.7,236.8'
        ],
        repeat: 0
    },

    bg: {
        colors: [
            '#F40B0B',
            '#F20CEC',
            '#0F0FEF',
            '#11EDED',
            '#13EA23',
            '#E3E815',
            '#E51717',
            '#2bacb5'
        ],
        pos: [7200, 7260, 7300],
        repeat: 0
    },

    minY: 6000,
    maxY: 7300,
    keyfreq: 30,
    iskey: 0,

    repeat: 0,

    skills: knuthShuffle(keyword_ordered.slice(0)),

    init(site) {

        document.querySelector('#email').addEventListener('click', () => {
            window.open('mailto:albinotonnina@gmail.com');
        });

        document.querySelector('#medium').addEventListener('click', () => {
            window.open('https://medium.com/@albinotonnina');
        });

        document.querySelector('#linkedin').addEventListener('click', () => {
            window.open('http://www.linkedin.com/in/albinotonnina', '_blank');
        });

        document.querySelector('#githubsite').addEventListener('click', () => {
            window.open('http://github.com/albinotonnina/albinotonnina.com', '_blank');
        });

        document.querySelector('#instagram').addEventListener('click', () => {
            window.open('http://www.instagram.com/albino_tonnina', '_blank');
        });

        document.querySelector('#contactresume').addEventListener('click', () => {
            site.destroy();
        });

    },

    get newskills() {
        return knuthShuffle(keyword_ordered.slice(0));
    },

    animateSkills(points, animationNum) {
        anime({
            targets: '#skillpath',
            points: points,
            easing: 'easeOutQuad',
            duration: 1000,
            begin: () => {
                this.skillShape.repeat = animationNum;
            }
        });
    },

    animateBg(colors, animationNum) {
        anime({
            targets: '#svg6 #bg',
            fill: colors,
            easing: 'linear',
            duration: 2000,
            begin: () => {
                this.bg.repeat = animationNum;
            }
        });
    },

    render: function (pos, obj) {

        console.log('obj.curTop', obj.curTop);

        if (obj.curTop > this.minY && obj.curTop < this.maxY) {
            if (obj.curTop - this.iskey > this.keyfreq && obj.direction == "down" || this.iskey - obj.curTop > this.keyfreq && obj.direction == "up") {

                const fontRandom = Math.abs((Math.random() * 2).toFixed(3)) + 1,
                    topRandom = Math.floor(Math.random() * window.innerHeight - 164),
                    leftRandom = Math.floor(Math.random() * window.innerWidth - 64);

                const word = this.skills.pop(),
                    wordTag = createElementWithAttrs('div', {
                        class: 'word',
                        style: `font-size: ${fontRandom}rem; top: ${topRandom}px; left: ${leftRandom}px`
                    });

                wordTag.innerHTML = word;
                document.querySelector('#skills_container').appendChild(wordTag);

                anime({
                    targets: wordTag,
                    opacity: 0.6,
                    scale: 1.4,
                    direction: 'alternate',
                    easing: 'easeInOutQuart'
                });

                if (this.skills.length < 1) {
                    this.skills = this.newskills;
                }

                this.iskey = obj.curTop;

            }
        } else {
            document.querySelector('#skills_container').innerHTML = '';
        }

        for (let i = 0; i < this.skillShape.points.length; i++) {
            if (obj.curTop > this.skillShape.pos[i] && obj.curTop < this.skillShape.pos[i + 1] && this.skillShape.repeat !== i + 1) {
                this.animateSkills(this.skillShape.points[i], i + 1);
            }
        }

        for (let i = 0; i < this.bg.colors.length; i++) {
            if (obj.curTop > this.bg.pos[i] && obj.curTop < this.bg.pos[i + 1] && this.bg.repeat !== i + 1) {
                this.animateBg(this.bg.colors, i + 1);
            }
        }

    }
};