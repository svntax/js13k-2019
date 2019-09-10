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
			//Hook projectile, which is separate from the controller-tracked model
			var shot = document.getElementById("projectile");
			shot.setAttribute("visible", true);
			shot.setAttribute("position", el.object3D.position);
			shot.object3D.rotation.x = el.object3D.rotation.x;
			shot.object3D.rotation.y = el.object3D.rotation.y;
			shot.object3D.rotation.z = el.object3D.rotation.z;
			
			//Get the forward direction of this controller
			//Note: y and z are flipped in this operation, so the forward vector is in the y-axis
			var point = new THREE.Vector3(0, -1, 0);
			el.object3D.localToWorld(point);
			var globalDir = point.sub(el.object3D.position);
			var resultVel = globalDir.multiplyScalar(5);
			shot.setAttribute("velocity", {
				vel: resultVel //TODO test schema change of velocity component
			});
			//Need to emit this event in order for the velocity to actually update
			//otherwise the element's properties (vel) carry over from before
			shot.emit("updateVelocity", {x: resultVel.x, y: resultVel.y, z: resultVel.z}, false);
		});
		
		el.addEventListener("hit", function(e){
			console.log(e);
		});
	},
});

AFRAME.registerComponent("fish", {
	schema: {
		radius: {type: "number", default: 0.4}
	},
	
	init: function(){
		var vertices = [
			/*1, 1, 1, 	- 1, - 1, 1, 	- 1, 1, - 1, 	1, - 1, - 1,*/
			-1, 0, 0,    1, 0, 0,    0, 1, 0,    0, -1, 0,
			0, 0, 1,    0, 0, -1
		];
		//Order of vertices matters, needs to be counter-clockwise order when facing camera
		var indices = [
			/*2, 1, 0, 	0, 3, 2,	1, 3, 0,	2, 3, 1*/
			0, 4, 2,    4, 1, 2,    4, 0, 3,   4, 3, 1,
			5, 0, 2,    5, 2, 1,   0, 5, 3,    5, 1, 3,
		];
		var geometry = new THREE.PolyhedronBufferGeometry( vertices, indices, this.data.radius, 0);
		var material = new THREE.MeshPhongMaterial( { color: 0xfcc201} );
		
		var bodyMesh = new THREE.Mesh(geometry, material);
		bodyMesh.scale.set(1.2, 1, 0.4);
		this.el.object3D.add(bodyMesh);
		
		var tailMesh = new THREE.Mesh(geometry, material);
		tailMesh.position.set(0.6, 0, 0);
		tailMesh.scale.set(0.4, 0.5, 0.2);
		this.el.object3D.add(tailMesh);
	}
});

AFRAME.registerComponent("hook-target", {
	schema: {},
	
	init: function(){
		var data = this.data;
		var el = this.el;
		el.addEventListener("hit", function(e){
			console.log("target hit");
		});
	}
});

AFRAME.registerComponent("velocity", {
	schema: {
		vel: {type: "vec3", default: {x: 0, y: 0, z: 0}},
		gravity: {type: "number", default: 0}
	},
	
	init: function(){
		var el = this.el;
		var data = this.data;
		//Assign variable to el so that it's editable from other components/entities
		el.vel = {x: data.vel.x, y: data.vel.y, z: data.vel.z};
		this.gravity = data.gravity;
		
		el.addEventListener("updateVelocity", function(e){
			el.vel = {x: e.detail.x, y: e.detail.y, z: e.detail.z};
		});
	},
	
	tick: function(time, deltaTime){
		var data = this.data;
		var el = this.el;
		var dt = deltaTime / 1000;
		el.object3D.position.x += el.vel.x * dt;
		el.object3D.position.y += el.vel.y * dt;
		el.object3D.position.z += el.vel.z * dt;
		
		el.vel.y += this.gravity * dt;
		if(el.vel.y < -10){ //Limit falling speed
			el.vel.y = -10;
		}
	}
});