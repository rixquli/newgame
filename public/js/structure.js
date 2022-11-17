//let random = Math.floor(Math.random() * 100);
if (
  !this.seedRandom[this.structureSeed] ||
  this.seedRandom[this.structureSeed] == NaN
) {
  this.addSeedRandom();
}
let random = this.randomNumber(this.seedRandom[this.structureSeed]);
//function worldGen() {
//    let worldInGen = world();
//    return worldInGen * 10 ** (worldInGen.toString().length - 2);
//  }
//
//let random = worldGen()

if (random < this.randomP.houseVillager) {
  this.createFloor(
    (Ammo = this.AmmoClone),
    x,
    z,
    0x00ff00,
    "img/grass.png",
    "houseVillager"
  );

  this.loadStructure("house_minecraft/scene.gltf", x, z, 20);
  //this.createVillager(Ammo = AmmoClone, x,z)
} else if (random < this.randomP.stone) {
  console.log("stone");
  this.createFloor(
    (Ammo = this.AmmoClone),
    x,
    z,
    0xcccccc,
    "img/andesite.png",
    "stone"
  );
  this.loadStructure("stylized__rock/scene.gltf", x, z, 40);
} else if (random < this.randomP.forest) {
  this.createFloor(
    (Ammo = this.AmmoClone),
    x,
    z,
    0xffea33,
    "img/grass.png",
    "forest"
  );
  this.loadStructure("a_simple_tree/scene.gltf", x, z, 0.01);
} else if (random < this.randomP.farmWithWheat) {
  this.createFloor(
    (Ammo = this.AmmoClone),
    x,
    z,
    0xffea33,
    "https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/37/Dirt_Path_%28top_texture%29_JE2_BE2.png",
    "wheat"
  );
  //this.loadStructure("source/Field of wheat--eWhaaKNh755/FieldOfWheat(1).gltf", x, z, 1.2);
} else if (random < this.randomP.farmWithoutWheat) {
  this.createFloor(
    (Ammo = this.AmmoClone),
    x,
    z,
    0xffea33,
    "https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/37/Dirt_Path_%28top_texture%29_JE2_BE2.png"
  );
} else {
  this.createFloor(
    (Ammo = this.AmmoClone),
    x,
    z,
    0x00ff00,
    "img/grass.png",
    "plain"
  );
}
this.structureSeed++;
