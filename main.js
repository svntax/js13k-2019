AFRAME.registerComponent("hookshot", {	
	schema: {
		hand: {default: ""}
	},
	
	init: function(){
		var data = this.data;
		var el = this.el;
		
		var config = {
			hand: this.data.hand,
			model: false
		};
		
		el.setAttribute('vive-controls', config);
		el.setAttribute('oculus-touch-controls', config);
		
		el.addEventListener("buttondown", function(){
			var raycast = el.querySelector("#raycast");
			
			var shot = document.getElementById("projectile");
			shot.setAttribute("visible", true);
			shot.setAttribute("position", el.object3D.position);
			shot.object3D.rotation.x = el.object3D.rotation.x;
			shot.object3D.rotation.y = el.object3D.rotation.y;
			shot.object3D.rotation.z = el.object3D.rotation.z;
			
			var point = new THREE.Vector3(0, -1, 0);
			el.object3D.localToWorld(point);
			var globalDir = point.sub(el.object3D.position);
			shot.setAttribute("velocity", globalDir);
		});
	},
});

AFRAME.registerComponent("velocity", {
	schema: {
		type: "vec3", default: {x: 0, y: 0, z: 0}
	},
	
	tick: function(time, deltaTime){
		var data = this.data;
		var el = this.el;
		var dt = deltaTime / 1000;
		el.object3D.position.x += data.x * dt;
		el.object3D.position.y += data.y * dt;
		el.object3D.position.z += data.z * dt;
	}
});