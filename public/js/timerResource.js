import * as THREE from "https://unpkg.com/three@0.141.0/build/three.module.js";
import { FontLoader } from "/js/FontLoader.js";
import { TextGeometry } from "/js/TextGeometry.js";

class TimerResource {
  constructor(obj, scene) {
    this.obj = obj;
    this.prop = obj.prop;
    this.timer = 0;
    this.scene = scene;
    this.fontLoader = new FontLoader();

    this.setTimer();
  }

  setTimer() {
    if (this.prop == "stone") this.addTimer(5);
    else if (this.prop == "wheat") this.addTimer(2);
    else if (this.prop == "wood") this.addTimer(5);
  }

  addTimer(time) {
    this.obj.collectable = false;
    this.fontLoader.load(
      "https://unpkg.com/three@0.141.0/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        const geometry = new TextGeometry("00:0" + time, {
          font: font,
          size: 5,
          height: 5,
          //curveSegments: 12,
          //bevelEnabled: true,
          //bevelThickness: 10,
          //bevelSize: 8,
          //bevelOffset: 0,
          //bevelSegments: 5,
        });

        let text = new THREE.Mesh(
          geometry,
          new THREE.MeshPhongMaterial({ color: 0x3e00cf })
        );
        text.position.set(
          this.obj.position.x - 10,
          this.obj.position.y + 10,
          this.obj.position.z
        );
        text.time = time;
        this.scene.add(text);
        text.name = text.id;
        this.updateTimer(time, text.id);
      }
    );
  }

  updateTimer(time, id) {
    this.currentId = id;
    let interval = setInterval(() => {
      if (!this.scene.getObjectByName(this.currentId)) return;
      if (Number(this.scene.getObjectByName(this.currentId).time) != 0) {
        let newTimeProp =
          Number(this.scene.getObjectByName(this.currentId).time) - 1;
        let position = {
            x: this.scene.getObjectByName(this.currentId).position.x,
            y: this.scene.getObjectByName(this.currentId).position.y,
            z: this.scene.getObjectByName(this.currentId).position.z,
          },
          newId = this.scene.getObjectByName(this.currentId).id;
        this.scene.remove(this.scene.getObjectByName(this.currentId));
        this.createtext(newTimeProp, position.x, position.y, position.z, newId);
      } else {
        this.obj.collectable = true;
        this.scene.remove(this.scene.getObjectByName(this.currentId));
        console.log("you can collect");
        clearInterval(interval);
      }
    }, 1000);
  }

  createtext(time, x, y, z, id) {
    this.fontLoader.load(
      "https://unpkg.com/three@0.141.0/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        const geometry = new TextGeometry("00:0" + time, {
          font: font,
          size: 5,
          height: 5,
          //curveSegments: 12,
          //bevelEnabled: true,
          //bevelThickness: 10,
          //bevelSize: 8,
          //bevelOffset: 0,
          //bevelSegments: 5,
        });

        let text = new THREE.Mesh(
          geometry,
          new THREE.MeshPhongMaterial({ color: 0x3e00cf })
        );
        text.position.set(x, y, z);
        text.name = id;
        text.time = time;
        this.scene.add(text);
        return (this.currentId = text.name);
      }
    );
  }
}

export {TimerResource}
