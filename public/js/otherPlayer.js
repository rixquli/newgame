import * as THREE from "https://unpkg.com/three@0.141.0/build/three.module.js";

class otherPlayer {
  constructor() {
    this.clock = new THREE.Clock();
    this.mixer = [];
    this.animationActions = [];
    this.init();
  }
  init() {}

  CreatePlayerAnimation(anim, player) {
    let index = this.mixer.length || 0;
    this.mixer[index] = new THREE.AnimationMixer(player);
    console.log(this.mixer[index].getRoot());
    console.log(player);
    console.log(player == this.mixer[index].getRoot());
    // console.log(fbx);
    if (anim[0]) {
      const animationAction = this.mixer[index].clipAction(anim[1]);
      animationAction.play();
      this.activeAction = animationAction;
      this.animationActions[index] = [];
      this.animationActions[index]["root"] = this.mixer[index].getRoot().id;
      this.animationActions[index]["Idle"] = this.mixer[index].clipAction(
        anim[0]
      );
      this.animationActions[index]["run"] = this.mixer[index].clipAction(
        anim[1]
      );
      console.log(this.animationActions);
    }
  }
  update() {
    let delta = this.clock.getDelta();
    for (let i = 0; i < this.mixer.length; i++) {
      if (this.mixer[i]) {
        this.mixer[i].update(delta);
      }
    }
  }
  setAction(action, id) {
    // toAction.play();
    if (action == "Run") action = "run";
    //console.log(this.animationActions);
    //console.log(this.animationActions.find((e)=>e.root==id));
    let toAction = this.animationActions.find((e) => e.root == id)[action];
    //console.log(this.animationActions.find((e)=>e.root==id)[action]);
    if (toAction != this.activeAction && toAction != undefined) {
      //console.log(toAction);
      this.lastAction = this.activeAction;
      this.activeAction = toAction;
      //lastAction.stop()
      this.lastAction.fadeOut(0.5);
      toAction.reset();
      toAction.fadeIn(0.5);
      toAction.play();
    }
  }
  deletePlayer(id) {
    console.log(id);
  }
}

export {otherPlayer} ;
