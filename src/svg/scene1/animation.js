
export default {
	lightfreq: Math.floor(Math.random() * (10 - 5 + 1)) + 5,
	lightlast: 'none',
	islight: 0,
	minY: 400,
	maxY: 700,

	init(site){
        document.querySelector('#intro2').addEventListener('click', () => {
            window.open('http://www.workshare.com', '_blank');
        });


        document.querySelector('#viewresume').addEventListener('click', () => {
            site.destroy();
        });

    },

	render: function(pos, obj) {
		if (obj.curTop > this.minY && obj.curTop < this.maxY) {
			if (obj.curTop - this.islight > this.lightfreq && obj.direction == "down" || this.islight - obj.curTop > this.lightfreq && obj.direction == "up") {
				this.lightlast = this.lightlast == 'none' ? 'inline' : 'none';
                document.querySelector('#mbplight').style.display = this.lightlast;

				this.islight = obj.curTop;
			}
		}
	}
};
