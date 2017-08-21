import * as utils from '../../scripts/utilities';

export default {
    iskey: 0,
    keyfreq: Math.floor(Math.random() * 2) + 4,
    lightfreq: Math.floor(Math.random() * 21) + 10,
    lightlast: 'none',
    islight: 0,
    mousefreq: Math.floor(Math.random() * 21) + 30,
    ismouse: 0,
    mouselast: 0,
    minY: 3600,
    maxY: 5800,
    newq: [0, 0],

    init(site) {
        this.addVideoPlayer(site);
    },

    addVideoPlayer(site) {

        const videoPlayerDiv = utils.createElementWithAttrs('div', {
            id: 'videoPlayer'
        });

        const videoPlayerIframe = utils.createElementWithAttrs('iframe', {
            id: 'vimeoPlayer',
            src: '//player.vimeo.com/video/88016428',
            width: '100%',
            height: '100%',
            frameborder: '0',
            allowfullscreen: true
        });

        videoPlayerDiv.appendChild(videoPlayerIframe);
        site.siteRoot.appendChild(videoPlayerDiv);
    },

    render: function (data) {
        if (data.curTop > 5550 && data.curTop < 5900) {

            const rect = document.querySelector('#iphone5positionpath').getBoundingClientRect();

            const videoPlayerIframe = document.querySelector('#videoPlayer');
            videoPlayerIframe.style.left = `${rect.left}px`;
            videoPlayerIframe.style.top = `${rect.top}px`;
            videoPlayerIframe.style.width = `${rect.width}px`;
            videoPlayerIframe.style.height = `${rect.height}px`;
        }

        if (data.curTop > this.minY && data.curTop < this.maxY) {
            if (data.curTop - this.iskey > this.keyfreq && data.direction === 'down' || this.iskey - data.curTop > this.keyfreq && data.direction === 'up') {

                const keys1 = document.querySelectorAll('#keyboard rect'),
                    keys2 = document.querySelectorAll('#keyboard2 rect'),
                    keys3 = document.querySelectorAll('#keyboard3 rect');

                const randomKey1 = Math.floor(Math.random() * keys1.length),
                    randomKey2 = Math.floor(Math.random() * keys2.length),
                    randomKey3 = Math.floor(Math.random() * keys3.length);

                keys1[randomKey1].style.fill = '#ccd1d9';
                keys2[randomKey2].style.fill = '#f7f9f8';
                keys3[randomKey3].style.fill = '#f7f9f8';

                this.iskey = data.curTop;
            }

            if (data.curTop - this.islight > this.lightfreq && data.direction === 'down' || this.islight - data.curTop > this.lightfreq && data.direction === 'up') {
                this.lightlast = this.lightlast == 'none' ? 'inline' : 'none';
                document.querySelector('#imaclight').style.display = this.lightlast;
                this.islight = data.curTop;
            }
        }
    }
};