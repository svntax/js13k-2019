AFRAME.registerComponent("hookshot", {
	schema: {
		hand: {default: ""}
	},
	
	init: function(){
		var data = this.data;
		var el = this.el;
		
		var config = {
			hand: this.data.hand,
			model: false,
			orientationOffset: {x: 240, y: 0, z: 0}
		};
		
		this.el.setAttribute('vive-controls', config);
		this.el.setAttribute('oculus-touch-controls', config);
		
		el.addEventListener("buttondown", function(){
			console.log("Button pressed")
		});
	},
});