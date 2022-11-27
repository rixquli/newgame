import * as THREE from "https://unpkg.com/three@0.141.0/build/three.module.js";
import { FBXLoader } from "/js/FBXLoader.js";
import {Color, Solver} from "/js/color.js"

class Villager {
  constructor(scene) {
    this.scene = scene;
    this.FBXLoader = new FBXLoader();
    this.mixer = [];
    this.villagers = [];
    this.villagerActions = [];
    this.clock = new THREE.Clock();
    this.villagerSpeed = 0.2;
    this.activeAction = [];
    this.lastAction = [];
    this.villagerImgFilter = [];
    //this.id = id
    //this.villager = this.villagers[id]
    //this.createVillager(position, house);
  }
  createVillager(position, house) {
    console.log(...position);
    this.houseN = house;
    for (let i = 1; i < 4; i++) {
      this.FBXLoader.load(
        "/character/stickman/source/Simple_Character.fbx",
        (fbx) => {
          this.villagers[house + "." + i] = fbx;
          console.log(position);
          this.villagers[house + "." + i].position.set(...position);
          this.villagers[house + "." + i].scale.set(0.03, 0.03, 0.03);
          this.villagers[house + "." + i].house = house;
          this.villagers[house + "." + i].job = "Is not working";
          this.villagers[house + "." + i].housePos = position;

          this.villagers[house + "." + i].stay = false;
          this.villagers[house + "." + i].returnHouse = false;

          let new_mtl = new THREE.MeshBasicMaterial({
            color: 0xffffff,
          });

          this.villagers[house + "." + i].traverse((o) => {
            o.material = new_mtl;
          });

          this.mixer[house + "." + i] = new THREE.AnimationMixer(fbx);

          if (fbx.animations[0]) {
            const animationAction = this.mixer[house + "." + i].clipAction(
              fbx.animations[1]
            );
            //animationAction.play();
            this.activeAction[house + "." + i] = animationAction;
            this.villagerActions[house + "." + i] = [];
            this.villagerActions[house + "." + i]["idle"] = this.mixer[
              house + "." + i
            ].clipAction(fbx.animations[2]);
            this.villagerActions[house + "." + i]["run"] = this.mixer[
              house + "." + i
            ].clipAction(fbx.animations[0]);
          }
          this.scene.add(this.villagers[house + "." + i]);
        },
        undefined,
        (error) => {
          console.error(error);
        }
      );
      setTimeout(() => {
        this.modelReady = true;
        console.log(this.villagerActions);
        console.log("model ready");
      }, 500);
    }
    this.addVillagerMenu();
  }
  addVillagerMenu() {
    if (this.houseN == 1) return;
    if (document.querySelector("#noVillagerText")?.style) {
      document.querySelector("#noVillagerText").style.visibility = "hidden";
    }
    let workerList = "";
    for (let i = 1; i < this.houseN; i++) {
      console.log(i);
      workerList =
        workerList +
        `<dl class="villagerList">
          <dt class="houseNumber">House n°${i}</dt>
          <dd class="villagerName">
            <label>
              <img style="${
                this.villagerImgFilter[i + ".1"] || ""
              }" class="villagerColor" src="/img/pngegg.png">
            <input villagerid="${
              i + ".1"
            }" class="color" type="color" name="colorPicker">
        </label>
        <button villagerid="${i + ".1"}" class="jobButton">Villageois ${i}.1
        <br/>
        <div villagerid="${i + ".1"}" class="job">${
          this.villagers[i + ".1"].job
        }</div>
        </button>
        </dd>
        <dd class="villagerName">
          <label>
                <img style="${
                  this.villagerImgFilter[i + ".2"] || ""
                }" class="villagerColor" src="/img/pngegg.png">
              <input villagerid="${
                i + ".2"
              }" class="color" type="color" name="colorPicker">
          </label>
          <button villagerid="${
            i + ".2"
          }" class="jobButton">Villageois ${i}.2<br/>
        <div villagerid="${i + ".2"}" class="job">${
          this.villagers[i + ".2"].job
        }</div>
        </button>
        </dd>
        <dd class="villagerName">
          <label>
              <img style="${
                this.villagerImgFilter[i + ".3"] || ""
              }" class="villagerColor" src="/img/pngegg.png">
            <input villagerid="${
              i + ".3"
            }" class="color" type="color" name="colorPicker">
        </label>
          <button villagerid="${
            i + ".3"
          }" class="jobButton">Villageois ${i}.3<br/>
        <div villagerid="${i + ".3"}" class="job">${
          this.villagers[i + ".3"].job
        }
          </div>
          </button>
          </dd>
          </dl>`;
    }
    //this.addColorPicker();

    document.querySelector("#collectMenu").innerHTML = workerList;
    let colorWell = document.querySelectorAll(".color");
    colorWell.forEach((e) => {
      e.removeEventListener("change", (e) => this.updateColor(e), false);
    });
    colorWell.forEach((e) => {
      e.addEventListener("change", (e) => this.updateColor(e), false);
    });
    //colorWell.select();
    document.querySelectorAll(".jobButton").forEach((e) => {
      e.removeEventListener("click", (e) => this.doJob(e), false);
    });
    document.querySelectorAll(".jobButton").forEach((e) => {
      e.addEventListener("click", (e) => this.doJob(e), false);
    });
  }

  updateColor(e) {
    console.log(e.target.value);
    const rgb = new Color().hexToRgb(e.target.value);
    console.log(rgb);
    if (rgb.length !== 3) {
      alert("Invalid format!");
      return;
    }

    const color = new Color(rgb[0], rgb[1], rgb[2]);
    const solver = new Solver(color);
    const result = solver.solve();
    e.path[1].children[0].style = result.filter;
    this.villagerImgFilter[e.path[1].children[1].getAttribute("villagerid")] =
      result.filter;
    console.log(result);
    let new_mtl = new THREE.MeshBasicMaterial({
      color: new THREE.Color(parseInt(e.target.value.replace("#", "0x"), 16)),
    });

    this.villagers[e.target.getAttribute("villagerid")].traverse((o) => {
      o.material = new_mtl;
    });
  }

  //addColorPicker() {
  //  this.pickr = Pickr.create({
  //    el: ".color-picker",
  //    theme: "classic", // or 'monolith', or 'nano'
  //
  //    swatches: [
  //      "rgba(244, 67, 54, 1)",
  //      "rgba(233, 30, 99, 0.95)",
  //      "rgba(156, 39, 176, 0.9)",
  //      "rgba(103, 58, 183, 0.85)",
  //      "rgba(63, 81, 181, 0.8)",
  //      "rgba(33, 150, 243, 0.75)",
  //      "rgba(3, 169, 244, 0.7)",
  //      "rgba(0, 188, 212, 0.7)",
  //      "rgba(0, 150, 136, 0.75)",
  //      "rgba(76, 175, 80, 0.8)",
  //      "rgba(139, 195, 74, 0.85)",
  //      "rgba(205, 220, 57, 0.9)",
  //      "rgba(255, 235, 59, 0.95)",
  //      "rgba(255, 193, 7, 1)",
  //    ],
  //
  //    components: {
  //      // Main components
  //      preview: true,
  //      opacity: true,
  //      hue: true,
  //
  //      // Input / output Options
  //      interaction: {
  //        hex: true,
  //        rgba: true,
  //        hsla: true,
  //        hsva: true,
  //        cmyk: true,
  //        input: true,
  //        clear: true,
  //        save: true,
  //      },
  //    },
  //  });
  //  this.pickr.on("save", (color, instance) => {
  //    console.log('Event: "save"', color, instance);
  //  });
  //}

  doJob(e) {
    this.villagers[e.target.getAttribute("villagerid")].job = `from ${
      this.scene.getObjectByName("click").prop
    } at ${this.scene.getObjectByName("click").position.x / 20}, ${
      this.scene.getObjectByName("click").position.z / 20
    } to House  n°${e.target.getAttribute("villagerid").split(".")[0]}`;
    this.villagers[e.target.getAttribute("villagerid")].collectTarget = [
      this.scene.getObjectByName("click").position.x,
      -25,
      this.scene.getObjectByName("click").position.z,
    ];
    this.villagers[e.target.getAttribute("villagerid")].jobType =
      this.scene.getObjectByName("click").prop;

    this.addVillagerMenu();
  }

  returnToHouse(id) {
    this.villagers[id].returnHouse = true;
    this.villagers[id].stay = false;
  }

  villagerStay(id) {
    let type = this.villagers[id].jobType;
    //if (this.villagers[id].returnHouse) {
    //}
    if (type == "wood") {
      setTimeout(() => {
        this.returnToHouse(id);
      }, 1500);
    } else if (type == "stone") {
      setTimeout(() => {
        this.returnToHouse(id);
      }, 3000);
    }
  }

  moveVillagers(id, target) {
    //this.setAction(this.villagerActions[0]);
    if (!this.villagers[id]?.job) return;
    if (this.villagers[id].job == "Is not working") return;
    //let directionX = 0,
      //directionZ = 0;

    let mesh1 = {
      x: this.villagers[id].position.x,
      z: this.villagers[id].position.z,
    };
    let mesh2 = {
      x: target[0],
      z: target[2],
    };

    var dx = Math.abs(mesh1.x - mesh2.x);
    if (mesh1.x > mesh2.x) {
      this.villagers[id].position.x -= Math.min(dx, this.villagerSpeed);
      //directionX = -90;
    } else if (mesh1.x < mesh2.x) {
      this.villagers[id].position.x += Math.min(dx, this.villagerSpeed);
      //directionX = 90;
    }

    var dz = Math.abs(mesh1.z - mesh2.z);
    if (mesh1.z > mesh2.z) {
      this.villagers[id].position.z -= Math.min(dz, this.villagerSpeed);
      //directionZ = 180;
    } else if (mesh1.z < mesh2.z) {
      this.villagers[id].position.z += Math.min(dz, this.villagerSpeed);
      //directionZ = 0;
    }

    if (mesh1.x == mesh2.x && mesh1.z == mesh2.z) {
      if (
        this.villagers[id].stay == false ||
        this.villagers[id].stay == undefined
      ) {
        this.villagers[id].stay = true;
        //this.villagerStay(id);
      }
      this.setAction(this.villagerActions[id]["idle"], id);
    } else {
      //console.log((directionX + directionZ) / 2);
      if (this.villagers[id].returnHouse) {
        this.villagers[id].lookAt(...this.villagers[id].housePos);
        //this.villagers[id].rotation.x = 0;
        //this.villagers[id].rotation.z = 0;
        //this.villagers[id].rotation.y =
        //  ((((directionX + directionZ) / 2) * Math.PI) / 180) * -1;
      } else {
        this.villagers[id].lookAt(...this.villagers[id].collectTarget);
        //this.villagers[id].rotation.x = 0;
        //this.villagers[id].rotation.z = 0;
        //this.villagers[id].rotation.y =
        //  (((directionX + directionZ) / 2) * Math.PI) / 180;
      }

      this.setAction(this.villagerActions[id]["run"], id);
    }
  }

  //startTimer(id) {
  //  this.time = 0;
  //  this.time = setInterval(() => {
  //    if (this.villagers[id].stay == true) return;
  //    this.time += 100;
  //  }, 100);
  //
  //}

  work() {
    if (this.houseN == 1) return;
    for (let i = 1; i < this.houseN; i++) {
      for (let j = 1; j < 4; j++) {
        //this.setAction(this.villagerActions[0]);
        if (!this.villagers[i + "." + j]?.job) return;
        //if (this.villagers[i + "." + j].job == "Is not working") return

        if (
          this.villagers[i + "." + j].stay == true &&
          !this.villagers[i + "." + j].returnHouse
        ) {
          this.villagerStay(i + "." + j);
        }
        if (
          !this.villagers[i + "." + j].returnHouse &&
          !this.villagers[i + "." + j].stay
        ) {
          this.moveVillagers(
            i + "." + j,
            this.villagers[i + "." + j].collectTarget
          );
          //if (!this.startingTimer) {
          //  this.startingTimer = true;
          //  this.startTimer(i + "." + j);
          //}
        }
        if (
          this.villagers[i + "." + j].returnHouse == true &&
          !this.villagers[i + "." + j].stay
        ) {
          this.moveVillagers(i + "." + j, this.villagers[i + "." + j].housePos);
        }
        if (
          this.villagers[i + "." + j].returnHouse == true &&
          this.villagers[i + "." + j].stay == true
        ) {
          this.addResources(this.villagers[i + "." + j].jobType, 5);
          this.villagers[i + "." + j].returnHouse = false;
          this.villagers[i + "." + j].stay = false;
        }
      }
    }
  }

  addResources(value, nbr) {
    if (!document.querySelector(`#${value}Count`)?.textContent) return;
    document.querySelector(`#${value}Count`).textContent =
      Number(document.querySelector(`#${value}Count`).textContent) + nbr;
  }

  setAction(toAction, id) {
    // toAction.play();
    if (toAction != this.activeAction[id] && toAction != undefined) {
      //console.log(toAction);
      this.lastAction[id] = this.activeAction[id];
      this.activeAction[id] = toAction;
      //lastAction.stop()
      this.lastAction[id].fadeOut(1);
      toAction.reset();
      toAction.fadeIn(1);
      toAction.play();
    }
  }

  update() {
    this.delta = this.clock.getDelta();

    if (this.mixer && this.modelReady == true) {
      for (let i = 1; i < this.houseN; i++) {
        if (!this.mixer[i + ".3"]) return;
        this.mixer[i + ".1"].update(this.delta);
        this.mixer[i + ".2"].update(this.delta);
        this.mixer[i + ".3"].update(this.delta);
      }
      //for (const e of this.mixer) {
      //  e.update(this.delta)
      //}
      //this.mixer.forEach((e) => {
      //  e.update(this.delta);
      //});
      //this.animationActions[0].play()
      //console.log(this.villagers["1.1"]);
      //console.log(this.villagerActions[0].isRunning());
      //this.mixer["1.1"].update(this.delta);
      //this.mixer.update(this.delta);
    }
    //console.log(this.player.position);

    this.work();
    //this.moveVillagers();
  }
}

export { Villager }