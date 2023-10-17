AFRAME.registerComponent("door-opener-test", {
    schema: {
        rotation: { type: "string", default: "0 90 0" }, // Default open rotation
        proximityDistance: { type: "number", default: 1.5 }
      },

    init: function () {
      // Initial rotation of the door
      this.opened = false;
      this.closedRotation = this.el.getAttribute("rotation"); // Modify this to suit your door's closed state
  
      // Add an event listener to the window for the spacebar key press
      window.addEventListener("keydown", (e) => {
        if (e.keyCode === 32) {
          // Spacebar is pressed
          this.toggleDoor();
        }
      });
    },
  
    toggleDoor: function () {
        // Check the current state of the door
        camera = document.querySelector("#camera");
        
        const doorObject3D = this.el.object3D;
        const cameraObject3D = camera.object3D;
        
        // Get the world positions of the camera and door
        const doorPosition = new THREE.Vector3();
        const cameraPosition = new THREE.Vector3();
        doorObject3D.getWorldPosition(doorPosition);
        cameraObject3D.getWorldPosition(cameraPosition);
        const distance = cameraPosition.distanceTo(doorPosition);

        if (distance <= this.data.proximityDistance){
            if (this.opened) {
                console.log("CIERRA");
                this.el.removeAttribute("animation");
                this.el.setAttribute("animation", {property: "rotation", to: this.closedRotation, dur: 500, easing: "linear"});
            } else {
                console.log("ABRE");
                this.el.removeAttribute("animation");
                this.el.setAttribute("animation", {property: "rotation", to: this.data.rotation, dur: 500,  easing: "linear"});
                
                //this.el.setAttribute("rotation", this.data.rotation);
            }
        

            // Toggle the state
            this.opened = !this.opened;
        }
    },
  });

AFRAME.registerComponent("door-test", {
    schema: {
        rotation: { type: "string", default: "0 90 0" }, // Default open rotation
        proximityDistance: { type: "number", default: 5}
      },

    init: function () {
      // Initial rotation of the door
      this.opened = false;
      this.element = this.el;
      this.closedRotation = this.element.getAttribute("rotation"); // Modify this to suit your door's closed state
      this.element.addEventListener('click', this.toggleDoor.bind(this))
      this.el.addEventListener("raycaster-intersected", evt => {
        this.intersectingRaycaster = evt.detail.el.components.raycaster;
        this.detail = evt.detail;
      });
      this.el.addEventListener("raycaster-intersected-cleared", () => {
        this.intersectingRaycaster = null;
      });
      
    },
    tick: function() {
      //Intentamos calcular colision.
      if (!this.intersectingRaycaster) {
        //console.log("no intersecta");
        camera = document.querySelector("#camera");
        camera.setAttribute('wasd-controls', {});
        return;
     }
     const intersection = this.intersectingRaycaster.getIntersection(this.el);

     //console.log("intersection", intersection);
      if (intersection) {


        // nos queeadmos quietos
          const proximity = 1.7;
          camera = document.querySelector("#camera");
          const cameraObject3D = camera.object3D;
          const doorObject3D = this.el.object3D;
          const doorPosition = new THREE.Vector3();
          const cameraPosition = new THREE.Vector3();
          doorObject3D.getWorldPosition(doorPosition);
          cameraObject3D.getWorldPosition(cameraPosition);
          const distance = cameraPosition.distanceTo(doorPosition);

          //console.log(camera.getAttribute("position"));
          //console.log("rotation", camera.getAttribute("rotation"));
          //console.log(camera.body);
          //console.log(distance)
          if (distance < proximity) {
            //console.log("Estoy cerca");
            if (this.opened) {
              camera.setAttribute('wasd-controls', {});
            } else{
              
              // calculemos el impulso
              var impulseStrength = 0.1; // Adjust the impulse strength as needed
              var point = intersection.point
              var cameraPos = camera.getAttribute("position")
              var direction = new THREE.Vector3().subVectors(point, cameraPos);
              direction.setY(0);
              var impulse = new THREE.Vector3().copy(direction).multiplyScalar(-impulseStrength);
              var new_pos = {
                x: cameraPos.x + impulse.x,
                y: cameraPos.y + impulse.y,
                z: cameraPos.z + impulse.z,
              }
              camera.setAttribute("animation", {property: "position", to: new_pos, dur: 100, easing: "linear"});
              /*camera.setAttribute('position', {
                x: cameraPos.x + impulse.x,
                y: cameraPos.y + impulse.y,
                z: cameraPos.z + impulse.z,
              });*/
              camera.removeAttribute('wasd-controls');
            }
          }
        
        // your calculations
      }
   },
    toggleDoor: function () {
        console.log("SaltaEvent");
        camera = document.querySelector("#camera");
        const doorObject3D = this.el.object3D;
        const cameraObject3D = camera.object3D;
        //console.log(this.el)
        // Get the world positions of the camera and door
        const doorPosition = new THREE.Vector3();
        const cameraPosition = new THREE.Vector3();
        doorObject3D.getWorldPosition(doorPosition);
        cameraObject3D.getWorldPosition(cameraPosition);
        const distance = cameraPosition.distanceTo(doorPosition);
        console.log(distance, this.data.proximityDistance);
        if (distance <= this.data.proximityDistance){
            if (this.opened) {
                console.log("CIERRA");
                this.el.removeAttribute("animation");
                this.el.setAttribute("animation", {property: "rotation", to: this.closedRotation, dur: 500, easing: "linear"});
            } else {
               console.log("ABRE");
                this.el.removeAttribute("animation");
                this.el.setAttribute("animation", {property: "rotation", to: this.data.rotation, dur: 500,  easing: "linear"});
                
                //this.el.setAttribute("rotation", this.data.rotation);
            }
        

            // Toggle the state
            this.opened = !this.opened;
        }
    },
  });
