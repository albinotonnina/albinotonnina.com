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

    render: function (pos, obj) {

        if (obj.curTop > 5550 && obj.curTop < 5900) {

            if (!document.getElementById('vimeoPlayer')) {
                Site.addVideoPlayer();
            }

            const rect = document.querySelector('#iphone5positionpath').getBoundingClientRect();
            console.log(rect);
            utils.setAttributes(document.querySelector('#videoPlayer'), {
                left: rect.left + 'px',
                top: rect.top + 'px',
                width: rect.width + 'px',
                height: rect.height + 'px'
            });

        }

        if (obj.curTop > this.minY && obj.curTop < this.maxY) {
            if (obj.curTop - this.iskey > this.keyfreq && obj.direction === 'down' || this.iskey - obj.curTop > this.keyfreq && obj.direction === 'up') {

                const keys1 = document.querySelectorAll('#keyboard rect'),
                    keys2 = document.querySelectorAll('#keyboard2 rect'),
                    keys3 = document.querySelectorAll('#keyboard3 rect');

                const randomKey1 = Math.floor(Math.random() * keys1.length),
                    randomKey2 = Math.floor(Math.random() * keys2.length),
                    randomKey3 = Math.floor(Math.random() * keys3.length);

                keys1[randomKey1].style.fill = '#ccd1d9';
                keys2[randomKey2].style.fill = '#f7f9f8';
                keys3[randomKey3].style.fill = '#f7f9f8';

                this.iskey = obj.curTop;
            }

            if (obj.curTop - this.islight > this.lightfreq && obj.direction === 'down' || this.islight - obj.curTop > this.lightfreq && obj.direction === 'up') {
                this.lightlast = this.lightlast == 'none' ? 'inline' : 'none';
                document.querySelector('#imaclight').style.display = this.lightlast;
                this.islight = obj.curTop;
            }
        }
    }
};