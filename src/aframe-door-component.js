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
        proximityDistance: { type: "number", default: 5},
        opened: { type: "boolean", default: false}
      },

    init: function () {
      // Initial rotation of the door
      this.element = this.el;
      var el = this.el
      this.closedRotation = this.element.getAttribute("rotation"); // Modify this to suit your door's closed state
      this.element.addEventListener('click', this.toggleDoor.bind(this))
      
      this.element.addEventListener('mouseenter', function () {
        console.log("DENTRO");
      });
      
    },

    toggleDoor: function (event) {
        console.log("SaltaEvent", event);
        var cursor = event.detail.cursorEl.getAttribute("id")
        console.log(cursor);
        if (cursor !== "front-cursor"){
          return
        }
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
        var cursor = document.querySelector("#front-cursor").components.raycaster
        var intersection = cursor.getIntersection(this.el);
        console.log(intersection);
        console.log(distance, this.data.proximityDistance);
        if (distance <= this.data.proximityDistance){
            if (this.data.opened) {
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
            this.data.opened = !this.data.opened;
        }
    },
  });


  AFRAME.registerComponent('raycaster-collide', {
    schema: {
      intersecting: { type: "boolean", default: false}
    },
    init: function () {
      this.timer = 0;
      var self = this
      this.el.addEventListener('raycaster-intersected', function (evt) {
        
        if (!this.components["raycaster-collide"].data.intersecting){
          var el = evt.target;
    // May get two intersection events per tick; same element, different faces.
          self.evt = evt;
          //console.log(evt);
          this.components["raycaster-collide"].data.intersecting = true;
          //console.log('raycaster-intersected ' + el.outerHTML);
          el.setAttribute('material', 'color', '#7f7');
        }
      });

      this.el.addEventListener('raycaster-intersected-cleared', function (evt) {
        if (this.components["raycaster-collide"].data.intersecting){
          self.evt = null;
          this.components["raycaster-collide"].data.intersecting = false;
          var el = evt.target;
    // May get two intersection events per tick; same element, different faces.
          //console.log('raycaster-intersected-cleared ' + el.outerHTML);
          el.setAttribute('material', 'color', '#f77');
        }
      }); 
        // Add a listener for the 'tick' event to periodically check intersection.
      //this.el.addEventListener('tick', this.checkIntersection.bind(this));


    },
    tick: function (time, timedelta) {
      
      this.timer += timedelta;
      if (this.timer >= 100){
        //console.log(this.evt);
      // Perform your periodic intersection check logic here.
      // For example, you can check the intersection status and take action.
        if (this.data.intersecting) {
          //console.log("Intersectando")
          //console.log(this)
          //console.log(this.el.components["door-test"]["data"]["opened"]);
          // Element is currently intersecting the raycaster.
          // Add your code to handle this scenario.

          const intersection = this.evt.detail.el.components.raycaster.getIntersection(this.el);
          if (intersection) {
            const proximity = 2;
            camera = document.querySelector("#camera");
            const cameraObject3D = camera.object3D;
            const doorObject3D = this.el.object3D;
            const doorPosition = new THREE.Vector3();
            const cameraPosition = new THREE.Vector3();
            doorObject3D.getWorldPosition(doorPosition);
            cameraObject3D.getWorldPosition(cameraPosition);
            const distance = cameraPosition.distanceTo(doorPosition);
            //console.log(distance)
            //console.log(proximity)
            if (distance < proximity) {
          
              var is_opened = this.el.components["door-test"].data.opened
              //console.log(is_opened)
              if (is_opened){
                camera.setAttribute('wasd-controls', {});
              } else {
                //console.log("CHOCANDO")
                var impulseStrength = 0.5; // Adjust the impulse strength as needed
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
              }
            }

          }

        } else {
          //console.log("No intersectando")
          // Element is not intersecting the raycaster.
          // Add your code to handle this scenario.
        }
        this.timer = 0
      }
    },
  });